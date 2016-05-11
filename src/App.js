import React, { Component } from 'react';
import Menu from './components/Menu';
import Orthofloat from './components/Orthofloat';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsOpen: false,
            color: {
                h: 0.35714285714285715,
                s: 1,
                l: 0.4666666666666667
            }
        };
    }

    toggleMenu() {
        this.setState({ menuIsOpen: !this.state.menuIsOpen });
    }

    render() {
        const { menuIsOpen, color } = this.state;

        return (
            <div>
                <Menu isOpen={menuIsOpen} onClick={() => this.toggleMenu()} />
                <Orthofloat color={color} />
            </div>
        );
    }
}
