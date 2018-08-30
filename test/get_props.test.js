const test = require('ava');
const cloneDeep = require('lodash.clonedeep');
const get = require('lodash.get');
const getProps = require('../src/get_props');

/* getProps */

test('it must not mutate the object', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };
  const original = cloneDeep(obj);

  getProps(obj);

  t.deepEqual(obj, original);
});

test('it must return expected format (excluding parents)', (t) => {
  const obj = {
    a: 1, b: [2, 3], c: { d: 4 }, e: [], f: {},
  };

  const result = getProps(obj, { parents: false });
  const expected = ['b[0]', 'b[1]', 'c.d', 'a'];

  t.deepEqual(result, expected);
});

test('it must return expected format (including parents)', (t) => {
  const obj = {
    a: 1, b: [2, 3], c: { d: 4 }, e: [], f: {},
  };

  const result = getProps(obj, { parents: true });
  const expected = ['b[0]', 'b[1]', 'c.d', 'a', 'b', 'c', 'e', 'f'];

  t.deepEqual(result, expected);
});

test('it works on deeply nested properies also (excluding parents)', (t) => {
  const obj = { a: [{ b: { c: 2 } }], d: { e: { f: [2] } } };

  const result = getProps(obj, { parents: false });
  const expected = ['a[0].b.c', 'd.e.f[0]'];

  t.deepEqual(result, expected);
});

test('it works on deeply nested properies also (including parents)', (t) => {
  const obj = { a: [{ b: { c: 2 } }], d: { e: { f: [2] } } };

  const result = getProps(obj, { parents: true });
  const expected = ['a[0].b.c', 'd.e.f[0]', 'a[0].b', 'd.e.f', 'd.e', 'a', 'd'];

  t.deepEqual(result, expected);
});

test('it must return an empty array when given an empty object', (t) => {
  const result = getProps({});

  t.deepEqual(result, []);
});

test('it must be compatible with lodash.get', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };

  const props = getProps(obj, { parents: false });
  const result = props.map(prop => get(obj, prop)).sort();

  const expected = [1, 2, 3, 4];
  t.deepEqual(result, expected);
});

test('it must throw when not given an object', (t) => {
  const error = t.throws(() => getProps('a string'));

  t.is(error.message, 'Invalid argument, must be an object');
});
