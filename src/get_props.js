const orderBy = require('lodash.orderby');

const flatMap = (a, cb) => [].concat(...a.map(cb));
const sort = arr => orderBy(arr, ['depth', 'fullKey'], ['desc', 'asc']);

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

module.exports = (obj, options = {}) => {
  const getter = getProps(options);
  const results = getter(obj);
  return sort(results).map(r => r.fullKey);
};
