import React, { Component, PropTypes } from 'react';
import bowser from 'bowser';
import classNames from 'classnames';
import THREE from 'three';
import TWEEN from 'tween.js';
import Stats from 'stats.js';
import lodashThrottle from 'lodash/throttle';
import lodashIsEqual from 'lodash/isEqual';

import { randomWithRange, randomRGB } from '../../businessLogic/mathHelpers';

import './orthofloat.scss';

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
    }

    componentDidMount() {
        this.initializeScene();

        this.windowResizeFunc = lodashThrottle(() => this.onWindowResize(), 16.667);
        window.addEventListener('resize', this.windowResizeFunc);
    }

    componentWillReceiveProps(nextProps) {
        if (!lodashIsEqual(nextProps.bottomColor, this.props.bottomColor)) {
            const { randomShapeMaterialBottom } = this;
            const oldColors = {
                bottomR: this.props.bottomColor.r,
                bottomG: this.props.bottomColor.g,
                bottomB: this.props.bottomColor.b
            };
            const newColors = {
                bottomR: nextProps.bottomColor.r,
                bottomG: nextProps.bottomColor.g,
                bottomB: nextProps.bottomColor.b
            };
            const tween = new TWEEN.Tween(oldColors)
                .to(newColors, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function() {
                    randomShapeMaterialBottom.color = {
                        r: this.bottomR,
                        g: this.bottomG,
                        b: this.bottomB
                    };
                })
                .start();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeFunc);
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
        const color = new THREE.Color(this.props.bottomColor.r, this.props.bottomColor.g, this.props.bottomColor.b);
        this.randomShapeMaterialBottom = new THREE.MeshBasicMaterial({ color });
        this.randomShapes = [];
        for (let i = 0; i < 53; i++) {
            const shape = new THREE.Mesh(this.generateRandomGeometry(), this.randomShapeMaterialBottom);
            this.setMeshInSpace(shape);
            this.randomShapes.push(shape);
            this.scene.add(shape);
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
        const { windowHeight, windowWidth } = this.state;
        mesh.position.y = randomWithRange(windowHeight / 16, windowHeight / -16);
        mesh.position.z = randomWithRange(windowWidth / 16, windowWidth / -16);
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

        this.setState({ windowHeight, windowWidth });

        this.renderer.setSize(windowWidth, windowHeight);

        this.camera.left = windowWidth / -this.camFactor;
        this.camera.right = windowWidth / this.camFactor;
        this.camera.top = windowHeight / this.camFactor;
        this.camera.bottom = windowHeight / -this.camFactor;
        this.camera.updateProjectionMatrix();
    }

    renderAnimation() {
        if (this.stats && this.props.showStats) {
            this.stats.begin();
        }

        const { windowHeight, windowWidth } = this.state;

        for (let mesh of [...this.randomShapes, ...this.tetras]) {
            // if shape is above top of window
            if (mesh.position.y > (windowHeight / 16 + this.meshSize * 3)) {
                // put it below the bottom of the window and give it a random z position
                mesh.position.y -= (windowHeight / 8 + this.meshSize * 6);
                mesh.position.z = randomWithRange(windowWidth / 16, windowWidth / -16);

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
        const { showStats, topColor, bottomColor } = this.props;
        const { windowHeight, windowWidth } = this.state;
        const className = classNames('orthofloat-wrapper', { 'show-stats': showStats });
        const topColorStyle = (new THREE.Color(topColor.r, topColor.g, topColor.b)).getStyle();
        const bottomColorStyle = (new THREE.Color(bottomColor.r, bottomColor.g, bottomColor.b)).getStyle();
        const wrapperStyle = {
            backgroundImage: `${this.vendorPrefix}linear-gradient(${topColorStyle}, ${bottomColorStyle})`
        };
        const stripeStyle = {
            width: `${this.stripeWidth}px`,
            marginRight: `${this.stripeWidth}px`,
            backgroundImage: `${this.vendorPrefix}linear-gradient(${bottomColorStyle}, ${topColorStyle})`
        };
        const numOfStripes = Math.ceil(windowWidth / (this.stripeWidth * 2));
        let stripes = [];
        for (let i = 0; i < numOfStripes; i++) {
            stripes.push(<div className="orthofloat-stripe" style={stripeStyle} key={i} />);
        }

        return (
            <div className={className} style={wrapperStyle} ref={c => this.el = c}>
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
    showStats: PropTypes.bool
};

Orthofloat.defaultProps = {
    bottomColor: randomRGB(),
    topColor: randomRGB(),
    initializeWithStats: false,
    showStats: false
};