const cloneDeep = require('lodash.clonedeep');
const get = require('lodash.get');
const set = require('lodash.set');
const deletePath = require('./src/delete_path');
const getProps = require('./src/get_props');

// const depthDesc = (a, b) => (a.depth < b.depth ? 1 : a.depth > b.depth ? -1 : 0);

exports.UNSET = '$UNSET_PROPERTY$';

exports.mapProps = (obj, predicate, options = {}) => {
  const result = cloneDeep(obj); // set/unset mutates, so clone it
  const paths = getProps(result, options);
  paths.forEach((path) => {
    const value = get(obj, path);
    const newValue = predicate(value, path, obj);
    if (newValue === exports.UNSET) deletePath(result, path);
    else if (value !== newValue) set(result, path, newValue);
  });
  return result;
};
