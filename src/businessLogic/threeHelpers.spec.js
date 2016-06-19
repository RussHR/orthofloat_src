import { expect } from 'chai';
import sinon from 'sinon';
import { averageRGB,
         currentColorInTween,
         getColorFromPosition,
         mergeTopAndBottomColors,
         randomRGB } from './threeHelpers';

describe('threeHelpers', () => {
    describe('averageRGB', () => {
        it('returns an object with the averaged r, g, and b values of two objects', () => {
            const color1 = { r: 1, g: 0, b: 0.25 };
            const color2 = { r: 0, g: 0.5, b: 0.75 };

            expect(averageRGB(color1, color2)).to.deep.equal({ r: 0.5, g: 0.25, b: 0.5 });
        });
    });

    describe('currentColorInTween', () => {
        const color = {
            bottomR: 0.534,
            bottomG: 0.475,
            bottomB: 0.254,
            topR: 0.123,
            topG: 0.421,
            topB: 0.634
        };

        it('returns an object with the rgb values of the top colors', () => {
            expect(currentColorInTween(color, 'top')).to.deep.equal({ r: 0.123, g: 0.421, b: 0.634 });
        });

        it('returns an object with the rgb values of the bottom colors', () => {
            expect(currentColorInTween(color, 'bottom')).to.deep.equal({ r: 0.534, g: 0.475, b: 0.254 });
        });
    });

    describe('getColorFromPosition', () => {
        const windowHeight = 1000;
        const startColor = { r: 100, g: 50, b: 150};
        const endColor = { r: 200, g: 30, b: 200};

        it('returns an interpolated value for an object halfway up the window', () => {
            const meshPositionY = 0;
            expect(getColorFromPosition(meshPositionY, windowHeight, startColor, endColor))
                .to.deep.equal({ r: 150, g: 40, b: 175 });
        });

        it('returns an interpolated value for an object a quarter up the window', () => {
            const meshPositionY = -31.25;
            expect(getColorFromPosition(meshPositionY, windowHeight, startColor, endColor))
                .to.deep.equal({ r: 125, g: 45, b: 162.5 });
        });

        it('returns the startColor for a position below the bottom of the window', () => {
            const meshPositionY = -100;
            expect(getColorFromPosition(meshPositionY, windowHeight, startColor, endColor))
                .to.deep.equal({ r: 100, g: 50, b: 150 });
        });

        it('returns the endColor for a position above the top of the window', () => {
            const meshPositionY = 100;
            expect(getColorFromPosition(meshPositionY, windowHeight, startColor, endColor))
                .to.deep.equal({ r: 200, g: 30, b: 200 });
        });
    });

    describe('mergeTopAndBottomColors', () => {
        it('returns an object with r, g, and b values for the top and bottom colors', () => {
            const topColor = { r: 0.123, g: 0.421, b: 0.634 };
            const bottomColor = { r: 0.534, g: 0.475, b: 0.254 };
            const expectedResult = {
                bottomR: 0.534,
                bottomG: 0.475,
                bottomB: 0.254,
                topR: 0.123,
                topG: 0.421,
                topB: 0.634
            };
            expect(mergeTopAndBottomColors(topColor, bottomColor)).to.deep.equal(expectedResult);
        });
    });

    describe('randomRGB', () => {
        it('returns an object with r, g, and b values that are a result of Math.random()', () => {
            sinon.stub(Math, 'random').returns(0.5);
            expect(randomRGB()).to.deep.equal({ r: 0.5, g: 0.5, b: 0.5 });
            Math.random.restore();
        });
    });
});