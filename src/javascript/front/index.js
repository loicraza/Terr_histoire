document.API_ROOT = "http://localhost:3001";

/**
* @param {any[]} arr 
* @param {(any) => boolean} fn 
* @returns 
*/
document.partition = (arr, fn) => {
  return arr.reduce(
    (acc, val, i, arr) => {
      acc[fn(val, i, arr) ? 0 : 1].push(val);
      return acc;
    },
    [[], []]
  );
}

/**
 * @returns 
 */
document.getInputsValues = () => {
  return [
    ["requiredInputs", "optionalInputs"],
    ["credentialInputs"],
  ].map((ids) =>
    [...document.querySelectorAll(
      ids
        .map((id) => `#${id} > div > input`)
        .join(", ")
    )
      .values()
    ].reduce((obj, element) =>
    ({
      ...obj,
      [element.id]: (element.value || undefined)
    }), {})
  );
} 