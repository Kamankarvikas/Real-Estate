import './utils/api';
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {persistor, store} from './redux/store.js';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PersistGate loading={<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:40,height:40,border:'4px solid #ccfbf1',borderTop:'4px solid #0d9488',borderRadius:'50%',animation:'spin 1s linear infinite'}}></div></div>} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>,
)
