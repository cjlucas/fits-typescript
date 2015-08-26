/// <reference path="../typings/tsd.d.ts" />

import fits = require('../fits');
import chai = require('chai');

var assert = chai.assert;

function assertCardMatches(card: string, expectedName: string, expectedValue: string, expectedComment?: string): void {
    assert.equal(card.length, 80, "Card length should be 80 characters");
    assert.equal(card.substring(0, 8), 'TARGET ');
}

describe('thing', () => {
    it('should be true', (done) => {
        assertCardMatches(new fits.Keyword('TARGET', 'TSTTGT', null).asCard(),
                'TARGET', 'TSTTGT', null);
        done();
    });
});
