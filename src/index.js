import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import 'core-js';
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { icons } from './assets/icons'

import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import getStore from './store'
const StoreWithPersistor = getStore();
const store = StoreWithPersistor.store
const persistedStore = StoreWithPersistor.persistor

React.icons = icons

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistedStore}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
