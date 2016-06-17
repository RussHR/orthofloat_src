export function randomWithRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function randomRGB() {
    return {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    };
}