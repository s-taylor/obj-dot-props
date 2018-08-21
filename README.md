# obj-dot-props

## What does it do?

It returns a list of a given objects properties (paths), including nested properties in dot notation format.

## How do I use it?

```js
const getDotProps = require('obj-dot-props');

const obj = { a: 1, b: [2, 3], c: { d: 4 } };
const props = getDotProps(obj);

// returns ['a', 'b[0]', 'b[1]', 'c.d'];
```

## Anything else?

This is designed to be compatible with lodash's `.get` and `.set` methods, so you can iterate through an object and get / update all of it's nested values.
