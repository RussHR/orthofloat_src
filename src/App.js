import React, { Component } from 'react';
import Menu from './components/Menu';
import Orthofloat from './components/Orthofloat';
import { randomWithRange } from './businessLogic/mathHelpers';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsOpen: false,
            hue: Math.random(),
            showStats: false
        };
    }

    toggleMenu() {
        this.setState({ menuIsOpen: !this.state.menuIsOpen });
    }

    toggleColor() {
        let { hue } = this.state;
        hue += randomWithRange(1/6, 5/6);
        if (hue >= 1) {
            hue -= 1;
        }
        this.setState({ hue });
    }

    toggleStats() {
        this.setState({ showStats: !this.state.showStats });
    }

    render() {
        const { menuIsOpen, hue, showStats } = this.state;

        return (
            <div>
                <Menu isOpen={menuIsOpen}
                      onClickToggleMenu={() => this.toggleMenu()}
                      onClickToggleColor={() => this.toggleColor()}
                      onClickToggleStats={() => this.toggleStats()} />
                <Orthofloat hue={hue} initializeWithStats={true} showStats={showStats}/>
            </div>
        );
    }
}
