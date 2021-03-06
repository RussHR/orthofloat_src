/*eslint-disable import/default*/

import React from 'react';
import { render } from 'react-dom';
import App from './App';
require('./favicon.ico'); //Tell webpack to load favicon.ico
require('normalize-css');
import './styles/styles.scss';
render(<App />, document.getElementById('app'));

import Orthofloat from './components/Orthofloat';
export default Orthofloat;
exports.randomRGB = require('./businessLogic/threeHelpers').randomRGB;
exports.randomWithRange = require('./businessLogic/mathHelpers').randomWithRange;