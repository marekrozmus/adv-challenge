import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Header from 'components/Header';
import Legend from 'components/Legend';

function App() {
  return (
    <div className="App">
      <Header />
      <Legend />
      <Dashboard />
    </div>
  );
}

export default App;
