import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';

export default function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [namePlanet, setNamePlanet] = useState('');
  const [filteredPlanets, setFilteredPlanets] = useState([]);

  useEffect(() => {
    fetch('https://swapi.dev/api/planets')
      .then((response) => response.json())
      .then((data) => {
        const withoutResidents = data.results.filter((planet) => delete planet.residents);
        setPlanets(withoutResidents);
        setFilteredPlanets(withoutResidents);
      });
  }, []);

  useEffect(() => {
    const filterName = planets.filter((planet) => planet.name.toLowerCase()
      .includes(namePlanet.toLowerCase()));
    setFilteredPlanets(filterName);
  }, [namePlanet, planets]);

  const allPlanets = {
    planets: filteredPlanets,
    namePlanet,
    setNamePlanet,
    setFilteredPlanets,
  };

  return (
    <PlanetsContext.Provider value={ allPlanets }>
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// PlanetsProvider;
