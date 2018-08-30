const test = require('ava');
const cloneDeep = require('lodash.clonedeep');
const { mapProps, REMOVE } = require('../src/map_props');

/* mapProps */

test('it must not mutate the object', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };
  const original = cloneDeep(obj);

  mapProps(obj, () => undefined);

  t.deepEqual(obj, original);
});

test('it must allow updating props', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };

  const result = mapProps(obj, value => value * 2, { parents: false });

  const expected = { a: 2, b: [4, 6], c: { d: 8 } };
  t.deepEqual(result, expected);
});

test('it must not change anything if value returned (excluding parents)', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };

  const result = mapProps(obj, value => value, { parents: false });

  t.deepEqual(result, obj);
});

test('it must not change anything if value returned (including parents)', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };

  const result = mapProps(obj, value => value, { parents: true });

  t.deepEqual(result, obj);
});

test('it must allow unsetting object keys', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };

  const result = mapProps(obj, (value, pathName) => {
    if (value === 1) return REMOVE;
    if (pathName === 'c.d') return REMOVE;
    return value;
  });

  const expected = { b: [2, 3], c: { } };

  t.deepEqual(result, expected);
});

test('it can be used to clean up empty objects', (t) => {
  const obj = { b: [1, 2], c: {}, d: { e: 3 } };

  const result = mapProps(obj, (value) => {
    if (typeof value === 'object' && Object.keys(value).length === 0) return REMOVE;
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
    if (value === 2) return REMOVE;
    if (pathName === 'e[0]') return REMOVE;
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
    if (Array.isArray(value) && value.length === 0) return REMOVE;
    return value;
  }, { parents: true });

  const expected = { b: [1, 2], d: { e: 3 } };

  t.deepEqual(result, expected);
});
