import React, { Component } from 'react';
import THREE from 'three';

export default class Orthofloat extends Component {
    componentDidMount() {
        this.initializeScene();
    }

    initializeScene() {
        // set some common variables
        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;
        this.cubeSize = 4;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(this.windowWidth / - 16, this.windowWidth / 16, this.windowHeight / 16, this.windowHeight / - 16, -200, 500);
        this.camera.position.x = 120;
        this.camera.position.z = 120;
        this.camera.lookAt(this.scene.position);

        this.cubeGeometry = new THREE.CubeGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
        this.cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ee22});
        this.cube = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
        this.scene.add(this.cube);

        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
        this.directionalLight.position.set(-20, 40, 60);
        this.scene.add(this.directionalLight);

        this.ambientLight = new THREE.AmbientLight(0x292929);
        this.scene.add(this.ambientLight);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        this.renderer.setSize(this.windowWidth, this.windowHeight);

        this.el.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);

        this.renderAnimation();
    }

    renderAnimation() {
        // rotate the cube around its axes
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.cube.rotation.z += 0.01;

        if (this.cube.position.y > (this.windowHeight / 16 + this.cubeSize * 3)) {
            this.cube.position.y -= (this.windowHeight / 8 + this.cubeSize * 3);
        }
        this.cube.position.y += 0.1;

        requestAnimationFrame(() => this.renderAnimation());
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return <div ref={c => this.el = c} />;
    }
}