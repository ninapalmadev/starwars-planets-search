export const compareBy = {
  'maior que': (a, b) => a > b,
  'menor que': (a, b) => a < b,
  'igual a': (a, b) => a === b,
};

export const filterBy = {
  numeric: (numericFilters, planet) => (
    numericFilters.every(({ column, comparison, value }) => (
      compareBy[comparison](Number(planet[column]), Number(value))))),
  name: (name, planet) => planet.name.toLowerCase().includes(name.toLowerCase()),
};
