import React from 'react';
import AppRouter from './Router';
import './styles/global.css';
import Hotjar from '@hotjar/browser';

const siteId = 6372598;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );

}

export default App;
