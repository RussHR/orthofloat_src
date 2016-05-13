import React, { Component, PropTypes } from 'react';
import THREE from 'three';
import TWEEN from 'tween.js';

import { randomWithRange } from '../../businessLogic/mathHelpers';

export default class Orthofloat extends Component {
    componentDidMount() {
        this.initializeScene();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hue !== this.props.hue) {
            const { color } = this.cubeMaterial;
            const newColor = new THREE.Color();
            newColor.setHSL(nextProps.hue, this.colorSaturation, this.colorLightness);
            const tween = new TWEEN.Tween(color)
                    .to(newColor, 1000)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeFunc);
    }

    initializeScene() {
        this.setWindowHeightAndWidth();

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(this.windowWidth / - 16, this.windowWidth / 16, this.windowHeight / 16, this.windowHeight / - 16, -200, 500);
        this.camera.position.x = 120;
        this.camera.lookAt(this.scene.position);

        this.initializeCubes();

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
        directionalLight.position.set(60, 60, 60);
        this.scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x4B4B4B);
        this.scene.add(ambientLight);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
        this.renderer.setSize(this.windowWidth, this.windowHeight);

        this.el.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);

        this.windowResizeFunc = () => this.onWindowResize();
        window.addEventListener('resize', this.windowResizeFunc);
        this.renderAnimation();
    }

    setWindowHeightAndWidth() {
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
    }

    onWindowResize() {
        this.setWindowHeightAndWidth();
        this.renderer.setSize(this.windowWidth, this.windowHeight);

        this.camera.left = this.windowWidth / -16;
        this.camera.right = this.windowWidth / 16;
        this.camera.top = this.windowHeight / 16;
        this.camera.bottom = this.windowHeight / -16;
        this.camera.updateProjectionMatrix();
    }

    initializeCubes() {
        this.cubeSize = 4;
        const cubeGeometry = new THREE.CubeGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
        const colorAsHSL = new THREE.Color();
        this.colorSaturation = 1;
        this.colorLightness = 0.7;
        colorAsHSL.setHSL(this.props.hue, this.colorSaturation, this.colorLightness);
        this.cubeMaterial = new THREE.MeshLambertMaterial({color: colorAsHSL.getHex()});
        this.cubes = [];
        for (let i = 0; i < 20; i++) {
            const cube = new THREE.Mesh(cubeGeometry, this.cubeMaterial);
            cube.position.y = randomWithRange(this.windowHeight / 16, this.windowHeight / -16);
            cube.position.z = randomWithRange(this.windowWidth / 16, this.windowWidth / -16);
            cube.rotation.set(randomWithRange(0, Math.PI), randomWithRange(0, Math.PI), randomWithRange(0, Math.PI));
            cube.rotationSpeed = {
                x: randomWithRange(-0.01, 0.01),
                y: randomWithRange(-0.01, 0.01),
                z: randomWithRange(-0.01, 0.01)
            };
            cube.yVelocity = randomWithRange(0.03, 0.1);
            cube.zVelocity = randomWithRange(-0.01, 0.01);
            this.cubes.push(cube);
            this.scene.add(cube);
        }
    }

    renderAnimation() {
        for (const cube of this.cubes) {
            // if cube is above top of window
            if (cube.position.y > (this.windowHeight / 16 + this.cubeSize * 3)) {
                // put it below the bottom of the window and give it a random z position
                cube.position.y -= (this.windowHeight / 8 + this.cubeSize * 6);
                cube.position.z = randomWithRange(this.windowWidth / 16, this.windowWidth / -16);

                // give it new velocities
                cube.yVelocity = randomWithRange(0.03, 0.1);
                cube.zVelocity = randomWithRange(-0.01, 0.01);

                // give the cube new rotation speeds
                for (const axis of ['x', 'y', 'z']) {
                    cube.rotationSpeed[axis] = randomWithRange(-0.01, 0.01);
                }
            }

            // translate the cube
            cube.position.y += cube.yVelocity;
            cube.position.z += cube.zVelocity;

            // rotate the cube around its axes
            for (const axis of ['x', 'y', 'z']) {
                cube.rotation[axis] += cube.rotationSpeed[axis];
            }
     }

        requestAnimationFrame(() => this.renderAnimation());
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return <div ref={c => this.el = c} />;
    }
}

Orthofloat.propTypes = {
    hue: PropTypes.number.isRequired
};

Orthofloat.defaultProps = {
    hue: 0.35714285714285715
};