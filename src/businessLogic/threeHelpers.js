export function averageRGB({ r: r1, g: g1, b: b1 }, { r: r2, g: g2, b: b2 }) {
    return {
        r: (r1 + r2) / 2,
        g: (g1 + g2) / 2,
        b: (b1 + b2) / 2
    };
}

export function currentColorInTween(colorData, topOrBottom) {
    return {
        r: colorData[`${topOrBottom}R`],
        g: colorData[`${topOrBottom}G`],
        b: colorData[`${topOrBottom}B`]
    };
}

export function mergeTopAndBottomColors({ r: topR, g: topG, b: topB }, { r: bottomR, g: bottomG, b: bottomB }) {
    return { bottomR, bottomG, bottomB, topR, topG, topB };
}

export function randomRGB() {
    return {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    };
}