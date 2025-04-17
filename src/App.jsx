import React from 'react';
import AppRouter from './Router';
import './styles/global.css';
import Hotjar from '@hotjar/browser';
import { VWOScript } from 'vwo-smartcode-nextjs';

const siteId = 6372598;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

function App() {
  return (
    <html lang="en">
    <head>
      <VWOScript accountId="1072509" />
    </head>
    <body>
      <div className="App">
        <AppRouter />
      </div>
    </body>
  </html>
  );

}

export default App;
