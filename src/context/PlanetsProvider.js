import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';
import fetchPlanetsAPI from '../services/planetsAPI';
import { filterBy, sortBy } from '../helper/helperFunctions';

export const DEFAULT_COLUMNS = [
  'population',
  'orbital_period',
  'diameter',
  'rotation_period',
  'surface_water',
];

const A_COMES_FIRST_THEN_B = -1;
const B_COMES_FIRST_THEN_A = 1;

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

  const sortPlanets = useCallback((sortOrder) => {
    const sortedData = [...data].sort((a, b) => {
      const firstLetter = Number(a[sortOrder.column]);
      if (!firstLetter) return B_COMES_FIRST_THEN_A;

      const lastLetter = Number(b[sortOrder.column]);
      if (!lastLetter) return A_COMES_FIRST_THEN_B;

      return sortBy[sortOrder.order](firstLetter, lastLetter);
    });

    setData(sortedData);
  }, [data]);

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
  }, []);

  const allPlanetsContext = {
    data,
    tableColumns,
    columns,
    setPlanetNames,
    sortPlanets,
    numetricFilter,
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
