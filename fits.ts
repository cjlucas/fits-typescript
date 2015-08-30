/// <reference path="./typings/tsd.d.ts" />

import {sprintf} from 'sprintf-js';

export enum ImageType {
    UInt8,
    Int8,
    UInt16,
    Int16,
    UInt32,
    Int32,
    UInt64,
    Int64,
    Float32,
    Float64
}

const ASCII_WHITESPACE = 32;

export class Keyword {
    private static CARD_LENGTH = 80;
    private static MAX_KEYWORD_LEN = 8;
    private static MAX_VALUE_LEN = 70;

    constructor(private name: string,
            private value: any,
            private comment?: string) {
        if (name.length > Keyword.MAX_KEYWORD_LEN) {
            throw new Error(`Given keyword exceeds the ${Keyword.MAX_KEYWORD_LEN} character limit`);
        }
    }

    getName = (): string => this.name;
    getValue = (): any => this.value;
    getComment = (): string => this.comment;

    asCard(): string {
        var s = sprintf(`%-${Keyword.MAX_KEYWORD_LEN}s`, this.name);
        s += '= ';

        var value: string;
        if (typeof this.value == 'boolean') {
            value = this.value ? 'T' : 'F';
        } else if (typeof this.value == 'number') {
            var fmt = this.value === ~~this.value ? '%d' : '%e';
            // sprintf-js doesnt support %E, so hack away
            value = sprintf(fmt, this.value).replace('e', 'E');
        } else if (this.value === null) {
            value = "''";
        } else if (this.value === undefined) {
            value = '';
        } else {
            value = this.value.toString();
            if (value.length == 0) {
                value = ' ';
            }

            value = `'${value}'`;
        }

        if (value.length > Keyword.MAX_VALUE_LEN) {
            throw new Error(`Value ${value} exceeds ${Keyword.MAX_VALUE_LEN} character limit`); 
        }

        s += sprintf('%20s ', value);

        var charsRemaining = Keyword.CARD_LENGTH - s.length - 2; // -2 for "/ "

        var comment = this.comment != null ? this.comment : 'hithere';
        comment = comment.substring(0, Math.min(charsRemaining, comment.length));
        s += sprintf(`/ %-${charsRemaining}s`, comment);

        return s;
    }
}

class HDU {
    protected static BLOCK_SIZE = 2880;
    private keywords: Keyword[] = [];

    constructor(primary?: boolean) {
        if (primary) {
            this.addKeyword('SIMPLE', true, null);
        } 
    }

    addKeyword(name: string, value: any, comment?: string): void {
        this.keywords.push(new Keyword(name, value, comment));
    }

    getKeywords = (): Keyword[] => this.keywords.slice();

    protected writeToArray(dest: Uint8Array): number {
        var bytesWritten = 0;
        var keywords = this.getKeywords();
        for (var i = 0; i < keywords.length; i++) {
            var card = keywords[i].asCard();
            for (var j = 0; j < card.length; j++) {
                dest[bytesWritten] = card.charCodeAt(j);
                bytesWritten++;
            }
        }

        var end = 'END';
        for (var i = 0; i < end.length; i++) {
            dest[bytesWritten] = end.charCodeAt(i);
            bytesWritten++;
        }
       
        var bytesLeft = HDU.BLOCK_SIZE - (bytesWritten % HDU.BLOCK_SIZE);
        for (var i = 0; i < bytesLeft; i++) {
            dest[bytesWritten] = ASCII_WHITESPACE;
            bytesWritten++;
        }

        return bytesWritten;
    }
}

export class ImageHDU extends HDU {
    private imageData: ArrayBuffer;

    setImage(imageType: ImageType, axes: number[], imageData: ArrayBuffer) {
        var bitpix: number;
        var bzero = 0;

        // FIXME: signed support is broken
        switch (imageType) {
            case ImageType.UInt8:
               bitpix = 8;
               bzero = 0;
               break;
            case ImageType.Int8:
               bitpix = 8;
               bzero = 0; // fixme
               break;
            case ImageType.UInt16:
               bitpix = 16;
               bzero = 0;
               break;
            case ImageType.Int16:
               bitpix = 16;
               bzero = 0; // fixme
               break;
            case ImageType.UInt32:
               bitpix = 32;
               bzero = 0;
               break;
            case ImageType.Int32:
               bitpix = 32;
               bzero = 0; // fixme
               break;
            case ImageType.UInt64:
               bitpix = 64;
               bzero = 0;
               break;
            case ImageType.Int64:
               bitpix = 64;
               bzero = 0; // fixme
               break;
            case ImageType.Float32:
               bitpix = -32;
               bzero = 0;
               break;
            case ImageType.Float64:
               bitpix = -64;
               bzero = 0; // fixme
               break;
        } 

        this.addKeyword('BITPIX', bitpix);
        this.addKeyword('NAXIS', axes.length);

        for (var i = 1; i <= axes.length; i++) {
            this.addKeyword(`NAXIS${i}`, axes[i-1]);
        }
        
        this.addKeyword('EXTEND', true);

        this.imageData = imageData;
    }

    protected writeToArray(dest: Uint8Array): number {
        var bytesWritten = super.writeToArray(dest);
        console.log(bytesWritten);
        
        var src = new Uint8Array(this.imageData);
        for (var i = 0; i < src.byteLength; i++) {
            dest[bytesWritten] = src[i];
            bytesWritten++;
        }

        var bytesLeft = HDU.BLOCK_SIZE - (bytesWritten % HDU.BLOCK_SIZE);
        for (var i = 0; i < bytesLeft; i++) {
            dest[bytesWritten] = ASCII_WHITESPACE;
            bytesWritten++;
        }

        console.log(bytesWritten);
        return bytesWritten;
    }

    write(): Uint8Array {
        var bytesToWrite = HDU.BLOCK_SIZE + this.imageData.byteLength;
        bytesToWrite += HDU.BLOCK_SIZE - (bytesToWrite % HDU.BLOCK_SIZE);

        console.log(this.imageData.byteLength, bytesToWrite);

        var blah = new Uint8Array(bytesToWrite);
        this.writeToArray(blah);

        return blah; 
    }
}
