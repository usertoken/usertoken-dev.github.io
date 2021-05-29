///
const flattenFilterAndSort = arr => {
  let flatArray = [];
  for(var i = 0; i < arr.length; i++) {
      if(Array.isArray(arr[i])) {
          flatArray = flatArray.concat(flatten(arr[i]));
      } else {
          flatArray.push(arr[i]);
      }
  }
  return typeof(flatArray[0]) === 'string' ? [...new Set(flatArray)].sort() : [...new Set(flatArray)].sort((num1, num2) => {return num1 - num2}) 
}
///
module.exports = { flattenFilterAndSort };
