const cloneDeep = require('lodash.clonedeep');
const get = require('lodash.get');
const set = require('lodash.set');
const orderBy = require('lodash.orderby');
const deletePath = require('./src/delete_path');

const flatMap = (a, cb) => [].concat(...a.map(cb));

const sort = arr => orderBy(arr, ['depth', 'fullKey'], ['desc', 'asc']);

// const depthDesc = (a, b) => (a.depth < b.depth ? 1 : a.depth > b.depth ? -1 : 0);

exports.UNSET = '$UNSET_PROPERTY$';

const getProps = (options = {}) => {
  const { parents = false } = options;

  const getter = (obj, prefix = '', depth = 1) => {
    if (typeof obj !== 'object') throw new Error('Invalid argument, must be an object');

    return flatMap(Object.keys(obj), (key) => {
      const value = obj[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const thisKey = { fullKey, depth };

      if (Array.isArray(value)) {
        return flatMap(value, (v, i) => {
          const arrKey = `${fullKey}[${i}]`;
          if (typeof v === 'object') {
            return getter(v, arrKey, depth + 2);
          }
          return { fullKey: arrKey, depth: depth + 1 };
        }).concat(parents ? thisKey : []);
      }

      if (typeof value === 'object') {
        return getter(value, fullKey, depth + 1)
          .concat(parents ? thisKey : []);
      }

      return thisKey;
    });
  };
  return getter;
};

exports.getProps = (obj, options = {}) => {
  const getter = getProps(options);
  const results = getter(obj);
  return sort(results).map(r => r.fullKey);
};

exports.mapProps = (obj, predicate, options = {}) => {
  const result = cloneDeep(obj); // set/unset mutates, so clone it
  const paths = exports.getProps(result, options);
  paths.forEach((path) => {
    const value = get(obj, path);
    const newValue = predicate(value, path, obj);
    if (newValue === exports.UNSET) deletePath(result, path);
    else if (value !== newValue) set(result, path, newValue);
  });
  return result;
};
