import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import THREE from 'three';
import TWEEN from 'tween.js';
import Stats from 'stats.js';
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

        if (this.props.initializeWithStats) {
            this.initializeStats();
        }

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
        const colorAsHSL = new THREE.Color();
        this.colorSaturation = 1;
        this.colorLightness = 0.7;
        colorAsHSL.setHSL(this.props.hue, this.colorSaturation, this.colorLightness);
        this.cubeMaterial = new THREE.MeshLambertMaterial({color: colorAsHSL.getHex()});
        this.cubes = [];
        for (let i = 0; i < 53; i++) {
            const cube = new THREE.Mesh(this.generateRandomGeometry(), this.cubeMaterial);
            this.setMeshInSpace(cube);
            this.cubes.push(cube);
            this.scene.add(cube);
        }
    }

    generateRandomGeometry() {
        const meshSize = randomWithRange(0.25, 2) * this.meshSize;
        switch (Math.floor(Math.random() * 11)) {
            case 10:
                return new THREE.TorusKnotGeometry(
                    meshSize, meshSize / 3, 40, 12, randomWithRange(1, 20), randomWithRange(1, 20)
                );
            case 9:
                return new THREE.TorusGeometry(meshSize, meshSize / 4, 16, 16, 4);
            case 8:
                return new THREE.SphereGeometry(meshSize, 16, 16);
            case 7:
                return new THREE.RingGeometry(meshSize / 2, meshSize, 16);
            case 6:
                return new THREE.PlaneGeometry(meshSize, meshSize, 0);
            case 5:
                return new THREE.OctahedronGeometry(meshSize, 0);
            case 4:
                return new THREE.IcosahedronGeometry(meshSize, 0);
            case 3:
                return new THREE.DodecahedronGeometry(meshSize, 0);
            case 2:
                return new THREE.CylinderGeometry(meshSize, meshSize, meshSize, 16);
            case 1:
                return new THREE.CircleGeometry(meshSize, 16);
            case 0:
            default:
                return new THREE.BoxGeometry(meshSize, meshSize, meshSize);
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
        this.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
        this.renderer.setSize(this.windowWidth, this.windowHeight);

        this.el.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
    }

    initializeStats() {
        this.stats = new Stats();
        this.el.appendChild(this.stats.dom);
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
        if (this.stats && this.props.showStats) {
            this.stats.begin();
        }

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

        TWEEN.update();
        this.renderer.render(this.scene, this.camera);

        if (this.stats && this.props.showStats) {
            this.stats.end();
        }

        requestAnimationFrame(() => this.renderAnimation());
    }

    render() {
        const className = classNames('orthofloat-wrapper', { 'show-stats': this.props.showStats });
        return <div className={className} ref={c => this.el = c} />;
    }
}

Orthofloat.propTypes = {
    hue: PropTypes.number,
    initializeWithStats: PropTypes.bool,
    showStats: PropTypes.bool
};

Orthofloat.defaultProps = {
    hue: 0.35714285714285715,
    initializeWithStats: false,
    showStats: false
};