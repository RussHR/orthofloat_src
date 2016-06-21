import { expect } from 'chai';
import sinon from 'sinon';
import { makeRadiansPositive, randomWithRange, simplifyAngle } from './mathHelpers';

describe('mathHelpers', () => {
    describe('makeRadiansPositive', () => {
        it('returns the radians if it is equal to 0', () => {
            expect(makeRadiansPositive(0)).to.equal(0);
        });

        it('returns the radians if it is greater than 0', () => {
            expect(makeRadiansPositive(2)).to.equal(2);
        });

        it('returns the radians as a positive, equivalent angle if it is less than 0', () => {
            const angle = -Math.PI * 7;
            expect(makeRadiansPositive(angle)).to.equal(Math.PI);
        });
    });

    describe('randomWithRange', () => {
        it("returns a number that's a random amount between the min and max range", () => {
            sinon.stub(Math, 'random').returns(0.5);
            expect(randomWithRange(2, 4)).to.equal(3);
            Math.random.restore();
        });
    });

    describe('simplifyAngle', () => {
        it('returns the angle if it is between 0 and 360', () => {
            expect(simplifyAngle(180)).to.equal(180);
        });

        it('returns an angle between 0 and 360 if it is less than 0', () => {
            expect(simplifyAngle(-2133)).to.equal(27);
        });

        it('returns an angle between 0 and 360 if it is greater than or equal to 360', () => {
            expect(simplifyAngle(2387)).to.equal(227);
        });

        it('returns 0 if the angle is 360', () => {
            expect(simplifyAngle(360)).to.equal(0);
        });
    });
});