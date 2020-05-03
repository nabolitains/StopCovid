const HYPHENS_POSITIONS = [8, 12, 16, 20];
const VALUE_REGEXP = /^[0-9A-Fa-f]{32}$/;

/**
 * Insert value to a source array at position
 * @param {Array} source array to insert
 * @param {number} position position to insert
 * @param {*} value value to insert
 * @returns {Array}
 */
function insert(source, position, value) {
  return [...source.slice(0, position), value, ...source.slice(position)];
}

/**
 * Format string to UUID format 
 * @param {string} value string of 32 hexadecimal numbers
 * @returns {string} formatted toUUID string
 */
export function toUUID (value) {
  if (typeof value !== 'string') {
    throw new Error(`Value must be string`);
  }
  if (!VALUE_REGEXP.test(value)) {
    value = value.padEnd(32, '0')
  }

  let array = value.split('');
  let offset = 0;
  for (const num of HYPHENS_POSITIONS) {
    const position = num + offset++;
    array = insert(array, position, '-');
  }
  return array.join('');
}

export function fromUUID (value) {
  return value.replace(/-/gi, "");
}