import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';
import fetchPlanetsAPI from '../services/planetsAPI';
import { filterBy } from '../helper/helperFunctions';

export const DEFAULT_COLUMNS = [
  'population',
  'orbital_period',
  'diameter',
  'rotation_period',
  'surface_water',
];

function PlanetProvider({ children }) {
  const [data, setData] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [planetNames, setPlanetNames] = useState('');
  const [numetrics, setNumericFilters] = useState([]);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

  useEffect(() => {
    const fetchPlanets = async () => {
      const results = await fetchPlanetsAPI();
      setData(results);
      setPlanets(results);
      setTableColumns(Object.keys(results[0]));
    };
    fetchPlanets();
  }, []);

  useEffect(() => {
    const filteredData = planets
      .filter((planet) => (
        filterBy.name(planetNames, planet)
        && filterBy.numeric(numetrics, planet)));
    setData(filteredData);
  }, [planetNames, planets, numetrics]);

  const numetricFilter = useCallback((filter) => {
    setColumns(
      (prevOptions) => prevOptions.filter((option) => option !== filter.column),
    );
    setNumericFilters((prevState) => [...prevState, filter]);
  }, []);

  const removeNumericFilter = useCallback((filter) => {
    if (filter === 'All') {
      setColumns(DEFAULT_COLUMNS);
      return setNumericFilters([]);
    }
    setColumns((prevOptions) => [...prevOptions, filter.column]);
    setNumericFilters((prevState) => (
      prevState.filter((prevFilter) => prevFilter.column !== filter.column)));
  }, [setColumns, setNumericFilters]);

  const [order, setOrder] = useState({
    column: 'population',
    sort: '',
  });

  const allPlanetsContext = {
    data,
    tableColumns,
    columns,
    order,
    setOrder,
    setData,
    setPlanetNames,
    numetricFilter,
    setNumericFilters,
    removeNumericFilter,
    filters: {
      numetrics,
      planetNames,
    },
  };

  return (
    <PlanetsContext.Provider value={ allPlanetsContext }>
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PlanetProvider;
