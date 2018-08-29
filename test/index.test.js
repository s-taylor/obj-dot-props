const test = require('ava');
const { mapProps, UNSET } = require('../index');

/* mapProps */

test.skip('it must not mutate the object', (t) => {
  // use all three options to ensure this
});

test('it must allow updating props', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };

  const result = mapProps(obj, value => value * 2);

  const expected = { a: 2, b: [4, 6], c: { d: 8 } };
  t.deepEqual(result, expected);
});

test('it must not change anything if value returned', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };

  const result = mapProps(obj, value => value);

  t.deepEqual(result, obj);
});

test('it must allow unsetting object keys', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };

  const result = mapProps(obj, (value, pathName) => {
    if (value === 1) return UNSET;
    if (pathName === 'c.d') return UNSET;
    return value;
  });

  const expected = { b: [2, 3], c: { } };

  t.deepEqual(result, expected);
});


test('it can be used to clean up empty objects', (t) => {
  const obj = { b: [1, 2], c: {}, d: { e: 3 } };

  const result = mapProps(obj, (value) => {
    if (typeof value === 'object' && Object.keys(value).length === 0) return UNSET;
    return value;
  }, { parents: true });

  const expected = { b: [1, 2], d: { e: 3 } };

  t.deepEqual(result, expected);
});

test('it must allow unsetting array elements', (t) => {
  const obj = {
    a: 1, b: [2, 3], c: { d: 4 }, e: [5],
  };

  const result = mapProps(obj, (value, pathName) => {
    if (value === 2) return UNSET;
    if (pathName === 'e[0]') return UNSET;
    return value;
  });

  const expected = {
    a: 1, b: [3], c: { d: 4 }, e: [],
  };

  t.deepEqual(result, expected);
});

test('it can be used to clean up empty arrays', (t) => {
  const obj = { b: [1, 2], c: [], d: { e: 3 } };

  const result = mapProps(obj, (value) => {
    if (Array.isArray(value) && value.length === 0) return UNSET;
    return value;
  }, { parents: true });

  const expected = { b: [1, 2], d: { e: 3 } };

  t.deepEqual(result, expected);
});
