import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import './menu.scss';

export default class Menu extends Component {
    render() {
        const { isOpen, onClickToggleMenu, onClickToggleColor } = this.props;
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
                    <h1>orthofloat</h1>
                    <p>
                        made by <a href="https://www.instagram.com/russ_rinzler/" target="_blank">Russ Rinzler</a>.
                        click <a href="https://github.com/RussHR/orthofloat_src" target="_blank">here</a> for the code.
                    </p>
                    <button onClick={onClickToggleColor}>
                        change color
                    </button>
                </div>
            </div>
        );
    }
}

Menu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClickToggleMenu: PropTypes.func.isRequired,
    onClickToggleColor: PropTypes.func.isRequired
};