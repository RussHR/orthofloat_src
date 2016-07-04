import React, { PropTypes } from 'react';
import classNames from 'classnames';
import lodashAssign from 'lodash/assign';

import { getNewCameraAngle, randomRGB } from '../../businessLogic/threeHelpers';

import './menu.scss';

export default function Menu(props) {
    const { isOpen,
            onClickToggleMenu,
            onChangeColor,
            onClickToggleStats,
            cameraAngle,
            onChangeCameraAngle,
            topColor,
            bottomColor,
            isMobile } = props;
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

                <button onClick={() => onChangeColor(randomRGB(), randomRGB())}>
                    toggle color
                </button>

                <br /><br />

                <label className="menu-background" htmlFor="top-color-r">color 1 red </label>
                <input type="range"
                       id="top-color-r"
                       min="0"
                       max="255"
                       name="top-color"
                       value={topColor.r * 255}
                       onChange={e => onChangeColor(lodashAssign({}, topColor, { r: parseInt(e.target.value) / 255 }), bottomColor)} />
                <ColorNumber isMobile={isMobile}
                             name="top-color"
                             color={topColor.r * 255}
                             onChange={e => onChangeColor(lodashAssign({}, topColor, { r: parseInt(e.target.value || 0) / 255 }), bottomColor)} />
                <br /><br />

                <label className="menu-background" htmlFor="top-color-g">color 1 green </label>
                <input type="range"
                       id="top-color-g"
                       min="0"
                       max="255"
                       name="top-color"
                       value={topColor.g * 255}
                       onChange={(e) => onChangeColor(lodashAssign({}, topColor, { g: parseInt(e.target.value) / 255 }), bottomColor)} />
                <ColorNumber isMobile={isMobile}
                             name="top-color"
                             color={topColor.g * 255}
                             onChange={e => onChangeColor(lodashAssign({}, topColor, { g: parseInt(e.target.value || 0) / 255 }), bottomColor)} />
                <br /><br />

                <label className="menu-background" htmlFor="top-color-b">color 1 blue </label>
                <input type="range"
                       id="top-color-b"
                       min="0"
                       max="255"
                       name="top-color"
                       value={topColor.b * 255}
                       onChange={e => onChangeColor(lodashAssign({}, topColor, { b: parseInt(e.target.value) / 255 }), bottomColor)} />
                <ColorNumber isMobile={isMobile}
                             name="top-color"
                             color={topColor.b * 255}
                             onChange={e => onChangeColor(lodashAssign({}, topColor, { b: parseInt(e.target.value || 0) / 255 }), bottomColor)} />
                <br /><br />

                <label className="menu-background" htmlFor="bottom-color-r">color 2 red </label>
                <input type="range"
                       id="bottom-color-r"
                       min="0"
                       max="255"
                       name="bottom-color"
                       value={bottomColor.r * 255}
                       onChange={e => onChangeColor(topColor, lodashAssign({}, bottomColor, { r: parseInt(e.target.value) / 255 }))} />
                <ColorNumber isMobile={isMobile}
                             name="bottom-color"
                             color={bottomColor.r * 255}
                             onChange={e => onChangeColor(topColor, lodashAssign({}, bottomColor, { r: parseInt(e.target.value || 0) / 255 }))} />
                <br /><br />

                <label className="menu-background" htmlFor="bottom-color-g">color 2 green </label>
                <input type="range"
                       id="bottom-color-g"
                       min="0"
                       max="255"
                       name="bottom-color"
                       value={bottomColor.g * 255}
                       onChange={e => onChangeColor(topColor, lodashAssign({}, bottomColor, { g: parseInt(e.target.value) / 255 }))} />
                <ColorNumber isMobile={isMobile}
                             name="bottom-color"
                             color={bottomColor.g * 255}
                             onChange={e => onChangeColor(topColor, lodashAssign({}, bottomColor, { g: parseInt(e.target.value || 0) / 255 }))} />
                <br /><br />

                <label className="menu-background" htmlFor="bottom-color-b">color 2 blue </label>
                <input type="range"
                       id="bottom-color-b"
                       min="0"
                       max="255"
                       name="bottom-color"
                       value={bottomColor.b * 255}
                       onChange={e => onChangeColor(topColor, lodashAssign({}, bottomColor, { b: parseInt(e.target.value) / 255 }))} />
                <ColorNumber isMobile={isMobile}
                             name="bottom-color"
                             color={bottomColor.b * 255}
                             onChange={e => onChangeColor(topColor, lodashAssign({}, bottomColor, { b: parseInt(e.target.value || 0) / 255 }))} />
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

function ColorNumber({ isMobile, name, color, onChange }) {
    if (isMobile) {
        return null;
    }

    return (
        <input type="number"
               min="0"
               max="255"
               name={name}
               value={color}
               onChange={onChange} />
    );
}

Menu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClickToggleMenu: PropTypes.func.isRequired,
    onChangeColor: PropTypes.func.isRequired,
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
    }),
    isMobile: PropTypes.bool
};