import React from 'react';
import './App.css';
import Table from './components/Table';
import PlanetsProvider from './context/PlanetsProvider';
import Filter from './components/Filter';

function App() {
  return (
    <PlanetsProvider>
      <Filter />
      <Table />
    </PlanetsProvider>
  );
}

export default App;
