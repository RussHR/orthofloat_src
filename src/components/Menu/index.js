import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import './menu.scss';

export default class Menu extends Component {
    render() {
        const { isOpen, onClick } = this.props;
        const menuClassNames = classNames({ 'is-open': isOpen });
        return (
            <div id="menu" className={menuClassNames}>
                <div className="menu-open" onClick={onClick}>
                    menu
                </div>
                <div className="menu-contents">
                    <div className="menu-close" onClick={onClick}>
                        X
                    </div>
                    <h1>orthofloat</h1>
                    <p>
                        made by <a href="https://www.instagram.com/russ_rinzler/" target="_blank">Russ Rinzler</a>.
                        click <a href="https://github.com/RussHR/orthofloat_src" target="_blank">here</a> for the code.
                    </p>
                </div>
            </div>
        );
    }
}

Menu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};