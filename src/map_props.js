const cloneDeep = require('lodash.clonedeep');
const get = require('lodash.get');
const set = require('lodash.set');
const deletePath = require('./delete_path');
const getProps = require('./get_props');

exports.REMOVE = '$REMOVE_PROPERTY$';

exports.mapProps = (obj, predicate, options = {}) => {
  // set AND remove mutates, so clone it
  const result = cloneDeep(obj);
  const paths = getProps(result, options);
  paths.forEach((path) => {
    const value = get(obj, path);
    const newValue = predicate(value, path, obj);
    if (newValue === exports.REMOVE) deletePath(result, path);
    else if (value !== newValue) set(result, path, newValue);
  });
  return result;
};
