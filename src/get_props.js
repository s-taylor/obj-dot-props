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
      const thisPath = { fullKey, depth };

      // console.log('DEBUG', `${key} ${value}`);

      if (Array.isArray(value)) {
        // const arrKey = `${fullKey}[${i}]`;
        // const arrPath = { fullKey: arrKey, depth: depth + 1 };
        console.log('fullKey', fullKey);
        return value.map((v, i) => getter(v, `${fullKey}[${i}]`));

        // console.log('key', key);
        // return flatMap(value, (v, i) => {
        //   const arrKey = `${fullKey}[${i}]`;
        //   const arrPath = { fullKey: arrKey, depth: depth + 1 };

        //   // NEED TO CALL ARRAY METHOD IF ARRAY

        //   // THIS IS THE SAME AS ....
        //   if (typeof v === 'object') {
        //     return getter(v, arrKey, depth + 2).concat(arrPath);
        //   }
        //   return arrPath;
        // }).concat(parents ? thisPath : []);
      }

      // THIS...
      if (typeof value === 'object') {
        return getter(value, fullKey, depth + 1)
          .concat(parents ? thisPath : []);
      }

      return thisPath;
    });
  };
  return getter;
};

module.exports = (obj, options = {}) => {
  const getter = getProps(options);
  const results = getter(obj);
  console.log('results', results);
  return sort(results).map(r => r.fullKey);
};
