export function averageRGB({ r: r1, g: g1, b: b1 }, { r: r2, g: g2, b: b2 }) {
    return {
        r: (r1 + r2) / 2,
        g: (g1 + g2) / 2,
        b: (b1 + b2) / 2
    };
}

export function randomRGB() {
    return {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    };
}