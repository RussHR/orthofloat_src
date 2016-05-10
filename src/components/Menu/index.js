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
                    orthofloat
                </div>
            </div>
        );
    }
}

Menu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};