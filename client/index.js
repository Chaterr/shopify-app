import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import App from './App';

function renderApp() {
  const theme = {
    colors: {
      topBar: {
        background: '#357997',
      },
    },
    logo: {
      width: 124,
      topBarSource:
        'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999',
      contextualSaveBarSource:
        'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999',
      url: 'http://jadedpixel.com',
      accessibilityLabel: 'Jaded Pixel',
    },
  };

  render(
    <AppProvider
      theme={theme}
      apiKey={"e29aa5474db149ec5f80bf47eb756720"}
      shopOrigin={window.shopOrigin}
    >
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </AppProvider>,
    document.getElementById('root')
  );
}

renderApp();

if (module.hot) {
  module.hot.accept();
}
