import React from 'react';
import BlockchainMLModel from './components/BlockchainMLModel';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="dashboard-header">
        <h1>Blockchain Adoption Analysis</h1>
        <p>Machine learning insights for blockchain technology adoption in the palm oil industry</p>
      </div>
      <BlockchainMLModel />
    </div>
  );
}

export default App;
