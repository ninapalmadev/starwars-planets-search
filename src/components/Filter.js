import { useContext } from 'react';
import PlanetsContext from '../context/PlanetsContext';

function Filter() {
  const { namePlanet, setNamePlanet } = useContext(PlanetsContext);

  const filterByName = ({ target }) => {
    setNamePlanet(target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={ namePlanet }
        data-testid="name-filter"
        onChange={ filterByName }
        placeholder="Search by name"
      />
    </div>
  );
}

export default Filter;
