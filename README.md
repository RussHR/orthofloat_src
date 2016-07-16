orthofloat
=========

a React component that lets you view floating shapes in orthographic space by using three.js.

## installation

    npm install orthofloat

## importing

### es6

    import Orthofloat, { randomRGB, randomWithRange } from 'orthofloat';

### non-es6

    var Orthofloat = require('orthofloat').default;
    var randomRGB = require('orthofloat').randomRGB;
    var randomWithRange = require('orthofloat').randomWithRange;

## usage

    <Orthofloat />

    var color = randomRGB(); // returns { r: Math.random(), g: Math.random(), b: Math.random() }
    var randNum = randomWithRange(0, 5); // returns a float from 0 up to but not including 5

### props
prop | type | default value | description
--- | --- | --- | ---
bottomColor | object | { r: Math.random(), g: Math.random(), b: Math.random() } | object with values from 0 to 1 that correspond to the bottom color of the first stripe
topColor | object | { r: Math.random(), g: Math.random(), b: Math.random() } | object with values from 0 to 1 that correspond to the top color of the first stripe
showStats | bool | false | toggles visibility of fps/ms, does nothing if initializeWithStats is not set to true
initializeWithStats | bool | false | enables toggling of stats with showStats prop
cameraAngle | number | 0 | angle of the camera looking at the scene

## example
[russrinzler.com/orthofloat](http://www.russrinzler.com/orthofloat)

## notes
* the canvas inserted into the DOM will always be the height and width of the window
* this was built using [React Slingshot](https://github.com/coryhouse/react-slingshot)
