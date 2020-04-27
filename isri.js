exports.ISRIStemmer = class ISRIStemmer {
    /*
    This is a port of ISRI Arabic stemmer from python (NLTK) to javascript.

    ISRI Arabic stemmer based on algorithm: Arabic Stemming without a root dictionary.
    Information Science Research Institute. University of Nevada, Las Vegas, USA.

    A few minor modifications have been made to ISRI basic algorithm.
    See the source code of this module for more information.

    isri.stem(token) returns Arabic root for the given token.

    The ISRI Stemmer requires that all tokens have Unicode string types.
    If you use Python IDLE on Arabic Windows you have to decode text first
    using Arabic '1256' coding.
    */

    constructor(){
        //  length three prefixes
        this.p3 = [
            "\u0643\u0627\u0644",
            "\u0628\u0627\u0644",
            "\u0648\u0644\u0644",
            "\u0648\u0627\u0644",
        ]

        //  length two prefixes
        this.p2 = ["\u0627\u0644", "\u0644\u0644"];

        //  length one prefixes
        this.p1 = [
            "\u0644",
            "\u0628",
            "\u0641",
            "\u0633",
            "\u0648",
            "\u064a",
            "\u062a",
            "\u0646",
            "\u0627",
        ];

        //  length three suffixes
        this.s3 = [
            "\u062a\u0645\u0644",
            "\u0647\u0645\u0644",
            "\u062a\u0627\u0646",
            "\u062a\u064a\u0646",
            "\u0643\u0645\u0644",
        ];

        //  length two suffixes
        this.s2 = [
            "\u0648\u0646",
            "\u0627\u062a",
            "\u0627\u0646",
            "\u064a\u0646",
            "\u062a\u0646",
            "\u0643\u0645",
            "\u0647\u0646",
            "\u0646\u0627",
            "\u064a\u0627",
            "\u0647\u0627",
            "\u062a\u0645",
            "\u0643\u0646",
            "\u0646\u064a",
            "\u0648\u0627",
            "\u0645\u0627",
            "\u0647\u0645",
        ];

        // length one suffixes
        this.s1 = ["\u0629", "\u0647", "\u064a", "\u0643", "\u062a", "\u0627", "\u0646"];

        // groups of length four patterns
        this.pr4 = {
            0: ["\u0645"],
            1: ["\u0627"],
            2: ["\u0627", "\u0648", "\u064A"],
            3: ["\u0629"],
        };

        // Groups of length five patterns and length three roots
        this.pr53 = {
            0: ["\u0627", "\u062a"],
            1: ["\u0627", "\u064a", "\u0648"],
            2: ["\u0627", "\u062a", "\u0645"],
            3: ["\u0645", "\u064a", "\u062a"],
            4: ["\u0645", "\u062a"],
            5: ["\u0627", "\u0648"],
            6: ["\u0627", "\u0645"],
        };

        this.re_short_vowels = new RegExp("[\u064B-\u0652]");
        this.re_hamza = new RegExp("[\u0621\u0624\u0626]");
        this.re_initial_hamza = new RegExp("^[\u0622\u0623\u0625]");

        this.stop_words = [
            "\u064a\u0643\u0648\u0646",
            "\u0648\u0644\u064a\u0633",
            "\u0648\u0643\u0627\u0646",
            "\u0643\u0630\u0644\u0643",
            "\u0627\u0644\u062a\u064a",
            "\u0648\u0628\u064a\u0646",
            "\u0639\u0644\u064a\u0647\u0627",
            "\u0645\u0633\u0627\u0621",
            "\u0627\u0644\u0630\u064a",
            "\u0648\u0643\u0627\u0646\u062a",
            "\u0648\u0644\u0643\u0646",
            "\u0648\u0627\u0644\u062a\u064a",
            "\u062a\u0643\u0648\u0646",
            "\u0627\u0644\u064a\u0648\u0645",
            "\u0627\u0644\u0644\u0630\u064a\u0646",
            "\u0639\u0644\u064a\u0647",
            "\u0643\u0627\u0646\u062a",
            "\u0644\u0630\u0644\u0643",
            "\u0623\u0645\u0627\u0645",
            "\u0647\u0646\u0627\u0643",
            "\u0645\u0646\u0647\u0627",
            "\u0645\u0627\u0632\u0627\u0644",
            "\u0644\u0627\u0632\u0627\u0644",
            "\u0644\u0627\u064a\u0632\u0627\u0644",
            "\u0645\u0627\u064a\u0632\u0627\u0644",
            "\u0627\u0635\u0628\u062d",
            "\u0623\u0635\u0628\u062d",
            "\u0623\u0645\u0633\u0649",
            "\u0627\u0645\u0633\u0649",
            "\u0623\u0636\u062d\u0649",
            "\u0627\u0636\u062d\u0649",
            "\u0645\u0627\u0628\u0631\u062d",
            "\u0645\u0627\u0641\u062a\u0626",
            "\u0645\u0627\u0627\u0646\u0641\u0643",
            "\u0644\u0627\u0633\u064a\u0645\u0627",
            "\u0648\u0644\u0627\u064a\u0632\u0627\u0644",
            "\u0627\u0644\u062d\u0627\u0644\u064a",
            "\u0627\u0644\u064a\u0647\u0627",
            "\u0627\u0644\u0630\u064a\u0646",
            "\u0641\u0627\u0646\u0647",
            "\u0648\u0627\u0644\u0630\u064a",
            "\u0648\u0647\u0630\u0627",
            "\u0644\u0647\u0630\u0627",
            "\u0641\u0643\u0627\u0646",
            "\u0633\u062a\u0643\u0648\u0646",
            "\u0627\u0644\u064a\u0647",
            "\u064a\u0645\u0643\u0646",
            "\u0628\u0647\u0630\u0627",
            "\u0627\u0644\u0630\u0649",
        ];
    }

    /**
     * Stemming a word token using the ISRI stemmer.
     * 
     * @param {string} token 
     */
    stem(token){
        token = this.norm(token, 1);  // remove diacritics which representing Arabic short vowels
        if (this.stop_words.includes(token)){
            return token;  // exclude stop words from being processed
        }
        token = this.pre32(token);  // remove length three and length two prefixes in this order
        token = this.suf32(token);  // remove length three and length two suffixes in this order
        token = this.waw(token);  // remove connective ‘و’ if it precedes a word beginning with ‘و’
        token = this.norm(token, 2);  // normalize initial hamza to bare alif
        // if 4 <= word length <= 7, then stem; otherwise, no stemming
        if (token.length === 4){  // length 4 word
            token = this.pro_w4(token);
        } else if (token.length === 5){  // length 5 word
            token = this.pro_w53(token);
            token = this.end_w5(token);
        } else if (token.length === 6){  // length 6 word
            token = this.pro_w6(token);
            token = this.end_w6(token);
        } else if (token.length === 7){  // length 7 word
            token = this.suf1(token);
            if (token.length === 7){
                token = this.pre1(token);
            }
            if (token.length === 6){
                token = this.pro_w6(token);
                token = this.end_w6(token);
            }
        }
        return token;
    }


    /**
     * Normalization:
     * num=1  normalize diacritics
     * num=2  normalize initial hamza
     * num=3  both 1&2
     * 
     * @param {string} word 
     * @param {int} num 
     */
    norm(word, num=3){
        if (num === 1){
            word = this.re_short_vowels[Symbol.replace]("", word);
        } else if (num === 2){
            word = this.re_initial_hamza[Symbol.replace]("\u0627", word);
        } else if (num === 3){
            word = this.re_short_vowels[Symbol.replace]("", word);
            word = this.re_initial_hamza[Symbol.replace]("\u0627", word);
        }
        return word;
    }


    /**
     * Remove length three and length two prefixes in this order
     * 
     * @param {string} word 
     */
    pre32(word){
        if (word.length >= 6){
            for (const pre3 of this.p3){
                if (word.startsWith(pre3)){
                    return word.slice(3);
                }
            }
        }
        if (word.length >= 5){
            for (const pre2 of this.p2){
                if (word.startsWith(pre2)){
                    return word.slice(2);
                }
            }
        }
        return word;
    }


    /**
     * Remove length three and length two suffixes in this order.
     * 
     * @param {string} word 
     */
    suf32(word){
        if (word.length >= 6){
            for (const suf3 of this.s3){
                if (word.endsWith(suf3)){
                    return word.slice(null, -3);
                }
            }
        }
        if (word.length >= 5){
            for (const suf2 of this.s2){
                if (word.endsWith(suf2)){
                    return word.slice(null, -2);
                }
            }
        }
        return word;
    }


    /**
     * Remove connective ‘و’ if it precedes a word beginning with ‘و’.
     * 
     * @param {string} word 
     */
    waw(word){
        if (word.length >= 4 && word.slice(null, 2) === "\u0648\u0648"){
            word = word.slice(1);
        }
        return word;
    }


    /**
     * Process length four patterns and extract length three roots.
     * 
     * @param {string} word 
     */
    pro_w4(word){
        if (this.pr4[0].includes(word[0])){  // مفعل
            word = word.slice(1);
        }
        else if (this.pr4[1].includes(word[1])){  // فاعل
            word = word.slice(null, 1) + word.slice(2);
        }
        else if (this.pr4[2].includes(word[2])){  // فعال - فعول - فعيل
            word = word.slice(null, 2) + word[3];
        }
        else if (this.pr4[3].includes(word[3])){  // فعلة
            word = word.slice(null, -1);
        }
        else {
            word = this.suf1(word);  // do - normalize short sufix
            if (word.length === 4){
                word = this.pre1(word);  // do - normalize short prefix
            }  
        }
        return word;
    }


    /**
     * Process length five patterns and extract length three roots.
     * 
     * @param {string} word 
     */
    pro_w53(word){
        if (this.pr53[0].includes(word[2]) && word[0] === "\u0627"){  // افتعل - افاعل
            word = word[1] + word.slice(3);
        }
        else if (this.pr53[1].includes(word[3]) && word[0] === "\u0645"){  // مفعول - مفعال - مفعيل
            word = word.slice(1, 3) + word[4];
        }
        else if (this.pr53[2].includes(word[0]) && word[4] === "\u0629"){  // مفعلة - تفعلة - افعلة
            word = word.slice(1, 4);
        }
        else if (this.pr53[3].includes(word[0]) && word[2] === "\u062a"){  // مفتعل - يفتعل - تفتعل
            word = word[1] + word.slice(3);
        }
        else if (this.pr53[4].includes(word[0]) && word[2] === "\u0627"){  // مفاعل - تفاعل
            word = word[1] + word.slice(3);
        }
        else if (this.pr53[5].includes(word[2]) && word[4] === "\u0629"){  // فعولة - فعالة
            word = word.slice(null, 2) + word[3];
        }
        else if (this.pr53[6].includes(word[0]) && word[1] === "\u0646"){  // انفعل - منفعل
            word = word.slice(2);
        }
        else if (word[3] === "\u0627" && word[0] === "\u0627"){  // افعال
            word = word.slice(1, 3) + word[4];
        }
        else if (word[4] === "\u0646" && word[3] === "\u0627"){  // فعلان
            word = word.slice(null, 3);
        }
        else if (word[3] === "\u064a" && word[0] === "\u062a"){  // تفعيل
            word = word.slice(1, 3) + word[4];
        }
        else if (word[3] === "\u0648" && word[1] === "\u0627"){  // فاعول
            word = word[0] + word[2] + word[4];
        }
        else if (word[2] === "\u0627" && word[1] === "\u0648"){  // فواعل
            word = word[0] + word.slice(3);
        }
        else if (word[3] === "\u0626" && word[2] === "\u0627"){  // فعائل
            word = word.slice(null, 2)+ word[4];
        }
        else if (word[4] ==="\u0629" && word[1] === "\u0627"){  // فاعلة
            word = word[0] + word.slice(2, 4);
        }
        else if (word[4] === "\u064a" && word[2] === "\u0627"){  // فعالي
            word = word.slice(null, 2) + word[3];
        }
        else{
            word = this.suf1(word);  // do - normalize short sufix
            if (word.length === 5){
                word = this.pre1(word);  // do - normalize short prefix
            }
        }
        return word;
    }


    /**
     * Process length five patterns and extract length four roots.
     * 
     * @param {string} word 
     */
    pro_w54(word){
        if (this.pr53[2].includes(word[0])){  // تفعلل - افعلل - مفعلل
            word = word.slice(1);
        }
        else if (word[4] === "\u0629"){  // فعللة
            word = word.slice(null, 4);
        }
        else if (word[2] === "\u0627"){  // فعالل
            word = word.slice(null, 2) + word.slice(3);
        }
        return word;
    }


    /**
     * Ending step (word of length five).
     * 
     * @param {string} word 
     */
    end_w5(word){
        if (word.length === 4){
            word = this.pro_w4(word);
        }
        else if (word.length === 5){
            word = this.pro_w54(word);
        }
        return word;
    }


    /**
     * Process length six patterns and extract length three roots.
     * 
     * @param {string} word 
     */
    pro_w6(word){
        if (word.startsWith("\u0627\u0633\u062a") || word.startsWith("\u0645\u0633\u062a")){  // مستفعل - استفعل
            word = word.slice(3);
        }
        else if (word[0] === "\u0645" && word[3] === "\u0627" && word[5] === "\u0629"){  // مفعالة
            word = word.slice(1, 3) + word[4];
        }
        else if (word[0] === "\u0627" && word[2] === "\u062a" && word[4] === "\u0627"){  // افتعال
            word = word[1] + word[3] + word[5];
        }
        else if (word[0] === "\u0627" && word[3] === "\u0648" && word[2] === word[4]){  // افعوعل
            word = word[1] + word.slice(4);
        }
        else if (word[0] === "\u062a" && word[2] === "\u0627" && word[4] === "\u064a"){  // تفاعيل   new pattern
            word = word[1] + word[3] + word[5];
        }
        else{
            word = this.suf1(word);  // do - normalize short sufix
            if (word.length === 6){
                word = this.pre1(word);  // do - normalize short prefix
            }
        }
        return word;
    }


    /**
     * Process length six patterns and extract length four roots.
     * 
     * @param {string} word 
     */
    pro_w64(word){
        if (word[0] === "\u0627" && word[4] === "\u0627"){  // افعلال
            word = word.slice(1, 4) + word[5];
        }
        else if (word.startsWith("\u0645\u062a")){  // متفعلل
            word = word.slice(2);
        }
        return word;
    }


    /**
     * Ending step (word of length six).
     * 
     * @param {string} word 
     */
    end_w6(word){
        if (word.length === 5){
            word = this.pro_w53(word);
            word = this.end_w5(word);
        }
        else if (word.length === 6){
            word = this.pro_w64(word);
        }
        return word;
    }


    /**
     * Normalize short suffix.
     * 
     * @param {string} word 
     */
    suf1(word){
        for (const sf1 of this.s1){
            if (word.endsWith(sf1)){
                return word.slice(null, -1);
            }
        }
        return word;
    }


    /**
     * Normalize short prefix.
     * 
     * @param {string} word 
     */
    pre1(word){
        for (const sp1 of this.p1){
            if (word.startsWith(sp1)){
                return word.slice(1);
            }
        }
        return word
    }
}