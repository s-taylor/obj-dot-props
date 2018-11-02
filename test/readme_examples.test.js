const test = require('ava');
const { mapProps } = require('../src/map_props');

// test.only('.mapProps with parents', (t) => {
//   const obj = { a: { b: [{ c: 1 }, { d: 2 }] }, c: { e: 3 } };

//   const result = mapProps(obj, (value, path) => {
//     console.log('path', path);
//     if (/^a\.b\[.\]/.test(path) && typeof value === 'object') {
//       return { ...value, cache: true };
//     }
//     return value;
//   }, { parents: true });

//   console.log('result', JSON.stringify(result, null, 2));
// });

// TEST NESTED ARRAYS ALSO
test.only('.mapProps with parents', (t) => {
  const obj = { a: [[1]] };

  const result = mapProps(obj, (value, path) => {
    console.log('path', path);
    if (/^a\.b\[.\]/.test(path) && typeof value === 'object') {
      return { ...value, cache: true };
    }
    return value;
  }, { parents: true });

  console.log('result', JSON.stringify(result, null, 2));
});
