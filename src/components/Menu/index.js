import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { getNewCameraAngle } from '../../businessLogic/threeHelpers';

import './menu.scss';

export default class Menu extends Component {
    render() {
        const { isOpen,
                onClickToggleMenu,
                onClickToggleColor,
                onClickToggleStats,
                cameraAngle,
                onChangeCameraAngle } = this.props;
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

                    <button onClick={onClickToggleColor}>
                        change color
                    </button>

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
    onClickToggleColor: PropTypes.func.isRequired,
    onClickToggleStats: PropTypes.func.isRequired,
    cameraAngle: PropTypes.number.isRequired,
    onChangeCameraAngle: PropTypes.func.isRequired
};