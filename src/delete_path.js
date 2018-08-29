const TRIM = /\]$/; // to trim trailing square bracket
const SPLIT_RE = /\.|\[|\]\.*/;

const deletePath = (obj, fullPath) => {
  const pathArr = fullPath.replace(TRIM, '').split(SPLIT_RE);

  let target = obj;
  for (let i = 0; i < pathArr.length; i += 1) {
    const path = pathArr[i];

    if (i === pathArr.length - 1) {
      if (Array.isArray(target)) {
        const index = parseInt(path, 10);
        target.splice(index, 1);
      } else delete target[path];
    }
    target = target[path];
  }

  return obj;
};

module.exports = deletePath;
