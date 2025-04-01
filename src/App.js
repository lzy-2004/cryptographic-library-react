import React, { useState } from 'react';
import AlgorithmSwitch from './components/AlgorithmSwitch';
import CryptoForm from './components/CryptoForm';
import { Container } from '@mui/material';

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('AES');

  return (
    <div id="root">
      <div id="background-image"></div>

      <Container sx={{
        marginTop: '20px',
      }}>
        <AlgorithmSwitch
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={setSelectedAlgorithm}
        />
        <CryptoForm algorithm={selectedAlgorithm} /> {/* 传递当前算法 */}
      </Container>
    </div>
  );
}

export default App;
