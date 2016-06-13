import React, { Component, PropTypes } from 'react';
import THREE from 'three';
import TWEEN from 'tween.js';
import lodashThrottle from 'lodash/throttle';

import { randomWithRange } from '../../businessLogic/mathHelpers';

import './orthofloat.scss';

export default class Orthofloat extends Component {
    componentDidMount() {
        this.initializeScene();

        this.windowResizeFunc = lodashThrottle(() => this.onWindowResize(), 16.667);
        window.addEventListener('resize', this.windowResizeFunc);
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

        this.initializeCamera();
        this.initializeMeshes();
        this.initializeLights();
        this.initializeRenderer();

        this.renderAnimation();
    }

    setWindowHeightAndWidth() {
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
    }

    initializeCamera() {
        this.camFactor = 16;
        this.camera = new THREE.OrthographicCamera(
            this.windowWidth / - this.camFactor,
            this.windowWidth / this.camFactor,
            this.windowHeight / this.camFactor,
            this.windowHeight / - this.camFactor,
            -200,
            500
        );
        this.camera.position.x = 120;
        this.camera.lookAt(this.scene.position);
    }

    initializeMeshes() {
        this.meshSize = 2.5;
        this.initializeCubes();
        this.initializeTetrahedrons();
    }

    initializeCubes() {
        const cubeGeometry = new THREE.CubeGeometry(this.meshSize, this.meshSize, this.meshSize);
        const colorAsHSL = new THREE.Color();
        this.colorSaturation = 1;
        this.colorLightness = 0.7;
        colorAsHSL.setHSL(this.props.hue, this.colorSaturation, this.colorLightness);
        this.cubeMaterial = new THREE.MeshLambertMaterial({color: colorAsHSL.getHex()});
        this.cubes = [];
        for (let i = 0; i < 53; i++) {
            const cube = new THREE.Mesh(cubeGeometry, this.cubeMaterial);
            this.setMeshInSpace(cube);
            this.cubes.push(cube);
            this.scene.add(cube);
        }
    }

    initializeTetrahedrons() {
        const tetraGeometry = new THREE.TetrahedronGeometry(this.meshSize);
        const color = new THREE.Color(0xff6ba9);
        const tetraMaterial = new THREE.MeshBasicMaterial({color});
        this.tetras = [];
        for (let i = 0; i < 50; i++) {
            const tetra = new THREE.Mesh(tetraGeometry, tetraMaterial);
            this.setMeshInSpace(tetra);
            this.tetras.push(tetra);
            this.scene.add(tetra);
        }
    }

    setMeshInSpace(mesh) {
        mesh.position.y = randomWithRange(this.windowHeight / 16, this.windowHeight / -16);
        mesh.position.z = randomWithRange(this.windowWidth / 16, this.windowWidth / -16);
        mesh.rotation.set(randomWithRange(0, Math.PI), randomWithRange(0, Math.PI), randomWithRange(0, Math.PI));
        mesh.rotationSpeed = {
            x: randomWithRange(-0.01, 0.01),
            y: randomWithRange(-0.01, 0.01),
            z: randomWithRange(-0.01, 0.01)
        };
        mesh.yVelocity = randomWithRange(0.03, 0.1);
        mesh.zVelocity = randomWithRange(-0.01, 0.01);
    }

    initializeLights() {
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
        directionalLight.position.set(60, 60, 60);
        this.scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x4B4B4B);
        this.scene.add(ambientLight);
    }

    initializeRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
        this.renderer.setSize(this.windowWidth, this.windowHeight);

        this.el.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.setWindowHeightAndWidth();
        this.renderer.setSize(this.windowWidth, this.windowHeight);

        this.camera.left = this.windowWidth / -this.camFactor;
        this.camera.right = this.windowWidth / this.camFactor;
        this.camera.top = this.windowHeight / this.camFactor;
        this.camera.bottom = this.windowHeight / -this.camFactor;
        this.camera.updateProjectionMatrix();
    }

    renderAnimation() {
        for (let mesh of [...this.cubes, ...this.tetras]) {
            // if cube is above top of window
            if (mesh.position.y > (this.windowHeight / 16 + this.meshSize * 3)) {
                // put it below the bottom of the window and give it a random z position
                mesh.position.y -= (this.windowHeight / 8 + this.meshSize * 6);
                mesh.position.z = randomWithRange(this.windowWidth / 16, this.windowWidth / -16);

                // give it new velocities
                mesh.yVelocity = randomWithRange(0.03, 0.1);
                mesh.zVelocity = randomWithRange(-0.01, 0.01);

                // give the mesh new rotation speeds
                for (const axis of ['x', 'y', 'z']) {
                    mesh.rotationSpeed[axis] = randomWithRange(-0.01, 0.01);
                }
            }

            // translate the mesh
            mesh.position.y += mesh.yVelocity;
            mesh.position.z += mesh.zVelocity;

            // rotate the mesh around its axes
            for (const axis of ['x', 'y', 'z']) {
                mesh.rotation[axis] += mesh.rotationSpeed[axis];
            }
     }

        requestAnimationFrame(() => this.renderAnimation());
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return <div className="orthofloat-wrapper" ref={c => this.el = c} />;
    }
}

Orthofloat.propTypes = {
    hue: PropTypes.number.isRequired
};

Orthofloat.defaultProps = {
    hue: 0.35714285714285715
};