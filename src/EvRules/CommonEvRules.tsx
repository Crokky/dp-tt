import { BaseType, BaseTypeArrToLatexString, factoryBaseType } from "../Entity/BaseType";
import { factoryReturnedEntity, ReturnedEntity } from "../Entity/ReturnedEntity";
import { factoryCommonToken, CommonToken, VDASH } from "../Entity/CommonToken";
import { bracketsChecker, getIndexOfSecondToken } from "../Utils/Utils";
import { black, red } from "../Styles/Styles";

/**
 * Function provides analyze entered expression and prepares `latex` string representation for `STLC 2` as well as for `T-NBL` expression type.
 * 
 * @param t - array of `CommonToken` objects that represents entered expression.
 * @param expressionType - entered expression's type of `BaseType` type.
 * @param onError - callback function of `(message: string) => void` type for display error message.
 * @param isInner - flag of `boolean` type that represents whether the array `t` is an internal part of the entered expression or not.
 * @param isTNBL - flag of  `boolean` type that represents whether the array `t` is a T-NBL expression type or not.
 * 
 * @returns `ReturnedEntity` object in case of success or `undefined` otherwise.
 */
export const analyzeExpression = (
    t: CommonToken[],
    expressionType: BaseType,
    onError: (message: string) => void,
    isInner: boolean,
    isTNBL: boolean
): ReturnedEntity | undefined => {

    if (t.length === 0) {
        onError("Expression error (#001.1)");
        return undefined;
    }

    // brackets checker
    if (bracketsChecker(t) < 0) {
        onError("Brackets mismatch (#001.2)");
        return undefined;
    }

    switch (t[0].tokenType) {
        case true:
            return tTrue(t, [expressionType], isTNBL, onError);

        case false:
            return tFalse(t, [expressionType], isTNBL, onError);

        case "pred":
            return tPred(t, expressionType, onError, isTNBL);

        case "succ":
            return tSucc(t, expressionType, onError, isTNBL);

        case "iszero":
            return tIszero(t, expressionType, onError, isTNBL);

        case 0:
            return tZero(t, [expressionType], isTNBL, onError);

        case "if":
            return ifThenElse(t, expressionType, onError, isInner, isTNBL);

        case "(":
            return tBra(t, expressionType, onError, isTNBL);

        default:
            onError("Undefined error (#001.3)");
            return undefined;
    }
}

//T-IS-ZERO
const tIszero = (
    t: CommonToken[],
    expressionType: BaseType,
    onError: (message: string) => void,
    isTNBL: boolean
): ReturnedEntity => {

    if (t.length < 2) {
        onError("IS-ZERO argument error (#005)");
        return factoryReturnedEntity(" ", []);
    }

    let resT = analyzeExpression(t.slice(1), factoryBaseType("Nat"), onError, false, isTNBL);

    if (expressionType.type === "Bool") {
        return factoryReturnedEntity(`\\dfrac{${resT?.str}}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([expressionType], onError)}} (T-iszero)`, [expressionType]);
    }
    return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([expressionType], onError)}} (T-iszero)` + black, [expressionType]);
}

// T-ZERO
const tZero = (t: CommonToken[], expressionType: BaseType[], isTNBL: boolean, onError: (message: string) => void): ReturnedEntity => {

    if (expressionType.length === 1 && expressionType[0].type === "Nat")
        return factoryReturnedEntity(`\\dfrac{}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([factoryBaseType("Nat")], onError)}} (T-zero)`, [factoryBaseType("Nat")]);
    else if (expressionType.length === 0)
        return factoryReturnedEntity(`\\dfrac{}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([factoryBaseType("Nat")], onError)}} (T-zero)`, [factoryBaseType("Nat")]);
    return factoryReturnedEntity(red + `\\dfrac{}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([factoryBaseType("Nat")], onError)}} (T-zero)` + black, [factoryBaseType("Nat")]);
}

// T-TRUE
const tTrue = (t: CommonToken[], expressionType: BaseType[], isTNBL: boolean, onError: (message: string) => void): ReturnedEntity => {
    if (expressionType.length === 1 && expressionType[0].type === "Bool")
        return factoryReturnedEntity(`\\dfrac{}{ ${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-true)`, [factoryBaseType("Bool")]);
    else if (expressionType.length === 0)
        return factoryReturnedEntity(`\\dfrac{}{ ${getExpressionStringValue(t, isTNBL)} :Bool} (T-true)`, [factoryBaseType("Bool")]);
    return factoryReturnedEntity(red + `\\dfrac{} ${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-true)` + black, [factoryBaseType("Bool")]);
}

// T-FALSE
const tFalse = (t: CommonToken[], expressionType: BaseType[], isTNBL: boolean, onError: (message: string) => void): ReturnedEntity => {
    if (expressionType.length === 1 && expressionType[0].type === "Bool")
        return factoryReturnedEntity(`\\dfrac{}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-false)`, [factoryBaseType("Bool")]);
    else if (expressionType.length === 0)
        return factoryReturnedEntity(`\\dfrac{}{${getExpressionStringValue(t, isTNBL)} :Bool} (T-false)`, [factoryBaseType("Bool")]);
    return factoryReturnedEntity(red + `\\dfrac{}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-false)` + black, [factoryBaseType("Bool")]);
}

// T-SUCC
const tSucc = (
    t: CommonToken[],
    expressionType: BaseType,
    onError: (message: string) => void,
    isTNBL: boolean
): ReturnedEntity => {

    if (t.length < 2) {
        onError("SUCC argument error (#006)");
        return factoryReturnedEntity(" ", []);
    }

    let resT = analyzeExpression(t.slice(1), expressionType, onError, false, isTNBL);

    if (expressionType.type === "Nat" || (resT?.type.length === 1 && resT?.type[0].type === "Nat")) {
        return factoryReturnedEntity(`\\dfrac{${resT?.str}}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([expressionType], onError)}} (T-succ)`, [expressionType]);
    }
    return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([expressionType], onError)}} (T-succ)` + black, resT ? resT.type : []);
}

