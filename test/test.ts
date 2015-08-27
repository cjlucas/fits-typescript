/// <reference path="../typings/tsd.d.ts" />

import fits = require('../fits');
import chai = require('chai');

var assert = chai.assert;

// ES6 polyfill
if (!String.prototype.includes) {
    String.prototype.includes = function() {'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

function assertCardMatches(card: string, expectedName: string, expectedValue: string, expectedComment?: string): void {
    assert.equal(card.length, 80, 'Card length should be 80 characters');
    assert.equal(card.substr(0, 8), 'TARGET  ', 'Keyword did not match');
    assert.equal(card.substr(8, 2), '= ', 'Value indicator not found');

    var valComm = card.substr(10);
    assert.isTrue(valComm.includes(expectedValue), `Expected value $expectedValue not found in card`);

    if (expectedComment) {
        assert.isTrue(valComm.includes(expectedComment), `Expected value $expectedComment not found in card`);
    }
}

describe('thing', () => {
    it('should be true', (done) => {
        assertCardMatches(new fits.Keyword('TARGET', 'TSTTGT', null).asCard(),
                'TARGET', '\'TSTTGT\'', null);
        done();
    });
});
