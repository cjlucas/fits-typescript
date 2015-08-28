/// <reference path="../typings/tsd.d.ts" />

import fits = require('../fits');
import chai = require('chai');

var assert = chai.assert;

function assertCardMatches(card: string, expectedName: string, expectedValue: string, expectedComment?: string): void {
    var errMsg: string = null;

    if (card.length < 80) {
        errMsg = 'Card length should be 80 characters';
    }
    if (card.substr(0, 8) !== expectedName) {
        errMsg = 'Keyword did not match';
    }

    if (card.substr(8, 2) !== '= ') {
        errMsg = 'Value indicator not found';
    }

    var valComm = card.substr(10).trim();

    // If expected value but no value found (left-trimmed to comment)
    if (typeof expectedValue === 'string' && (valComm[0] == '/'
        || valComm.substr(0, expectedValue.length) !== expectedValue) {
        errMsg = `Expected value ${expectedValue} not found in card`;
    }

    var comm = valComm.substr(expectedValue.length).trim();

    if (expectedComment && (comm.length == 0 || comm !== expectedComment)) {
        errMsg = `Expected value "${expectedComment}" not found in card`;
    }

    if (errMsg != null) {
        assert.fail(card, null, errMsg + `\nActual: "${card}"`); 
    }
}

describe('#asCard', () => {
    it('should return a valid card with string value', (done) => {
        assertCardMatches(new fits.Keyword('TARGET', 'TSTTGT', null).asCard(),
                'TARGET  ', '\'TSTTGT\'', null);
        done();
    });
    
    it('should return a valid card with true boolean', (done) => {
        assertCardMatches(new fits.Keyword('TARGET', true, null).asCard(),
                'TARGET  ', 'T', null);
        done();
    });
    
    it('should return a valid card with false boolean', (done) => {
        assertCardMatches(new fits.Keyword('TARGET', false, null).asCard(),
                'TARGET  ', 'F', null);
        done();
    });
    
    it('should return a valid card with a null string', (done) => {
        assertCardMatches(new fits.Keyword('TARGET', null, null).asCard(),
                'TARGET  ', "''", null);
        done();
    });
    
    it('should return a valid card with a empty string', (done) => {
        assertCardMatches(new fits.Keyword('TARGET', '', null).asCard(),
                'TARGET  ', "' '", null);
        done();
    });
    
    it('should return a valid card with an undefined keyword', (done) => {
        assertCardMatches(new fits.Keyword('TARGET', undefined, null).asCard(),
                'TARGET  ', undefined, null);
        done();
    });
});
