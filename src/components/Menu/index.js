import React, { Component, PropTypes } from 'react';

import './menu.scss';

export default class Menu extends Component {
    render() {
        return (
            <div id="menu" onClick={this.props.onClick}>
                menu
            </div>
        );
    }
}

Menu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};