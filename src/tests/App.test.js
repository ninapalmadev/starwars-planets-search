import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import fetchPlanetsAPI from '../services/planetsAPI';
import userEvent from '@testing-library/user-event';
import { compareBy, filterBy } from '../helper/helperFunctions';
import data from '../data';
import PlanetsProvider from '../context/PlanetsProvider';

jest.setTimeout(10000);

afterEach(() => jest.clearAllMocks());
beforeEach(() => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(data),
  }));
})

describe('Testa opções de filtros', () => {
  test('Testa se existe filtro por nome', async () => { 
    render(
      <PlanetsProvider>
        <App />
      </PlanetsProvider>
    );
    const inputName = screen.getByTestId(/name-filter/i);
    expect(inputName).toBeInTheDocument();
    userEvent.type(inputName, 'End');
    const planet = await screen.findByRole('cell', { name:/Endor/i });
    expect(planet).toBeInTheDocument();
  })
})

describe('Teste de aplicação toda', () => {
  it('Teste se todos os elementos da tela estão sendo renderizados', async () => {
    render(<App />);
    await waitFor(() => {
      const title = screen.getByText(/Star Wars Planets Search/i);
      expect(title).toBeInTheDocument();
    }, { timeout: 10000 });

    const nameFilter = screen.getByTestId('name-filter');
    expect(nameFilter).toBeInTheDocument();
    const columnFilter = screen.getByTestId('column-filter');
    expect(columnFilter).toBeInTheDocument();
    const comparisonFilter = screen.getByTestId('comparison-filter');
    expect(comparisonFilter).toBeInTheDocument();
    const valueFilter = screen.getByTestId('value-filter');
    expect(valueFilter).toBeInTheDocument();
  });

  it('Teste se os filtros estão funcionando', async () => {
    render(<App />);
    
    await waitFor(() => {
      const title = screen.getByText(/Star Wars Planets Search/i);
      expect(title).toBeInTheDocument();
    }, { timeout: 10000 });
    
    const nameFilter = screen.getByTestId('name-filter');
    expect(nameFilter).toBeInTheDocument();
    const columnFilter = screen.getByTestId('column-filter');
    expect(columnFilter).toBeInTheDocument();
    const comparisonFilter = screen.getByTestId('comparison-filter');
    expect(comparisonFilter).toBeInTheDocument();
    const valueFilter = screen.getByTestId('value-filter');
    expect(valueFilter).toBeInTheDocument();

    userEvent.type(nameFilter, 'a');
    expect(nameFilter).toHaveValue('a');

    userEvent.selectOptions(columnFilter, 'population');
    expect(columnFilter).toHaveValue('population');

    userEvent.selectOptions(comparisonFilter, 'maior que');
    expect(comparisonFilter).toHaveValue('maior que');

    const filterButton = screen.getByTestId('button-filter');
    expect(filterButton).toBeInTheDocument();
    userEvent.click(filterButton);

  });

  it('Teste se a tabela está sendo renderizada', async () => {
    render(<App />);        
    await waitFor(() => {
      const title = screen.getByText(/Star Wars Planets Search/i);
      expect(title).toBeInTheDocument();
    }, { timeout: 10000 });

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

  });
});

describe('Testa cobertura do helperFunctions', () => {
  it('deve retornar true quando a é maior que b', () => {
    expect(compareBy['maior que'](2, 1)).toBe(true);
  });

  it('deve retornar true quando a é menor que b', () => {
    expect(compareBy['menor que'](1, 2)).toBe(true);
  });

  it('deve retornar true quando a é igual a b', () => {
    expect(compareBy['igual a'](2, 2)).toBe(true);
  });

  it('deve retornar false quando a é maior que b', () => {
    expect(compareBy['maior que'](1, 2)).toBe(false);
  })

  it('deve retornar true quando todas as comparações numéricas forem verdadeiras', () => {
    const numericFilters = [
      { column: 'population', comparison: 'maior que', value: '1000000' },
      { column: 'diameter', comparison: 'menor que', value: '5000' },
    ];

    const planet = {
      population: '1500000',
      diameter: '4000',
    };

    expect(filterBy.numeric(numericFilters, planet)).toBe(true);
  });

  it('deve retornar false quando uma das comparações numéricas for falsa', () => {
    const numericFilters = [
      { column: 'population', comparison: 'maior que', value: '1000000' },
      { column: 'diameter', comparison: 'menor que', value: '5000' },
    ];

    const planet = {
      population: '1500000',
      diameter: '6000',
    };

    expect(filterBy.numeric(numericFilters, planet)).toBe(false);
  });

  it('deve retornar true quando o nome do planeta incluir o nome buscado', () => {
    const name = 'Tatooine';

    const planet = {
      name: 'Tatooine',
    };

    expect(filterBy.name(name, planet)).toBe(true);
  });
});

describe('Testa cobertura do planetAPI', () => {
  it('deve retornar um array de planetas', async () => {
    const planets = await fetchPlanetsAPI();
    expect(Array.isArray(planets)).toBe(true);
  });
});

describe('Testa as opções para retonar resultados na tabela', () => {
  test('Testa se ao abrir a página, a função requestAPIFetch da requestAPI é chamada.', async () => {
    render(<App />);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('Testa se ao carregar a página, é feita a requisição para preencher a tabela.', async () => {
    render(<App />);
    const renderedTable = await screen.findByText('Tatooine');
    expect(renderedTable).toBeInTheDocument();
  });

  it('Verifica se ao clicar no botao de remover filtros , remove todos os filtros aplicados', () =>{
    render(<App />);
    const btnRemove = screen.getByRole('button', { name: /remover/i })
    userEvent.click(btnRemove);
    expect(screen.queryAllByTestId('filter')).toHaveLength(0);
  })
});
