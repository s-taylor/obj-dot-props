const test = require('ava');
const get = require('lodash.get');
const cloneDeep = require('lodash.clonedeep');
const getDotProps = require('../index');

test('it must not mutate the object', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };
  const original = cloneDeep(obj);

  getDotProps(obj);

  t.deepEqual(obj, original);
});

test('it must return expected format', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };

  const result = getDotProps(obj);
  const expected = ['a', 'b[0]', 'b[1]', 'c.d'];

  t.deepEqual(result, expected);
});

test('it works on deeply nested properies also', (t) => {
  const obj = { a: [{ b: { c: 2 } }], d: { e: { f: [2] } } };

  const result = getDotProps(obj);
  const expected = ['a[0].b.c', 'd.e.f[0]'];

  t.deepEqual(result, expected);
});

test('it must return an empty array when given an empty object', (t) => {
  const result = getDotProps({});

  t.deepEqual(result, []);
});

test('it must be compatible with lodash.get', (t) => {
  const obj = { a: 1, b: [2, 3], c: { d: 4 } };

  const props = getDotProps(obj);
  const result = props.map(prop => get(obj, prop));

  const expected = [1, 2, 3, 4];
  t.deepEqual(result, expected);
});

test('it must throw when not given an object', (t) => {
  const error = t.throws(() => getDotProps('a string'));

  t.is(error.message, 'Invalid argument, must be an object');
});
