import {expect} from 'chai';
import { averageRGB, randomRGB } from './threeHelpers';

describe('threeHelpers', () => {
  describe('averageRGB', () => {
    it('returns an object with the averaged r, g, and b values of two objects', () => {
      const color1 = { r: 1, g: 0, b: 0.25 };
      const color2 = { r: 0, g: 0.5, b: 0.75 };

      expect(averageRGB(color1, color2)).to.deep.equal({ r: 0.5, g: 0.25, b: 0.5 });
    });
  });
});