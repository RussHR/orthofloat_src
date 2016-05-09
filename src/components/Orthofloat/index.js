import React, { Component } from 'react';
import THREE from 'three';

import { randomWithRange } from '../../businessLogic/mathHelpers';

export default class Orthofloat extends Component {
    componentDidMount() {
        this.initializeAnimation();
    }

    initializeAnimation() {
        // set some common variables
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;

        this.scene = new THREE.Scene();

        this.initializeCamera();
        this.initializeCubes();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        this.renderer.setSize(this.windowWidth, this.windowHeight);

        this.el.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);

        this.renderAnimation();
    }

    initializeCamera() {
        this.camera = new THREE.OrthographicCamera(this.windowWidth / - 16, this.windowWidth / 16, this.windowHeight / 16, this.windowHeight / - 16, -200, 500);
        this.camera.position.x = 120;
        this.camera.lookAt(this.scene.position);

    }

    initializeLights() {
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
        this.directionalLight.position.set(60, 60, 60);
        this.scene.add(this.directionalLight);

        this.ambientLight = new THREE.AmbientLight(0x4B4B4B);
        this.scene.add(this.ambientLight);
    }

    initializeCubes() {
        this.cubeSize = 4;
        this.cubeGeometry = new THREE.CubeGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
        this.cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ee22});
        this.cubes = [];
        for (let i = 0; i < 20; i++) {
            const cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
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
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return <div ref={c => this.el = c} />;
    }
}