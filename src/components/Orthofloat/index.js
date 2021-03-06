import React, { Component, PropTypes } from 'react';
import bowser from 'bowser';
import classNames from 'classnames';
import THREE from 'three';
import TWEEN from 'tween.js';
import Stats from 'stats.js';
import lodashThrottle from 'lodash/throttle';
import lodashIsEqual from 'lodash/isEqual';

import { randomWithRange, simplifyAngle } from '../../businessLogic/mathHelpers';
import { averageRGB,
         currentColorInTween,
         getColorFromPosition,
         mergeTopAndBottomColors,
         randomRGB } from '../../businessLogic/threeHelpers';

const inlineStyles = (`
    .orthofloat-wrapper {
        position: relative;
        max-height: 100vh;
        max-width: 100vw;
        overflow: hidden;
    }
    .orthofloat-wrapper > div:not(.orthofloat-stripes) {
        display: none;
    }
    .orthofloat-wrapper > canvas {
        display: block;
        position: relative;
    }
    .orthofloat-wrapper.show-stats > div {
        display: block;
    }
    .orthofloat-wrapper .orthofloat-stripes {
        display: block;
        position: absolute;
        height: 100%;
        max-height: 100vh;
        min-width: calc(100% + 100px);
        overflow: hidden;
    }
    .orthofloat-wrapper .orthofloat-stripe {
        display: inline-block;
        height: 100%;
    }
`);

