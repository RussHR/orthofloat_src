import React, { Component } from 'react';
import Menu from './components/Menu';
import Orthofloat from './components/Orthofloat';
import { randomRGB } from './businessLogic/threeHelpers';

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

    changeColor(topColor, bottomColor) {
        this.setState({
            bottomColor,
            topColor
        });
    }

    changeCameraAngle(cameraAngle) {
        this.setState({ cameraAngle });
    }

    toggleStats() {
        this.setState({ showStats: !this.state.showStats });
    }

    render() {
        const { menuIsOpen, bottomColor, showStats, topColor, cameraAngle } = this.state;

        return (
            <div>
                <Menu isOpen={menuIsOpen}
                      onClickToggleMenu={() => this.toggleMenu()}
                      onClickChangeColor={(topColor, bottomColor) => this.changeColor(topColor, bottomColor)}
                      onClickToggleStats={() => this.toggleStats()}
                      cameraAngle={cameraAngle}
                      onChangeCameraAngle={angle => this.changeCameraAngle(angle)}
                      topColor={topColor}
                      bottomColor={bottomColor} />
                <Orthofloat bottomColor={bottomColor}
                            topColor={topColor}
                            initializeWithStats={true}
                            showStats={showStats}
                            cameraAngle={cameraAngle} />
            </div>
        );
    }
}