// T-PRED
const tPred = (
    t: CommonToken[],
    expressionType: BaseType,
    onError: (message: string) => void,
    isTNBL: boolean
): ReturnedEntity => {

    if (t.length < 2) {
        onError("PRED argument error (#007)");
        return factoryReturnedEntity(" ", []);
    }

    let resT = analyzeExpression(t.slice(1), expressionType, onError, false, isTNBL);

    if (expressionType.type === "Nat" || (resT?.type.length === 1 && resT?.type[0].type === "Nat")) {
        return factoryReturnedEntity(`\\dfrac{${resT?.str}}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([expressionType], onError)}} (T-pred)`, [expressionType]);
    }
    return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([expressionType], onError)}} (T-pred)` + black, resT ? resT.type : []);
}

// IF-THEN-ELSE
const ifThenElse = (
    t: CommonToken[],
    expressionType: BaseType,
    onError: (message: string) => void,
    isInner: boolean,
    isTNBL: boolean
): ReturnedEntity => {

    let ifClause: CommonToken[] = [];
    let thenClause: CommonToken[] = [];
    let elseClause: CommonToken[] = [];

    let iIf: number = 0;
    let iThen: number;
    let iElse: number;

    let innerIfStr: ReturnedEntity | undefined = undefined;
    let innerThenStr: ReturnedEntity | undefined = undefined;
    let innerElseStr: ReturnedEntity | undefined = undefined;

    if (t.length === 0) {
        onError("IF-THEN-ELSE syntax error (#008.1)");
        return factoryReturnedEntity(" ", []);
    }

    let isCorrect: boolean = t[0].tokenType === "if" && isInner && expressionType.type === "Nat" ? false : true;

    let expression: CommonToken[] = t[0].tokenType === "if" ? t.slice(1) : t.slice(0);

    for (iIf = 0; iIf < expression.length; iIf++) {
        if (expression[iIf].tokenType !== "then" && expression[iIf].tokenType !== "if") {
            ifClause.push(expression[iIf]);
            if (iIf === expression.length - 1) {
                onError("IF-THEN-ELSE syntax error. Expression has one or more errors. One of them - THEN clause is missing (#008.2)");
                return factoryReturnedEntity(" ", []);
            }
        }
        else if (expression[iIf].tokenType === "then") {
            if (iIf === expression.length - 1) {
                onError("IF-THEN-ELSE syntax error. Expression has one or more errors. One of them - THEN clause is missing (#008.3)");
                return factoryReturnedEntity(" ", []);
            }
            expression.shift();
            break;
        }
        else if (expression[iIf].tokenType === "if") {
            let newArr = expression.slice(iIf, expression.length);
            let index = getIndexOfSecondToken(newArr, factoryCommonToken("then"));

            expression = newArr.slice(index + 1, newArr.length);
            let innerExpression = ifClause.concat(newArr.slice(0, index));
            innerIfStr = analyzeExpression(innerExpression, factoryBaseType("Bool"), onError, true, isTNBL);

            iIf = 0;
            break;
        }
    }
    for (iThen = iIf; iThen < expression.length; iThen++) {
        if (expression[iThen].tokenType !== "else" && expression[iThen].tokenType !== "if") {
            thenClause.push(expression[iThen]);
            if (iThen === expression.length - 1) {
                onError("IF-THEN-ELSE syntax error. Expression has one or more errors. One of them - ELSE clause is missing (#008.4)");
                return factoryReturnedEntity(" ", []);
            }
        }
        else if (expression[iThen].tokenType === "else") {
            if (iThen === expression.length - 1) {
                onError("IF-THEN-ELSE syntax error. Expression has one or more errors. One of them - ELSE clause is missing (#008.5)");
                return factoryReturnedEntity(" ", []);
            }
            expression.shift();
            break;
        }
        else if (expression[iThen].tokenType === "if") {
            let newArr = expression.slice(iThen, expression.length);
            let index = getIndexOfSecondToken(newArr, factoryCommonToken("else"));

            expression = newArr.slice(index + 1, newArr.length);
            let innerExpression = thenClause.concat(newArr.slice(iThen - 1, index));
            innerThenStr = analyzeExpression(innerExpression, expressionType, onError, true, isTNBL);

            iThen = 0;
            break;

        }
    }
    for (iElse = iThen; iElse < expression.length; iElse++) {
        if ((expression[iElse].tokenType !== "Nat" || expression[iElse].tokenType !== "Bool") && expression[iElse].tokenType !== "if") {
            elseClause.push(expression[iElse]);
        }
        else if (expression[iElse].tokenType === "if") {
            let newArr = expression.slice(iElse, expression.length);
            let index = getIndexOfSecondToken(newArr, factoryCommonToken("Nat"));
            if (index === -1)
                index = getIndexOfSecondToken(newArr, factoryCommonToken("Bool"));

            expression = newArr.slice(index + 1, newArr.length);
            let innerExpression = elseClause.concat(newArr.slice(iElse - 1, newArr.length));
            innerElseStr = analyzeExpression(innerExpression, expressionType, onError, true, isTNBL);

            iElse = 0;
            break;

        }
    }

    let ifValue: ReturnedEntity | undefined = innerIfStr === undefined ? analyzeExpression(ifClause, factoryBaseType("Bool"), onError, false, isTNBL) : innerIfStr;
    let thenValue: ReturnedEntity | undefined = innerThenStr === undefined ? analyzeExpression(thenClause, expressionType, onError, false, isTNBL) : innerThenStr;
    let elseValue: ReturnedEntity | undefined = innerElseStr === undefined ? analyzeExpression(elseClause, expressionType, onError, false, isTNBL) : innerElseStr;

    if (thenValue?.type[0].type !== elseValue?.type[0].type) {
        onError("IF-THEN-ELSE syntax error. Expression has one or more errors. One of them - THEN and ELSE branches don't have the same type (#008.6)");
        return factoryReturnedEntity(" ", []);
    }

    if (isInner) {
        if (isCorrect) {
            return factoryReturnedEntity(`\\dfrac{${ifValue?.str} \\enspace ${thenValue?.str} \\enspace ${elseValue?.str}}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString(thenValue ? thenValue?.type : [], onError)}} (T-if)`, thenValue ? thenValue?.type : []);
        }
        else {
            return factoryReturnedEntity(red + `\\dfrac{${ifValue?.str} \\enspace ${thenValue?.str} \\enspace ${elseValue?.str}}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString(thenValue ? thenValue?.type : [], onError)}} (T-if)` + black, thenValue ? thenValue?.type : []);
        }
    }

    return factoryReturnedEntity(`\\dfrac{${ifValue?.str} \\enspace ${thenValue?.str} \\enspace ${elseValue?.str}}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([expressionType], onError)}} (T-if)`, thenValue ? thenValue?.type : []);
}

// T-bra
const tBra = (
    t: CommonToken[],
    expressionType: BaseType,
    onError: (message: string) => void,
    isTNBL: boolean
): ReturnedEntity => {

    if (t.length < 3) {
        onError("T-BRA syntax error (#010.1)");
        return factoryReturnedEntity(" ", []);
    }

    let arr = t.slice();

    let left: number | undefined;
    let right: number | undefined;

    switch (bracketsChecker(arr)) {
        case 0:
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].tokenType === "(") {
                    left = i;
                    break;
                }
            }
            for (let i = arr.length - 1; i > 0; i--) {
                if (arr[i].tokenType === ")") {
                    right = i;
                    break;
                }
            }

            if (left !== undefined && right !== undefined) {
                arr.splice(left, 1);
                arr.splice(right - 1, 1);
            }

            let result = analyzeExpression(arr, expressionType, onError, false, isTNBL);

            return factoryReturnedEntity(`\\dfrac{${result ? result.str : ""}}{${getExpressionStringValue(t, isTNBL)} : ${BaseTypeArrToLatexString([expressionType], onError)}} (T-bra)`, [expressionType]);

        case 1:
        default:
            onError("T-BRA syntax error (#010.2)");
            return factoryReturnedEntity(" ", []);
    }
}

const getExpressionStringValue = (t: CommonToken[], isTNBL: boolean): string => {

    let t1Copy = t.slice();
    let res = isTNBL ? " " : VDASH;
    res += t1Copy.map(elem => elem.tokenType).join(" \\enspace ");

    return res;
}