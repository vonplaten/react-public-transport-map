import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import MyMap from "./components/map"
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<MyMap />, document.getElementById('root'));

serviceWorker.unregister();
