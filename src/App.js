import React, { Component } from 'react';
import Menu from './components/Menu';
import Orthofloat from './components/Orthofloat';
import { randomWithRange, randomRGB } from './businessLogic/mathHelpers';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsOpen: false,
            bottomColor: randomRGB(),
            topColor: randomRGB(),
            showStats: false
        };
    }

    toggleMenu() {
        this.setState({ menuIsOpen: !this.state.menuIsOpen });
    }

    toggleColor() {
        this.setState({
            bottomColor: randomRGB(),
            topColor: randomRGB()
        });
    }

    toggleStats() {
        this.setState({ showStats: !this.state.showStats });
    }

    render() {
        const { menuIsOpen, bottomColor, showStats } = this.state;

        return (
            <div>
                <Menu isOpen={menuIsOpen}
                      onClickToggleMenu={() => this.toggleMenu()}
                      onClickToggleColor={() => this.toggleColor()}
                      onClickToggleStats={() => this.toggleStats()} />
                <Orthofloat bottomColor={bottomColor} initializeWithStats={true} showStats={showStats}/>
            </div>
        );
    }
}
