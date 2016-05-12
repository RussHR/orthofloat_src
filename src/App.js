import React, { Component } from 'react';
import Menu from './components/Menu';
import Orthofloat from './components/Orthofloat';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsOpen: false,
            hue: 0.35714285714285715
        };
    }

    toggleMenu() {
        this.setState({ menuIsOpen: !this.state.menuIsOpen });
    }

    toggleColor() {
        this.setState({ hue: Math.random() });
    }

    render() {
        const { menuIsOpen, hue } = this.state;

        return (
            <div>
                <Menu isOpen={menuIsOpen}
                      onClickToggleMenu={() => this.toggleMenu()}
                      onClickToggleColor={() => this.toggleColor()} />
                <Orthofloat hue={hue} />
            </div>
        );
    }
}
