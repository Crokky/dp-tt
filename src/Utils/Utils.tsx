import { STLCToken } from "../Entity/STLCToken";
import { CommonToken } from "../Entity/CommonToken";

/**
 * Function that checks the number of brackets.
 * 
 * @param arr - array of `STLCToken[]` or `CommonToken` objects that represents entered expression.
 * 
 * @returns number that indicates brackets ratio. If number is positive - right brackets more then left brackets. If number is negative - left brackets more then right brackets. If number equals 0 - the count of left and right brackets the same.
 */
export const bracketsChecker = (
    arr: STLCToken[] | CommonToken[]
): number => {

    let counter: number = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].tokenType === "(")
            counter++;
        else if (arr[i].tokenType === ")")
            counter--;

    }
    return counter;
}

/**
 * Function that provides possition index of the sought token in array.
 *
 * @param arr - array of `STLCToken[]` or `CommonToken` objects that represents expression.
 * @param token - token of `STLCToken` or `CommonToken` type which should be found.
 * 
 * @returns index of the sought token or `-1` if token doesn't found.
 */
export const getIndexOfSecondToken = (arr: STLCToken[] | CommonToken[], token: STLCToken | CommonToken): number => {
    let flag = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].tokenType === token.tokenType) {
            flag++;
        }
        if (flag === 2) {
            return i;
        }
    }
    return -1;
}

/**
 * Generator function that provides unique variables names.
 * 
 * @returns unique variable name. Possible results: from `a` to `e` and from `g` to `z`.
 */
export function* getNextVar() {
    var index = 97;
    while (index < 123)
    {
        if (index === 102)
            index += 1;
        yield String.fromCharCode(index++);
    }
  }