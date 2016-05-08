import React, { Component } from 'react';
import THREE from 'three';

export default class Orthofloat extends Component {
    componentDidMount() {
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, -200, 500);
        camera.position.x = 120;
        camera.position.z = 120;
        camera.lookAt(scene.position);

        const renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const cubeGeometry = new THREE.CubeGeometry(4,4,4);
        const cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ee22});
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        scene.add(cube);

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
        directionalLight.position.set( -20, 40, 60 );
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x292929);
        scene.add(ambientLight);

        this.el.appendChild(renderer.domElement);
        renderer.render(scene, camera);
    }

    render() {
        return <div ref={c => this.el = c} />;
    }
}