export default class Orthofloat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth
        };
    }

    componentWillMount() {
        this.setVendorPrefix();
        this.stripeWidth = 25;
        this.tweenLength = 2000;
    }

    componentDidMount() {
        this.initializeScene();
        this.setBackgroundColor(this.props.topColor, this.props.bottomColor);

        this.windowResizeFunc = lodashThrottle(() => this.onWindowResize(), 16.667);
        window.addEventListener('resize', this.windowResizeFunc);
    }

    componentWillReceiveProps(nextProps) {
        if (!lodashIsEqual(nextProps.bottomColor, this.props.bottomColor)
            || !lodashIsEqual(nextProps.topColor, this.props.topColor)) {
            this.changeColors(nextProps.topColor, nextProps.bottomColor);
        }

        if (nextProps.cameraAngle !== this.props.cameraAngle) {
            this.moveCamera(nextProps.cameraAngle);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeFunc);
    }

    setBackgroundColor(topColor, bottomColor) {
        const topColorStyle = (new THREE.Color(topColor.r, topColor.g, topColor.b)).getStyle();
        const bottomColorStyle = (new THREE.Color(bottomColor.r, bottomColor.g, bottomColor.b)).getStyle();
        const wrapperBgImage = `${this.vendorPrefix}linear-gradient(${topColorStyle}, ${bottomColorStyle})`;
        const stripeBgImage = `${this.vendorPrefix}linear-gradient(${bottomColorStyle}, ${topColorStyle})`;
        this.styleEl.innerText =
            `.orthofloat-wrapper { background-image: ${wrapperBgImage};}
             .orthofloat-stripe { background-image: ${stripeBgImage};}`;
    }

    changeColors(nextTopColor, nextBottomColor) {
        const { randomShapeMaterialBottom, randomShapeMaterialTop, randomShapeMaterialMid } = this;
        const setBackgroundColor = this.setBackgroundColor.bind(this);

        const oldColors = mergeTopAndBottomColors(this.props.topColor, this.props.bottomColor);
        const newColors = mergeTopAndBottomColors(nextTopColor, nextBottomColor);

        const tween = new TWEEN.Tween(oldColors)
            .to(newColors, this.tweenLength)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                randomShapeMaterialBottom.color = currentColorInTween(this, 'bottom');
                randomShapeMaterialTop.color = currentColorInTween(this, 'top');

                randomShapeMaterialMid.color = averageRGB(
                    randomShapeMaterialBottom.color,
                    randomShapeMaterialTop.color
                );

                setBackgroundColor(
                    { r: this.topR, g: this.topG, b: this.topB },
                    { r: this.bottomR, g: this.bottomG, b: this.bottomB }
                );
            })
            .start();
    }

    initializeScene() {
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

    initializeCamera() {
        const { windowHeight, windowWidth } = this.state;
        this.camFactor = 16;
        this.camera = new THREE.OrthographicCamera(
            windowWidth / - this.camFactor,
            windowWidth / this.camFactor,
            windowHeight / this.camFactor,
            windowHeight / - this.camFactor,
            -200,
            500
        );
        this.camera.position.x = 120;
        this.camera.lookAt(this.scene.position);
    }

    initializeMeshes() {
        this.meshSize = 2.5;
        this.initializeRandomShapes();
        this.initializeTetrahedrons();
    }

    initializeRandomShapes() {
        const { bottomColor, topColor } = this.props;
        const threeTopColor = new THREE.Color(topColor.r, topColor.g, topColor.b);
        const threeBottomColor = new THREE.Color(bottomColor.r, bottomColor.g, bottomColor.b);
        this.randomShapeMaterialTop = new THREE.MeshBasicMaterial({ color: threeTopColor });
        this.randomShapeMaterialBottom = new THREE.MeshBasicMaterial({ color: threeBottomColor });
        const averageColor = averageRGB(this.randomShapeMaterialTop.color, this.randomShapeMaterialBottom.color);
        this.randomShapeMaterialMid = new THREE.MeshBasicMaterial({
            color: new THREE.Color(averageColor.r, averageColor.g, averageColor.b)
        });
        this.randomShapes = [];
        for (let i = 0; i < 53; i++) {
            let shape;
            switch (i % 5) {
                case 0:
                    shape = new THREE.Mesh(this.generateRandomGeometry(), this.randomShapeMaterialTop);
                    break;
                case 1:
                    shape = new THREE.Mesh(this.generateRandomGeometry(), this.randomShapeMaterialBottom);
                    break;
                case 2:
                    shape = new THREE.Mesh(this.generateRandomGeometry(), this.randomShapeMaterialMid);
                    break;
                case 3:
                    shape = new THREE.Mesh(
                        this.generateRandomGeometry(),
                        new THREE.MeshBasicMaterial({ color: threeTopColor })
                    );
                    shape.colorTopToBottom = true;
                    break;
                case 4:
                default:
                    shape = new THREE.Mesh(
                        this.generateRandomGeometry(),
                        new THREE.MeshBasicMaterial({ color: threeBottomColor })
                    );
                    shape.colorBottomToTop = true;
            }
            this.setMeshInSpace(shape);
            this.randomShapes.push(shape);
            this.scene.add(shape);
        }
    }

    generateRandomGeometry() {
        const meshSize = randomWithRange(0.25, 2) * this.meshSize;
        const cylRadius = randomWithRange(meshSize / 2, meshSize);

        switch (Math.floor(Math.random() * 11)) {
            case 10:
                return new THREE.TorusKnotGeometry(
                    meshSize, meshSize / 3, 32, 12, randomWithRange(1, 7), randomWithRange(1, 10)
                );
            case 9:
                return new THREE.TorusGeometry(
                    meshSize, meshSize / 4, 16, 16, randomWithRange(Math.PI / 2, Math.PI * 3)
                );
            case 8:
                return new THREE.SphereGeometry(
                    meshSize,
                    16,
                    16,
                    0,
                    randomWithRange(Math.PI / 2, Math.PI * 3),
                    0,
                    randomWithRange(Math.PI / 2, Math.PI)
                );
            case 7:
                return new THREE.RingGeometry(
                    meshSize / 2, meshSize, 16, 1, 0, randomWithRange(Math.PI / 2, Math.PI * 3)
                );
            case 6:
                return new THREE.PlaneGeometry(meshSize, meshSize, 1, 1);
            case 5:
                return new THREE.OctahedronGeometry(meshSize, 0);
            case 4:
                return new THREE.IcosahedronGeometry(meshSize, 0);
            case 3:
                return new THREE.DodecahedronGeometry(meshSize, 0);
            case 2:
                return new THREE.CylinderGeometry(
                    cylRadius,
                    cylRadius,
                    randomWithRange(meshSize / 2, meshSize * 1.5),
                    16,
                    1,
                    Math.random() < 0.5,
                    0,
                    randomWithRange(Math.PI / 2, Math.PI * 3)
                );
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
        const tetraMaterial = new THREE.MeshBasicMaterial({ color });
        this.tetras = [];
        for (let i = 0; i < 50; i++) {
            const tetra = new THREE.Mesh(tetraGeometry, tetraMaterial);
            this.setMeshInSpace(tetra);
            this.tetras.push(tetra);
            this.scene.add(tetra);
        }
    }

    setMeshInSpace(mesh) {
        const { windowHeight, windowWidth } = this.state;
        mesh.position.x = randomWithRange(windowWidth / 16, windowWidth / -16);
        mesh.position.y = randomWithRange(windowHeight / 16, windowHeight / -16);
        mesh.position.z = randomWithRange(windowWidth / 16, windowWidth / -16);
        mesh.rotation.set(randomWithRange(0, Math.PI), randomWithRange(0, Math.PI), randomWithRange(0, Math.PI));
        mesh.rotationSpeed = {
            x: randomWithRange(-0.01, 0.01),
            y: randomWithRange(-0.01, 0.01),
            z: randomWithRange(-0.01, 0.01)
        };

        this.assignMeshVelocities(mesh);
    }

    assignMeshVelocities(mesh) {
        mesh.xVelocity = randomWithRange(-0.01, 0.01);
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
        const { windowHeight, windowWidth } = this.state;
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(windowWidth, windowHeight);

        this.el.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
    }

    initializeStats() {
        this.stats = new Stats();
        this.el.appendChild(this.stats.dom);
    }

    setVendorPrefix() {
        if (bowser.webkit) {
            this.vendorPrefix = '-webkit-';
        } else if (bowser.firefox) {
            this.vendorPrefix = '-moz-';
        } else if (bowser.opera) {
            this.vendorPrefix = '-o-';
        } else {
            this.vendorPrefix = '';
        }
    }

    onWindowResize() {
        const windowHeight = window.innerHeight,
              windowWidth = window.innerWidth;

        this.setState({ windowHeight, windowWidth }, this.recolorStripes);

        this.renderer.setSize(windowWidth, windowHeight);

        this.camera.left = windowWidth / -this.camFactor;
        this.camera.right = windowWidth / this.camFactor;
        this.camera.top = windowHeight / this.camFactor;
        this.camera.bottom = windowHeight / -this.camFactor;
        this.camera.updateProjectionMatrix();
    }

    moveCamera(angle) {
        const { camera, scene } = this;
        const oldAngle = { angle: Math.atan2(camera.position.z, camera.position.x) };
        const newAngle = { angle: simplifyAngle(angle) * (Math.PI / 180) };

        const tween = new TWEEN.Tween(oldAngle)
            .to(newAngle, this.tweenLength)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                camera.position.x = 120 * Math.cos(this.angle);
                camera.position.z = 120 * Math.sin(this.angle);
                camera.lookAt(scene.position);
            })
            .start();
    }

    renderAnimation() {
        if (this.stats && this.props.showStats) {
            this.stats.begin();
        }

        const { windowHeight } = this.state;
        const { randomShapeMaterialTop, randomShapeMaterialBottom } = this;

        this.randomShapes.forEach(mesh => {
            // if shape is above top of window
            if (mesh.position.y > (windowHeight / 16 + this.meshSize * 4)) {
                mesh.geometry = this.generateRandomGeometry();
                this.repositionMeshToBottom(mesh);
            }

            this.moveMesh(mesh);

            if (mesh.colorTopToBottom) {
                mesh.material.color = getColorFromPosition(
                    mesh.position.y, windowHeight, randomShapeMaterialTop.color, randomShapeMaterialBottom.color
                );
            } else if (mesh.colorBottomToTop) {
                mesh.material.color = getColorFromPosition(
                    mesh.position.y, windowHeight, randomShapeMaterialBottom.color, randomShapeMaterialTop.color
                );
            }
        });

        this.tetras.forEach(mesh => {
            // if shape is above top of window
            if (mesh.position.y > (windowHeight / 16 + this.meshSize * 4)) {
                this.repositionMeshToBottom(mesh);
            }

            this.moveMesh(mesh);
        });

        TWEEN.update();
        this.renderer.render(this.scene, this.camera);

        if (this.stats && this.props.showStats) {
            this.stats.end();
        }

        requestAnimationFrame(() => this.renderAnimation());
    }

    repositionMeshToBottom(mesh) {
        const { windowHeight, windowWidth } = this.state;
        // put it below the bottom of the window and give it a random z position
        mesh.position.y -= (windowHeight / 8 + this.meshSize * 8);
        mesh.position.z = randomWithRange(windowWidth / 16, windowWidth / -16);

        // give it new velocities
        this.assignMeshVelocities(mesh);

        // give the mesh new rotation speeds
        mesh.rotationSpeed.x = randomWithRange(-0.01, 0.01);
        mesh.rotationSpeed.y = randomWithRange(-0.01, 0.01);
        mesh.rotationSpeed.z = randomWithRange(-0.01, 0.01);
    }

    moveMesh(mesh) {
        // rotate the mesh around its axes
        ['x', 'y', 'z'].forEach(axis => {
            mesh.position[axis] += mesh[`${axis}Velocity`]; // translate the mesh
            mesh.rotation[axis] += mesh.rotationSpeed[axis]; // rotate the mesh
        });
    }

    render() {
        const { windowWidth } = this.state;
        const className = classNames('orthofloat-wrapper', { 'show-stats': this.props.showStats });

        // stripes
        const stripeStyle = {
            width: `${this.stripeWidth}px`,
            marginRight: `${this.stripeWidth}px`
        };
        const numOfStripes = Math.ceil(windowWidth / (this.stripeWidth * 2));
        let stripes = [];
        for (let i = 0; i < numOfStripes; i++) {
            stripes.push(<div className="orthofloat-stripe" style={stripeStyle} key={i} />);
        }

        return (
            <div className={className} ref={c => this.el = c}>
                <style>{inlineStyles}</style>
                <style ref={c => this.styleEl = c} />
                <div className="orthofloat-stripes">
                    {stripes}
                </div>
            </div>
        );
    }
}

Orthofloat.propTypes = {
    bottomColor: PropTypes.shape({
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired
    }),
    topColor: PropTypes.shape({
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired
    }),
    initializeWithStats: PropTypes.bool,
    showStats: PropTypes.bool,
    cameraAngle: PropTypes.number
};

Orthofloat.defaultProps = {
    bottomColor: randomRGB(),
    topColor: randomRGB(),
    initializeWithStats: false,
    showStats: false,
    cameraAngle: 0
};