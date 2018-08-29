const test = require('ava');
const deletePath = require('../src/delete_path');

/* deletePath */

test('it must delete object path', (t) => {
  const obj = { a: { b: { c: [{ d: 1 }] } } };
  const target = 'a.b.c[0].d';

  const result = deletePath(obj, target);

  const expected = { a: { b: { c: [{}] } } };
  t.deepEqual(result, expected);
});

test('it must delete (splice) array path', (t) => {
  const obj = { a: { b: { c: [0, 1, 2] } } };
  const target = 'a.b.c[1]';

  const result = deletePath(obj, target);

  const expected = { a: { b: { c: [0, 2] } } };
  t.deepEqual(result, expected);
});
