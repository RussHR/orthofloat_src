import { randomWithRange } from './mathHelpers';

export function averageRGB({ r: r1, g: g1, b: b1 }, { r: r2, g: g2, b: b2 }) {
    return {
        r: (r1 + r2) / 2,
        g: (g1 + g2) / 2,
        b: (b1 + b2) / 2
    };
}

export function moveMesh(mesh, windowHeight, windowWidth, meshSize) {
    // if shape is above top of window
    if (mesh.position.y > (windowHeight / 16 + meshSize * 3)) {
        // put it below the bottom of the window and give it a random z position
        mesh.position.y -= (windowHeight / 8 + meshSize * 6);
        mesh.position.z = randomWithRange(windowWidth / 16, windowWidth / -16);

        // give it new velocities
        mesh.yVelocity = randomWithRange(0.03, 0.1);
        mesh.zVelocity = randomWithRange(-0.01, 0.01);

        // give the mesh new rotation speeds
        for (let axis of ['x', 'y', 'z']) {
            mesh.rotationSpeed[axis] = randomWithRange(-0.01, 0.01);
        }
    }

    // translate the mesh
    mesh.position.y += mesh.yVelocity;
    mesh.position.z += mesh.zVelocity;

    // rotate the mesh around its axes
    for (let axis of ['x', 'y', 'z']) {
        mesh.rotation[axis] += mesh.rotationSpeed[axis];
    }
}

export function randomRGB() {
    return {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    };
}