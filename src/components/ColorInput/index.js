import React, { PropTypes } from 'react';
import lodashAssign from 'lodash/assign';

export default function ColorInput({ orientation, color, topColor, bottomColor, onChange, isMobile }) {
    const number = orientation === 'top' ? 1 : 2;
    const colorToControl = orientation === 'top' ? topColor : bottomColor;
    const onChangeColor = (e) => {
        if (orientation === 'top') {
            onChange(lodashAssign({}, topColor, { [color[0]]: (parseInt(e.target.value) || 0) / 255 }), bottomColor);
        } else {
            onChange(topColor, lodashAssign({}, bottomColor, { [color[0]]: (parseInt(e.target.value) || 0) / 255 }));
        }
    };

    const numberInput = isMobile ? null : (
        <input type="number"
               min="0"
               max="255"
               name={`${orientation}-color`}
               value={colorToControl[color[0]] * 255}
               onChange={onChangeColor} />
    );

    return (
        <div>
            <label className="menu-background" htmlFor={`${orientation}-color-${color[0]}`}>
                color {number} {color}{' '}
            </label>
            <input type="range"
                   id={`${orientation}-color-${color[0]}`}
                   min="0"
                   max="255"
                   name={`${orientation}-color`}
                   value={colorToControl[color[0]] * 255}
                   onChange={onChangeColor} />
            {numberInput}
            <br /><br />
        </div>
    );
}

ColorInput.propTypes = {
    orientation: PropTypes.oneOf(['top', 'bottom']),
    color: PropTypes.oneOf(['red', 'green', 'blue']),
    onChange: PropTypes.func.isRequired,
    topColor: PropTypes.shape({
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired
    }),
    bottomColor: PropTypes.shape({
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired
    }),
    isMobile: PropTypes.bool
};