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
