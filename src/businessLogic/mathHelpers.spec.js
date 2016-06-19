import { expect } from 'chai';
import sinon from 'sinon';
import { randomWithRange } from './mathHelpers';

describe('mathHelpers', () => {
  describe('randomWithRange', () => {
    it("returns a number that's a random amount between the min and max range", () => {
      sinon.stub(Math, 'random').returns(0.5);
      expect(randomWithRange(2, 4)).to.equal(3);
      Math.random.restore();
    });
  });
});