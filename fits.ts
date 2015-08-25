/// <reference path="./typings/sprintf-js/sprintf-js.d.ts" />
//

import * as sprintfMod from 'sprintf-js';

var sprintf = sprintfMod.sprintf;

class Keyword {
    private static CARD_LENGTH = 80;

    constructor(private name: string,
            private value: any,
            private comment?: string) {}

    asCard(): string {
        var s = sprintf('%-s=', this.name);

        var value: string;

        if (typeof this.value == 'bool') {
            value = this.value ? 'T' : 'F';
        } else if (typeof this.value == 'number') {
            var fmt = this.value === +value ? '%d' : '%e';
            // sprintf-js doesnt support %E, so hack away
            value = sprintf(fmt, this.value).replace('e', 'E');
        } else if (this.value === null) {
            value = '';
        } else {
            value = sprintf("'%s'", this.value);
        }

        s += sprintf('%20s ', value);

        var charsRemaining = Keyword.CARD_LENGTH - s.length - 2; // -2 for "/ "
        var comment = this.comment.substring(0, Math.min(charsRemaining, this.comment.length));


        s += sprintf(`/ %-${charsRemaining}s`, this.comment);

        return s;
    }
}

class HDU {
    private keyword: Keyword[];

}

export = {
    Keyword: Keyword,
    HDU: HDU,
}
