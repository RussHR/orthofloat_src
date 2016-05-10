import React, { Component } from 'react';
import Menu from './components/Menu';
import Orthofloat from './components/Orthofloat';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { menuIsOpen: false };
    }

    toggleMenu() {
        this.setState({ menuIsOpen: !this.state.menuIsOpen });
    }

    render() {
        return (
            <div>
                <Menu isOpen={this.state.menuIsOpen} onClick={() => this.toggleMenu()} />
                <Orthofloat />
            </div>
        );
    }
}
