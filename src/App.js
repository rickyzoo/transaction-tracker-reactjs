import React from 'react';
import { Header } from './components/Header/Header';
import { AddTransaction } from './components/AddTransaction/AddTransaction';
import { FilterData } from './components/FilterData/FilterData';

import './App.css';

function App() {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div style={{ display: 'flex' }}>
        <AddTransaction />
        <FilterData />
      </div>
    </div>
  );
}

export default App;
