import React, { Component } from 'react';
import Menu from './components/Menu';
import Orthofloat from './components/Orthofloat';
import { randomWithRange } from './businessLogic/mathHelpers';
import { averageRGB, getNewCameraAngle, randomRGB } from './businessLogic/threeHelpers';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsOpen: false,
            bottomColor: randomRGB(),
            topColor: randomRGB(),
            showStats: false,
            cameraAngle: 0
        };
    }

    toggleMenu() {
        this.setState({ menuIsOpen: !this.state.menuIsOpen });
    }

    toggleColor() {
        const newAngle = getNewCameraAngle(this.state.cameraAngle);
        this.changeCameraAngle(newAngle);

        this.setState({
            bottomColor: randomRGB(),
            topColor: randomRGB()
        });
    }

    changeCameraAngle(cameraAngle) {
        this.setState({ cameraAngle }, () => this.orthofloatEl.moveCamera(cameraAngle));
    }

    toggleStats() {
        this.setState({ showStats: !this.state.showStats });
    }

    render() {
        const { menuIsOpen, bottomColor, showStats, topColor } = this.state;

        return (
            <div>
                <Menu isOpen={menuIsOpen}
                      onClickToggleMenu={() => this.toggleMenu()}
                      onClickToggleColor={() => this.toggleColor()}
                      onClickToggleStats={() => this.toggleStats()} />
                <Orthofloat bottomColor={bottomColor}
                            topColor={topColor}
                            initializeWithStats={true}
                            showStats={showStats}
                            ref={(c) => this.orthofloatEl = c} />
            </div>
        );
    }
}
