import React, { useContext, useEffect, useCallback, useReducer } from 'react';
import PlanetsContext from '../context/PlanetsContext';

function Filters() {
  const {
    filters: {
      planetNames,
      numetrics = [],
    },
    setPlanetNames,
    numetricFilter,
    removeNumericFilter,
    columns,
  } = useContext(PlanetsContext);

  const handleChange = useCallback(({ target: { value } }) => {
    setPlanetNames(value);
  }, [setPlanetNames]);

  const [numetricsFilter, setNumericFilter] = useReducer((state, newState) => ({
    ...state, ...newState,
  }), {
    column: 'population',
    comparison: 'maior que',
    value: '0',
  });

  const { column, comparison, value } = numetricsFilter;

  const numetricContext = useCallback(() => {
    numetricFilter(numetricsFilter);
  }, [numetricFilter, numetricsFilter]);

  const handleNumetricFilter = useCallback(({ target: { name, value: tgtValue } }) => {
    setNumericFilter({ [name]: tgtValue });
  }, []);

  useEffect(() => {
    setNumericFilter({ column: columns[0] });
  }, [columns]);

  const removeAll = useCallback(() => removeNumericFilter('All'), [removeNumericFilter]);

  const removeFilters = useCallback((filter) => {
    removeNumericFilter(filter);
  }, [removeNumericFilter]);

  return (
    <div>
      <input
        type="text"
        placeholder="Filter by name"
        data-testid="name-filter"
        onChange={ handleChange }
        value={ planetNames }
      />
      <section>
        <label htmlFor="column">
          Type:
          <select
            data-testid="column-filter"
            name="column"
            onChange={ handleNumetricFilter }
            value={ column }
          >
            {columns.map((option) => (
              <option key={ option } value={ option }>{option}</option>
            ))}
          </select>
        </label>
        <label htmlFor="comparison">
          Comparison:
          <select
            data-testid="comparison-filter"
            name="comparison"
            onChange={ handleNumetricFilter }
            value={ comparison }
          >
            <option value="maior que">maior que</option>
            <option value="menor que">menor que</option>
            <option value="igual a">igual a</option>
          </select>
        </label>
        <label htmlFor="value">
          Value:
          <input
            name="value"
            type="number"
            data-testid="value-filter"
            onChange={ handleNumetricFilter }
            value={ value }
          />
        </label>
        <button
          type="button"
          data-testid="button-filter"
          onClick={ numetricContext }
        >
          Filtrar
        </button>
        <div>
          {numetrics.map((filter, index) => (
            <div key={ index } data-testid="filter">
              <span>
                {filter.column}
                {filter.comparison}
                {filter.value}
              </span>
              <button
                onClick={ () => removeFilters(filter) }
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          data-testid="button-remove-filters"
          onClick={ removeAll }
        >
          Remover
        </button>
      </section>
    </div>
  );
}

export default Filters;
