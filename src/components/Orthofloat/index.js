import React, { Component } from 'react';
import THREE from 'three';

import { randomWithRange } from '../../businessLogic/mathHelpers';

export default class Orthofloat extends Component {
    componentDidMount() {
        this.initializeScene();
    }

    initializeScene() {
        // set some common variables
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(this.windowWidth / - 16, this.windowWidth / 16, this.windowHeight / 16, this.windowHeight / - 16, -200, 500);
        this.camera.position.x = 120;
        this.camera.lookAt(this.scene.position);

        this.addCubesToScene();

        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
        this.directionalLight.position.set(60, 60, 60);
        this.scene.add(this.directionalLight);

        this.ambientLight = new THREE.AmbientLight(0x4B4B4B);
        this.scene.add(this.ambientLight);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        this.renderer.setSize(this.windowWidth, this.windowHeight);

        this.el.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);

        this.renderAnimation();
    }

    addCubesToScene() {
        this.cubeSize = 4;
        this.cubeGeometry = new THREE.CubeGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
        this.cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ee22});
        this.cubes = [];
        for (let i = 0; i < 20; i++) {
            const cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
            cube.position.y = randomWithRange(this.windowHeight / 16, this.windowHeight / -16);
            cube.position.z = randomWithRange(this.windowWidth / 16, this.windowWidth / -16);
            cube.rotation.set(randomWithRange(0, Math.PI), randomWithRange(0, Math.PI), randomWithRange(0, Math.PI));
            cube.yVelocity = randomWithRange(0.03, 0.1);
            cube.zVelocity = randomWithRange(-0.01, 0.01);
            this.cubes.push(cube);
            this.scene.add(cube);
        }
    }

    renderAnimation() {
        for (const cube of this.cubes) {
            // rotate the cube around its axes
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            cube.rotation.z += 0.01;

            if (cube.position.y > (this.windowHeight / 16 + this.cubeSize * 3)) {
                cube.position.y -= (this.windowHeight / 8 + this.cubeSize * 6);
                cube.position.z = randomWithRange(this.windowWidth / 16, this.windowWidth / -16);
                cube.yVelocity = randomWithRange(0.03, 0.1);
                cube.zVelocity = randomWithRange(-0.01, 0.01);
            }
            cube.position.y += cube.yVelocity;
            cube.position.z += cube.zVelocity;
     }

        requestAnimationFrame(() => this.renderAnimation());
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return <div ref={c => this.el = c} />;
    }
}