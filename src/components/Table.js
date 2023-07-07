import React, { useContext } from 'react';
import PlanetsContext from '../context/PlanetsContext';

function Table() {
  const { tableColumns, data } = useContext(PlanetsContext);

  return (
    <div>
      <h2>Star Wars Planets Search</h2>
      <table>
        <thead>
          <tr>
            { tableColumns.map((column) => (
              <th key={ column }>{ column }</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((planet) => (
            <tr data-testid="planet-name" key={ planet.name }>
              {Object.entries(planet).map(([column, value]) => (
                <td key={ column }>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
