import React, { Component } from 'react';
import bowser from 'bowser';

import Menu from './components/Menu';
import Orthofloat from './components/Orthofloat';
import { randomRGB } from './businessLogic/threeHelpers';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsOpen: false,
            menuIsHidden: false,
            bottomColor: randomRGB(),
            topColor: randomRGB(),
            showStats: false,
            cameraAngle: 0
        };

        this._handleKeyup = this.handleKeyup.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keyup', this._handleKeyup);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this._handleKeyup);
    }

    handleKeyup(e) {
        if (e.keyCode === 72) { // this is the 'H' key
            this.setState({ menuIsHidden: !this.state.menuIsHidden });
        } else if (e.keyCode === 74) {
            this.changeColor(randomRGB(), randomRGB());
        }

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
        const { menuIsOpen, menuIsHidden, bottomColor, showStats, topColor, cameraAngle } = this.state;

        return (
            <div>
                <Menu isOpen={menuIsOpen}
                      isHidden={menuIsHidden}
                      onClickToggleMenu={() => this.toggleMenu()}
                      onChangeColor={(topColor, bottomColor) => this.changeColor(topColor, bottomColor)}
                      onClickToggleStats={() => this.toggleStats()}
                      cameraAngle={cameraAngle}
                      onChangeCameraAngle={angle => this.changeCameraAngle(angle)}
                      topColor={topColor}
                      bottomColor={bottomColor}
                      isMobile={bowser.mobile || bowser.tablet}/>
                <Orthofloat bottomColor={bottomColor}
                            topColor={topColor}
                            initializeWithStats={true}
                            showStats={showStats}
                            cameraAngle={cameraAngle} />
            </div>
        );
    }
}
