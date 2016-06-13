orthofloat
=========

a React component that lets you view floating shapes in orthographic space by using three.js.

## installation

    npm install orthofloat

## usage

    var Orthofloat = require('orthofloat');

    <Orthofloat hue={0.5} />

a hue of 0.5 results in shapes that are cyan.

### props
prop | type | default value | description
--- | --- | --- | ---
hue | number | 0.35714285714285715 | a value between 0 and 1 that corresponds to an H (in HSL) value from 0 to 360
initializeWithStats | bool | false | allows the fps/ms stats screen to be toggled in the upper left corner
showStats | bool | false | toggles visibility of fps/ms, does nothing if initializeWithStats is not set to true

## example
[russrinzler.com/orthofloat](http://www.russrinzler.com/orthofloat)

## notes
* the canvas inserted into the DOM will always be the height and width of the window
* this was built using [React Slingshot](https://github.com/coryhouse/react-slingshot)
