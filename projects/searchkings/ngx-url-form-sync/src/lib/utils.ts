import { isPlainObject } from 'lodash';

export const deepFilter = (value, fn) => {
  if (Array.isArray(value)) {
    return filterArray(value, fn);
  } else if (isPlainObject(value)) {
    return filterObject(value, fn);
  }

  return value;
};

const filterObject = (obj, fn) => {
  const newObj = {};
  let key;
  let value;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      value = deepFilter(obj[key], fn);

      if (fn.call(obj, value, key, obj)) {
        if (value !== obj[key] && !isCollection(value)) {
          value = obj[key];
        }

        newObj[key] = value;
      }
    }
  }

  return newObj;
};

const filterArray = (array, fn) => {
  const filtered = [];

  array.forEach((value, index, currArray) => {
    value = deepFilter(value, fn);

    if (fn.call(currArray, value, index, currArray)) {
      if (value !== currArray[index] && !isCollection(value)) {
        value = currArray[index];
      }

      filtered.push(value);
    }
  });

  return filtered;
};

const isCollection = value => {
  return Array.isArray(value) || isPlainObject(value);
};
