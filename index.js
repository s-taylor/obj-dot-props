const flatMap = require('lodash.flatmap');

const dotProps = (obj, prefix) => {
  if (typeof obj !== 'object') throw new Error('Invalid argument, must be an object');

  return flatMap(Object.keys(obj), (key) => {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      return flatMap(value, (v, i) => {
        const arrKey = `${fullKey}[${i}]`;
        if (typeof v === 'object') return dotProps(v, arrKey);
        return arrKey;
      });
    }

    if (typeof value === 'object') return dotProps(value, fullKey);
    return fullKey;
  });
};

module.exports = dotProps;
