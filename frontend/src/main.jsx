import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { mode } from "@chakra-ui/theme-tools"
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.js';

// import { mode } from '@chakra-ui/theme-tools'

const styles = {
  global: (props)=>({
    body: {
      color : mode('gray.800', 'whiteAlpha.900')(props),
      bg : mode('gray.100', '#101010')(props),
    }
  })
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
}

const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e'
  },
  navBarIcon: {
    dark: '#262626',
    light: '#e3e3e3'
  }
}

const theme = extendTheme({ config, styles, colors})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode='{theme.config.initialColorMode}'/>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
