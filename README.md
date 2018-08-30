# obj-dot-props

## What does it do?

It provides methods to read and mutate with nested objects.

Currently there are three methods and a REMOVE constant

* .remove - delete an objects property (or remove an array element)
* .getProps - list all of an objects properties (deeply) in dot notation format
* .mapProps - map over all of an objects properties (deeply)
* .REMOVE - used in map props to facilitate deleting properities and removing array elements

## How do I use it?

### .remove

... details to come ...

### .getProps

The `.getProps` method allows you to list all of an objects properties (including nested proprties within objects and arrays) in dot notation format.
By default, parent paths (object and array paths) are excluded, and the function will only return the paths of their children (object keys and array elements).

```js
const { getProps } = require('obj-dot-props');

const obj = { a: 1, b: [2, 3], c: { d: 4 }, e: [], f: {} };
const props = getProps(obj);

// props === ['b[0]', 'b[1]', 'c.d', 'a'];
```

However if you want to include parents you can do that also using `{ parents: true }`.

```js
const { getProps } = require('obj-dot-props');

const obj = { a: 1, b: [2, 3], c: { d: 4 }, e: [], f: {} };
const props = getProps(obj, { parents: true });

// props === ['b[0]', 'b[1]', 'c.d', 'a', 'b', 'c', 'e', 'f'];
```

You'll probably notice the ordering of the keys is not alphabetical, as you might expect. This is intentional, the keys are sorted first by "depth" and then alphabetically. This is relevant when using mapProps and traversing the object (see below).

### .mapProps

The `.mapProps` method allows you to map over all of an objects properties (including nested properties in object and arrays), and manipulate these as you see fit.

* Like you would with a normal `.map` function, you simply provide a predicate method which receives the value and path (in dot notation format) and returns an updated value `(value, path) => { return [updatedvalue] }`.
    * Because the path is in dot notation format, you may need to use a regex to compare if you're only interested in the key.
    * If you want to leave a value unchanged, you still need to return it! Otherwise it will be set to undefined.
    * You should probably always do type checks before manipulating values as who knows what values the object has.
* The map function will iterate through the object in order from the most deeply nested properties, to the least deeply nested properties. This is relevant because if for example you wanted to manipulate a parent object based on it's children, you'd want to have finished manipulating all the children first (see REMOVE example).

As an example, say I wanted to multiply all values in an object by 2.

```js
const { mapProps } = require('obj-dot-props');

const obj = { a: 1, b: [2, 3], c: { d: 4 } };

const result = mapProps(obj, value => value * 2);

// result === { a: 2, b: [4, 6], c: { d: 8 } };
```

Like with `.getProps` parents are excluded by default, but you can always include them. Bear in mind if you do this, you probably need to do type checks before manipulating values.

As an example, say we wanted to add `{ cache: false }` key value to all objects in `.b`.

```js
const obj = { a: { b: [{ c: 1}, { d: 2 }] }, c: { e: 3 } };

const result = mapProps(obj, (value, path) => {
    if (/^a\.b/.test(path)) return { ...value, cache: true };
    return value;
});

```

#### How do I remove a value?

Returning `undefined` does not remove a value. I did this intentionally as perhaps you want to set an object key or array item to undefined. But if you do wish to fully remove an object key or array item, you can return REMOVE in your predicate function.

Say for example, I wanted to remove all numbers from arrays, and then if they're empty delete the array.

```js
const { mapProps, REMOVE } = require('obj-dot-props');

const obj = { a: [1, 2, true], b: [3, 4, 5], c: [6, 7, 'burrito'] };

const result = mapProps(obj, value => {
    if (typeof value === 'number') return REMOVE;
    if (Array.isArray(value) && value.length === 0) return REMOVE;
    return value;
}, { parents: true });

// result === { a: [true], c: ['burrito'] };
```

This works because `.mapProps` iterates through the deepest nested keys first, so that the numbers are removed before we check the array length is 0. 

## Todo

These are features I'd like to add

* Allow setting options on function, OR just getting the default version
* Review and cleanup naming conventions of variables
* Add examples USING the path! not just the value.
* Allow a custom object cloner and default to JSON.stringify and parse
* mapProps - Pass in current key to predicate function
* mapProps - Pass in parent to predicate function (is this possible)?
