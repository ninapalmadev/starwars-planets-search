import React, { useContext, useCallback, useReducer } from 'react';
import PlanetsContext from '../context/PlanetsContext';

function Filters() {
  const { filters: { planetNames }, setPlanetNames,
    numetricFilter, removeNumericFilter, columns } = useContext(PlanetsContext);

  const handleChange = useCallback(({ target: { value } }) => {
    setPlanetNames(value);
  }, [setPlanetNames]);

  const [numetrics, setNumericFilter] = useReducer((state, newState) => ({
    ...state, ...newState,
  }), {
    column: 'population',
    comparison: 'maior que',
    value: '0',
  });

  const { column, comparison, value } = numetrics;

  const numetricContext = useCallback(() => {
    numetricFilter(numetrics);
  }, [numetricFilter, numetrics]);

  const handleNumetricFilter = useCallback(({ target: { name, value } }) => {
    setNumericFilter({ [name]: value });
  }, []);

  const removeAll = useCallback(() => removeNumericFilter('All'), [removeNumericFilter]);

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
        <button
          type="button"
          data-testid="button-remove-filters"
          onClick={ removeAll }
        >
          Remover Filtros
        </button>

      </section>
    </div>
  );
}

export default Filters;
