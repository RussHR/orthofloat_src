export function makeRadiansPositive(radians) {
    if (radians >= 0) {
        return radians;
    }

    let posRadians = radians;
    while (posRadians < 0) {
        posRadians += Math.PI * 2;
    }

    return posRadians;
}

export function randomWithRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function simplifyAngle(angle) {
    let simplifiedAngle = angle;

    while (simplifiedAngle >= 360) {
        simplifiedAngle -= 360;
    }

    while (simplifiedAngle < 0) {
        simplifiedAngle += 360;
    }

    return simplifiedAngle;
}
