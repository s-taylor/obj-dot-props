const cloneDeep = require('lodash.clonedeep');
const get = require('lodash.get');
const set = require('lodash.set');
const deletePath = require('./delete_path');
const getProps = require('./get_props');

// const depthDesc = (a, b) => (a.depth < b.depth ? 1 : a.depth > b.depth ? -1 : 0);

exports.REMOVE = '$REMOVE_PROPERTY$';

exports.mapProps = (obj, predicate, options = {}) => {
  const result = cloneDeep(obj); // set/remove mutates, so clone it
  const paths = getProps(result, options);
  paths.forEach((path) => {
    const value = get(obj, path);
    const newValue = predicate(value, path, obj);
    if (newValue === exports.REMOVE) deletePath(result, path);
    else if (value !== newValue) set(result, path, newValue);
  });
  return result;
};
