import React, { PropTypes } from 'react';
import classNames from 'classnames';

import ColorInput from '../ColorInput';
import { getNewCameraAngle, randomRGB } from '../../businessLogic/threeHelpers';

import './menu.scss';

export default function Menu(props) {
    const { isOpen,
            isHidden,
            onClickToggleMenu,
            onChangeColor,
            onClickToggleStats,
            cameraAngle,
            onChangeCameraAngle,
            topColor,
            bottomColor,
            isMobile } = props;
    const menuClassNames = classNames({ 'is-open': isOpen, 'is-hidden': isHidden });
    const controlClassNames = classNames({ 'is-hidden': isMobile });

    const colorInputs = [];
    ['top', 'bottom'].forEach((orientation, orientationIndex) => {
        ['red', 'green', 'blue'].forEach((color, colorIndex) => {
            colorInputs.push(
                <ColorInput orientation={orientation}
                            color={color}
                            topColor={topColor}
                            bottomColor={bottomColor}
                            onChange={onChangeColor}
                            isMobile={isMobile}
                            key={`${orientationIndex}${colorIndex}`} />
            );
        });
    });

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
                    <br />
                    <span className={controlClassNames}>
                        controls
                        <br />
                        h: toggle menu visibility
                        <br />
                        j: set random color
                        <br />
                        l: set random camera angle
                        <br />
                        left: camera angle -10 deg
                        <br />
                        right: camera angle +10 deg
                    </span>
                </p>

                <button onClick={() => onChangeColor(randomRGB(), randomRGB())}>
                    random color
                </button>

                <br /><br />

                {colorInputs}

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

Menu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isHidden: PropTypes.bool.isRequired,
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