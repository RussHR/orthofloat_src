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
                l: 0.7
            }
        };
    }

    toggleMenu() {
        this.setState({ menuIsOpen: !this.state.menuIsOpen });
    }

    toggleColor() {
        this.setState({
            color: {
                h: Math.random(),
                s: 1,
                l: 0.7
            }
        });
    }

    render() {
        const { menuIsOpen, color } = this.state;

        return (
            <div>
                <Menu isOpen={menuIsOpen}
                      onClickToggleMenu={() => this.toggleMenu()}
                      onClickToggleColor={() => this.toggleColor()} />
                <Orthofloat color={color} />
            </div>
        );
    }
}
