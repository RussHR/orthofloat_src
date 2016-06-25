import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import lodashAssign from 'lodash/assign';

import { getNewCameraAngle, randomRGB } from '../../businessLogic/threeHelpers';

import './menu.scss';

export default class Menu extends Component {
    render() {
        const { isOpen,
                onClickToggleMenu,
                onClickChangeColor,
                onClickToggleStats,
                cameraAngle,
                onChangeCameraAngle,
                topColor,
                bottomColor } = this.props;
        const menuClassNames = classNames({ 'is-open': isOpen });

        return (
            <div id="menu" className={menuClassNames}>
                <div className="menu-open" onClick={onClickToggleMenu}>
                    menu
                </div>
                <div className="menu-contents">
                    <div className="menu-close" onClick={onClickToggleMenu}>
                        X
                    </div>

                    <h3 className="menu-title menu-background">orthofloat</h3>

                    <p className="menu-background">
                        made by <a href="http://www.russrinzler.com" target="_blank">Russ Rinzler</a>.
                        <br />
                        click <a href="https://github.com/RussHR/orthofloat_src" target="_blank">here</a> for the code.
                    </p>

                    <button onClick={() => onClickChangeColor(randomRGB(), randomRGB())}>
                        toggle color
                    </button>

                    <br /><br />

                    <label className="menu-background" htmlFor="top-color-h">color 1 hue </label>
                    <input type="range"
                           id="top-color-h"
                           min="0"
                           max="100"
                           name="top-color"
                           value={topColor.r * 100}
                           onChange={e => onClickChangeColor(lodashAssign({}, topColor, { r: parseInt(e.target.value) / 100 }), bottomColor)} />

                    <br /><br />

                    <label className="menu-background" htmlFor="top-color-s">color 1 saturation </label>
                    <input type="range"
                           id="top-color-s"
                           min="0"
                           max="100"
                           name="top-color"
                           value={topColor.g * 100}
                           onChange={e => onClickChangeColor(lodashAssign({}, topColor, { g: parseInt(e.target.value) / 100 }), bottomColor)} />

                    <br /><br />

                    <label className="menu-background" htmlFor="top-color-l">color 1 lightness </label>
                    <input type="range"
                           id="top-color-l"
                           min="0"
                           max="100"
                           name="top-color"
                           value={topColor.b * 100}
                           onChange={e => onClickChangeColor(lodashAssign({}, topColor, { b: parseInt(e.target.value) / 100 }), bottomColor)} />

                    <br /><br />

                    <label className="menu-background" htmlFor="bottom-color-h">color 2 hue </label>
                    <input type="range"
                           id="bottom-color-h"
                           min="0"
                           max="100"
                           name="bottom-color"
                           value={bottomColor.r * 100}
                           onChange={e => onClickChangeColor(topColor, lodashAssign({}, bottomColor, { r: parseInt(e.target.value) / 100 }))} />

                    <br /><br />

                    <label className="menu-background" htmlFor="bottom-color-s">color 2 saturation </label>
                    <input type="range"
                           id="bottom-color-s"
                           min="0"
                           max="100"
                           name="bottom-color"
                           value={bottomColor.g * 100}
                           onChange={e => onClickChangeColor(topColor, lodashAssign({}, bottomColor, { g: parseInt(e.target.value) / 100 }))} />

                    <br /><br />

                    <label className="menu-background" htmlFor="bottom-color-l">color 2 lightness </label>
                    <input type="range"
                           id="bottom-color-l"
                           min="0"
                           max="100"
                           name="bottom-color"
                           value={bottomColor.b * 100}
                           onChange={e => onClickChangeColor(topColor, lodashAssign({}, bottomColor, { b: parseInt(e.target.value) / 100 }))} />

                    <br /><br />

                    <button onClick={() => onChangeCameraAngle(getNewCameraAngle(cameraAngle))}>
                        rotate camera
                    </button>

                    <br /><br />

                    <label className="menu-background" htmlFor="camera-angle">camera angle </label>
                    <input type="range"
                           id="camera-angle"
                           min="0"
                           max="359"
                           name="camera-angle"
                           value={cameraAngle}
                           onChange={e => onChangeCameraAngle(parseInt(e.target.value))} />

                    <br /><br />

                    <button onClick={onClickToggleStats}>
                        toggle stats
                    </button>
                </div>
            </div>
        );
    }
}

Menu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClickToggleMenu: PropTypes.func.isRequired,
    onClickChangeColor: PropTypes.func.isRequired,
    onClickToggleStats: PropTypes.func.isRequired,
    cameraAngle: PropTypes.number.isRequired,
    onChangeCameraAngle: PropTypes.func.isRequired,
    bottomColor: PropTypes.shape({
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired
    }),
    topColor: PropTypes.shape({
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired
    })
};