/// <reference path="./typings/tsd.d.ts" />

import {sprintf} from 'sprintf-js';

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
            var fmt = this.value === +value ? '%d' : '%e';
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

        var comment = this.comment != null ? this.comment : '';
        comment = comment.substring(0, Math.min(charsRemaining, comment.length));
        s += sprintf(`/ %-${charsRemaining}s`, comment);

        return s;
    }
}

export class HDU {
    private keywords: Keyword[] = [];

    constructor(primary?: boolean) {
        if (primary) {
            this.addKeyword('SIMPLE', true, null);
        } 
    }

    addKeyword(name: string, value: any, comment?: string): void {
        this.keywords.push(new Keyword(name, value, comment));
    }

    getKeywords(): Keyword[] {
        return this.keywords.slice();

    }

}
