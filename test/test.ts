/// <reference path="../typings/tsd.d.ts" />

import fits = require('../fits');
import {assert} from 'chai';

function assertCardMatches(card: string,
                           expectedName: string,
                           expectedValue: string,
                           expectedComment?: string): void {
    assert.equal(card.length, 80, 'Card length should be 80 characters');
    assert.equal(card.substr(0, 8), expectedName);
    assert.equal(card.substr(8, 2), '= ', 'Value indicator not found');

    var valComm = card.substr(10).trim();

    if (expectedValue !== undefined
            && (valComm.length == 0 || valComm[0] === '/')) {
        assert.fail(card, null, "Expected value, but found comment");
    }

    var expectedValueLen = expectedValue ? expectedValue.length : 0;

    if (expectedValue) {
        assert.equal(valComm.substr(0, expectedValueLen), expectedValue);
    }

    var comm = valComm.substr(expectedValueLen).trim();

    if (expectedComment) {
        if (comm.length == 0) {
            assert.fail(card, null, "Expected comment, but none found");
        } else {
            assert.equal(comm, expectedComment, "Comment doesnt match");
        }
    }
}

function assertKeywordExists(hdu: fits.HDU,
                             expectedKeyword: fits.Keyword,
                             index?: number): void {
    var keywords = hdu.getKeywords();
    if (index && index >= keywords.length) {
        assert.fail(null, null, `No keyword found at index ${index}`);
    }

    if (index) {
        var kw = keywords[index];
        assert.equal(kw.getName(), expectedKeyword.getName());
        assert.equal(kw.getValue(), expectedKeyword.getValue());
    }
}

describe('Keyword', () => {
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
});

describe('HDU', () => {
    describe('constructor', () => {
        it('should include SIMPLE if primary header', (done) => {
           var hdu = new fits.HDU(true);
            assertKeywordExists(hdu, new fits.Keyword('SIMPLE', true, null), 0);
            done();
        });

        it('should not include SIMPLE if secondary header', (done) => {
            var hdu1 = new fits.HDU(); 
            var hdu2 = new fits.HDU(false); 
            assert.lengthOf(hdu1.getKeywords(), 0);
            assert.lengthOf(hdu2.getKeywords(), 0);
            done();
        });
    });
});
