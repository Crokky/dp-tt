import { BaseType, factoryBaseType, BaseTypeArrToLatexString } from "../Entity/BaseType";
import { factoryReturnedEntity, ReturnedEntity } from "../Entity/ReturnedEntity";
import { VDASH } from "../Entity/CommonToken";
import { factorySTLCToken, STLCToken } from "../Entity/STLCToken";
import { bracketsChecker, getIndexOfSecondToken } from "../Utils/Utils";
import { black, red } from "../Styles/Styles";

/**
 * Function provides analyze entered expression and prepares `latex` string representation for `STLC 1` expression type.
 * 
 * @param t1 - array of `STLCToken` objects that represents first term of entered expression.
 * @param t2 - array of `STLCToken` objects that represents second term of entered expression or `undefined` if entered expression does not contain second term.
 * @param fType - array of `BaseType` objects that represents type of `f` function in entered expression or `undefined` if entered expression does not contain `f` function.
 * @param expressionType - array of `BaseType` objects that represents type of entered expression.
 * @param onError - callback function of `(message: string) => void` type for display error message.
 * @param isInner - flag of `boolean` type that represents whether the array `t1 is an internal part of the entered expression or not.
 * 
 * @returns `ReturnedEntity` object in case of success or `undefined` otherwise.
 */
export const analyzeExpression = (
    t1: STLCToken[],
    t2: STLCToken[] | undefined,
    fType: BaseType[] | undefined,
    expressionType: BaseType[],
    onError: (message: string) => void,
    isInner: boolean
): ReturnedEntity | undefined => {

    let res = "";

    if (!expressionType) {
        onError("Expression type error (#001.1)");
        return undefined;
    }

    // T-abs
    if (isTAbsRule(t1) || (t2 && isTAbsRule(t2))) {
        let result = tAbs(t1, t2, fType, expressionType, onError);
        result.str = res + result.str;
        return result;
    }
    // T-app
    else if (t2 && t1.length > 0 && t2.length > 0) {
        let result = tApp(t1, t2, fType, expressionType, onError);
        result.str = res + result.str;
        return result;
    }

    // Other rules
    else {
        switch (t1[0].tokenType) {
            case true:
                return tTrue(t1, expressionType, onError);
            case false:
                return tFalse(t1, expressionType, onError);
            case "var":
                return tVar(t1, expressionType, onError);
            case "(":
                {
                    let result = tBra(t1, fType, expressionType, onError);
                    result.str = res + result.str;
                    return result;
                }
            case "iszero":
                {
                    let result = tIszero(t1, fType, expressionType, onError);
                    result.str = res + result.str;
                    return result;
                }
            case 0:
                return tZero(t1, expressionType, onError);
            case "succ":
                {
                    let result = tSucc(t1, fType, expressionType, onError);
                    result.str = res + result.str;
                    return result;
                }
            case "pred":
                {
                    let result = tPred(t1, fType, expressionType, onError);
                    result.str = res + result.str;
                    return result;
                }
            case "if":
                {
                    let result = ifThenElse(t1, fType, expressionType, onError, isInner);
                    result.str = res + result.str;
                    return result;
                }
            case "f":
                if (fType)
                    return tF(t1, expressionType, fType, onError);
                break;

            default:
        }
    }
    onError("Undefined error (#001.2)");
    return undefined;
}

// T-APP
const tApp = (
    t1: STLCToken[],
    t2: STLCToken[],
    fType: BaseType[] | undefined,
    expressionType: BaseType[],
    onError: (message: string) => void
): ReturnedEntity => {

    let resT2 = analyzeExpression(t2, undefined, fType, expressionType, onError, false);
    let resT1 = analyzeExpression(t1, undefined, fType, resT2 ? [resT2.type[0]].concat(expressionType) : expressionType, onError, false);

    if (t1.length > 0)
        return factoryReturnedEntity(`\\dfrac{${resT1?.str} \\enspace ${resT2?.str}} {${getExpressionStringValue(t1, t2)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-app)`, []);
    else {
        onError("T-app error (#002)");
        return factoryReturnedEntity(" ", []);
    }
}

// T-ABS
const tAbs = (
    t1: STLCToken[],
    t2: STLCToken[] | undefined,
    fType: BaseType[] | undefined,
    expressionType: BaseType[],
    onError: (message: string) => void
): ReturnedEntity => {

    if (expressionType.length < 2) {
        onError("Expression type error (#003.1)");
        return factoryReturnedEntity(" ", []);
    }

    let expressionStringValue = getExpressionStringValue(t1, t2);

    if (t2) {
        let elemT1 = findFirstUnAbsVar(t1);
        let elemT2 = findFirstUnAbsVar(t2);
        let flag = true;
        if (elemT1) {
            absAllVars(t1, elemT1, expressionType);
            flag = false;
        }
        if (elemT2) {
            absAllVars(t2, elemT2, expressionType);
            flag = false;
        }
        if (flag) {
            onError("T-abs type error (#003.2)");
            return factoryReturnedEntity(" ", []);
        }
    }
    else {
        let elemT1 = findFirstUnAbsVar(t1);

        if (elemT1)
            absAllVars(t1, elemT1, expressionType);
        else {
            onError("T-abs type error (#003.3)");
            return factoryReturnedEntity(" ", []);
        }
    }

    let resT1 = analyzeExpression(t1, t2, fType, expressionType.slice(1), onError, false);

    return factoryReturnedEntity(`\\dfrac{${resT1?.str}}{${expressionStringValue} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-abs)`, resT1 ? resT1.type : []);
}

// T-VAR
const tVar = (t: STLCToken[], expressionType: BaseType[], onError: (message: string) => void): ReturnedEntity => {
    if (expressionType.length === 1 && expressionType[0].type === t[0].varType) {
        if (t[0].varType === t[0].gammaType)
            return factoryReturnedEntity(`\\dfrac{${t[0].varName} : ${t[0].gammaType} \\in \\Gamma}{\\Gamma \\vdash ${t[0].varName} : ${t[0].varType}} (T-var)`, [factoryBaseType(t[0].varType)]);
        return factoryReturnedEntity(`\\dfrac{${red} ${t[0].varName} : ${t[0].gammaType} \\in \\Gamma ${black}}{\\Gamma \\vdash ${t[0].varName} : ${t[0].varType}} (T-var)`, [factoryBaseType(t[0].varType)]);
    }

    if (t[0].varType)
        return factoryReturnedEntity(`${red} \\dfrac{${t[0].varName} : ${t[0].gammaType} \\in \\Gamma}{\\Gamma \\vdash ${t[0].varName} : ${t[0].varType}} (T-var) ${black}`, [factoryBaseType(t[0].varType)]);
    else {
        onError("T-VAR error (#004)");
        return factoryReturnedEntity(" ", []);
    }
}

//T-IS-ZERO
const tIszero = (
    t: STLCToken[],
    fType: BaseType[] | undefined,
    expressionType: BaseType[],
    onError: (message: string) => void
): ReturnedEntity => {

    if (t.length < 2) {
        onError("IS-ZERO argument error (#005)");
        return factoryReturnedEntity(" ", []);
    }

    let resT = analyzeExpression(t.slice(1), undefined, fType, [factoryBaseType("Nat")], onError, false);

    if (expressionType.length === 1) {
        if (expressionType[0].type === "Bool")
            return factoryReturnedEntity(`\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-iszero)`, expressionType);
        else
            return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-iszero)` + black, expressionType);
    }
    else if (expressionType.length === 0 && resT?.type.length === 1) {
        if (resT?.type[0].type === "Nat")
            return factoryReturnedEntity(`\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString([factoryBaseType("Bool")], onError)}} (T-iszero)`, [factoryBaseType("Bool")]);
        else
            return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString([factoryBaseType("Bool")], onError)}} (T-iszero)` + black, [factoryBaseType("Bool")]);
    }
    return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-iszero)` + black, expressionType);
}

// T-ZERO
const tZero = (t: STLCToken[], expressionType: BaseType[], onError: (message: string) => void): ReturnedEntity => {
    if (expressionType.length === 1 && expressionType[0].type === "Nat")
        return factoryReturnedEntity(`\\dfrac{}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString([factoryBaseType("Nat")], onError)}} (T-zero)`, [factoryBaseType("Nat")]);
    else if (expressionType.length === 0)
        return factoryReturnedEntity(`\\dfrac{}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString([factoryBaseType("Nat")], onError)}} (T-zero)`, [factoryBaseType("Nat")]);
    return factoryReturnedEntity(red + `\\dfrac{}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString([factoryBaseType("Nat")], onError)}} (T-zero)` + black, [factoryBaseType("Nat")]);
}

// T-TRUE
const tTrue = (t: STLCToken[], expressionType: BaseType[], onError: (message: string) => void): ReturnedEntity => {
    if (expressionType.length === 1 && expressionType[0].type === "Bool")
        return factoryReturnedEntity(`\\dfrac{}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-true)`, [factoryBaseType("Bool")]);
    else if (expressionType.length === 0)
        return factoryReturnedEntity(`\\dfrac{}{${getExpressionStringValue(t, undefined)} :Bool} (T-true)`, [factoryBaseType("Bool")]);
    return factoryReturnedEntity(red + `\\dfrac{}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-true)` + black, [factoryBaseType("Bool")]);
}

// T-FALSE
const tFalse = (t: STLCToken[], expressionType: BaseType[], onError: (message: string) => void): ReturnedEntity => {
    if (expressionType.length === 1 && expressionType[0].type === "Bool")
        return factoryReturnedEntity(`\\dfrac{}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-false)`, [factoryBaseType("Bool")]);
    else if (expressionType.length === 0)
        return factoryReturnedEntity(`\\dfrac{}{${getExpressionStringValue(t, undefined)} :Bool} (T-false)`, [factoryBaseType("Bool")]);
    return factoryReturnedEntity(red + `\\dfrac{}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-false)` + black, [factoryBaseType("Bool")]);
}

// T-SUCC
const tSucc = (
    t: STLCToken[],
    fType: BaseType[] | undefined,
    expressionType: BaseType[],
    onError: (message: string) => void
): ReturnedEntity => {

    if (t.length < 2) {
        onError("SUCC argument error (#006)");
        return factoryReturnedEntity(" ", []);
    }

    let resT = analyzeExpression(t.slice(1), undefined, fType, expressionType, onError, true);

    if (expressionType.length === 1) {
        if (expressionType[0].type === "Nat")
            return factoryReturnedEntity(`\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-succ)`, expressionType);
        else
            return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-succ)` + black, expressionType);
    }
    else if (expressionType.length === 0 && resT?.type.length === 1) {
        if (resT?.type[0].type === "Nat")
            return factoryReturnedEntity(`\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString([resT?.type[0]], onError)}} (T-succ)`, [resT?.type[0]]);
        else
            return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString([resT?.type[0]], onError)}} (T-succ)` + black, [resT?.type[0]]);
    }
    return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-succ)` + black, expressionType);
}

// T-PRED
const tPred = (
    t: STLCToken[],
    fType: BaseType[] | undefined,
    expressionType: BaseType[],
    onError: (message: string) => void
): ReturnedEntity => {

    if (t.length < 2) {
        onError("PRED argument error (#007)");
        return factoryReturnedEntity(" ", []);
    }

    let resT = analyzeExpression(t.slice(1), undefined, fType, expressionType, onError, true);

    if (expressionType.length === 1) {
        if (expressionType[0].type === "Nat")
            return factoryReturnedEntity(`\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-pred)`, expressionType);
        else
            return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-pred)` + black, expressionType);
    }
    else if (expressionType.length === 0 && resT?.type.length === 1) {
        if (resT?.type[0].type === "Nat")
            return factoryReturnedEntity(`\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString([resT?.type[0]], onError)}} (T-pred)`, [resT?.type[0]]);
        else
            return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString([resT?.type[0]], onError)}} (T-pred)` + black, [resT?.type[0]]);
    }
    return factoryReturnedEntity(red + `\\dfrac{${resT?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-pred)` + black, expressionType);
}

// IF-THEN-ELSE
const ifThenElse = (
    t: STLCToken[],
    fType: BaseType[] | undefined,
    expressionType: BaseType[],
    onError: (message: string) => void,
    isInner: boolean,
): ReturnedEntity => {

    let ifClause: STLCToken[] = [];
    let thenClause: STLCToken[] = [];
    let elseClause: STLCToken[] = [];

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

    let isCorrect: boolean = t[0].tokenType === "if" && isInner && (expressionType.length === 1 && expressionType[0] === factoryBaseType("Nat")) ? false : true;

    let expression: STLCToken[] = t[0].tokenType === "if" ? t.slice(1) : t.slice(0);

    for (iIf = 0; iIf < expression.length; iIf++) {
        if (expression[iIf].tokenType !== "then" && expression[iIf].tokenType !== "if") {
            ifClause.push(expression[iIf]);
            if (iIf === expression.length - 1) {
                onError("IF-THEN-ELSE syntax error. Expression has one or more errors. One of them - THEN clause is missing (#008.2)" + JSON.stringify(expression));
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
            let index = getIndexOfSecondToken(newArr, factorySTLCToken("then"));

            expression = newArr.slice(index + 1, newArr.length);
            let innerExpression = ifClause.concat(newArr.slice(0, index));
            innerIfStr = analyzeExpression(innerExpression, undefined, fType, [factoryBaseType("Bool")], onError, true);

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
            let index = getIndexOfSecondToken(newArr, factorySTLCToken("else"));

            expression = newArr.slice(index + 1, newArr.length);
            let innerExpression = thenClause.concat(newArr.slice(iThen - 1, index));
            innerThenStr = analyzeExpression(innerExpression, undefined, fType, expressionType, onError, true);

            iThen = 0;
            break;

        }
    }
    for (iElse = iThen; iElse < expression.length; iElse++) {
        if (expression[iElse].tokenType !== "if") {
            elseClause.push(expression[iElse]);
        }
        else if (expression[iElse].tokenType === "if") {
            let newArr = expression.slice(iElse, expression.length);

            expression = newArr.slice(0, newArr.length);
            let innerExpression = elseClause.concat(newArr.slice(iElse - 1, newArr.length));
            innerElseStr = analyzeExpression(innerExpression, undefined, fType, expressionType, onError, true);

            iElse = 0;
            break;
        }
    }

    let ifValue: ReturnedEntity | undefined = innerIfStr === undefined ? analyzeExpression(ifClause, undefined, fType, [factoryBaseType("Bool")], onError, false) : innerIfStr;
    let thenValue: ReturnedEntity | undefined = innerThenStr === undefined ? analyzeExpression(thenClause, undefined, fType, expressionType, onError, false) : innerThenStr;
    let elseValue: ReturnedEntity | undefined = innerElseStr === undefined ? analyzeExpression(elseClause, undefined, fType, expressionType, onError, false) : innerElseStr;

    if (thenValue?.type[0].type !== elseValue?.type[0].type) {
        onError("IF-THEN-ELSE syntax error. Expression has one or more errors. One of them - THEN and ELSE branches don't have the same type (#008.6)");
        return factoryReturnedEntity(" ", []);
    }

    if (isInner) {
        if (isCorrect) {
            return factoryReturnedEntity(`\\dfrac{${ifValue?.str} \\enspace ${thenValue?.str} \\enspace ${elseValue?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(thenValue ? thenValue?.type : [], onError)}} (T-if)`, thenValue ? thenValue?.type : []);
        }
        else {
            return factoryReturnedEntity(red + `\\dfrac{${ifValue?.str} \\enspace ${thenValue?.str} \\enspace ${elseValue?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(thenValue ? thenValue?.type : [], onError)}} (T-if)` + black, thenValue ? thenValue?.type : []);
        }
    }

    return factoryReturnedEntity(`\\dfrac{${ifValue?.str} \\enspace ${thenValue?.str} \\enspace ${elseValue?.str}}{${getExpressionStringValue(t, undefined)} : ${BaseTypeArrToLatexString(expressionType.length > 0 ? expressionType : thenValue ? thenValue?.type : [], onError)}} (T-if)`, thenValue ? thenValue?.type : []);
}

// T-F
const tF = (t1: STLCToken[], expressionType: BaseType[], fType: BaseType[], onError: (message: string) => void): ReturnedEntity => {
    if (t1.length > 1) {
        onError("Syntax error. Expression has one or more errors. (#009)");
        return factoryReturnedEntity(" ", []);
    }
    if (expressionType.length === 2 && expressionType[0].type === fType[0].type && expressionType[1].type === fType[1].type)
        return factoryReturnedEntity(`\\dfrac{${t1[0].tokenType} : ${BaseTypeArrToLatexString(expressionType, onError)} \\in \\Gamma}{\\Gamma \\vdash ${t1[0].tokenType} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-var)`, []);
    return factoryReturnedEntity(red + `\\dfrac{${t1[0].tokenType} : ${BaseTypeArrToLatexString(expressionType, onError)} \\in \\Gamma}{\\Gamma \\vdash ${t1[0].tokenType} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-var)` + black, []);
}

// T-()
const tBra = (
    t1: STLCToken[],
    fType: BaseType[] | undefined,
    expressionType: BaseType[],
    onError: (message: string) => void

): ReturnedEntity => {

    if (t1.length < 3) {
        onError("T-() syntax error (#010.1)");
        return factoryReturnedEntity(" ", []);
    }

    let arr = t1.slice();

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

            let result = analyzeExpression(arr, undefined, fType, expressionType, onError, false);

            if (expressionType.length > 0)
                return factoryReturnedEntity(`\\dfrac{${result ? result.str : ""}}{${getExpressionStringValue(t1, undefined)} : ${BaseTypeArrToLatexString(expressionType, onError)}} (T-())`, expressionType);
            else
                return factoryReturnedEntity(`\\dfrac{${result ? result.str : ""}}{${getExpressionStringValue(t1, undefined)} : ${result ? BaseTypeArrToLatexString(result ? result.type : [], onError) : "UNDEFINED TYPE"}} (T-())`, result ? result.type : []);

        case 1:
        default:
            onError("T-() syntax error (#010.2)");
            return factoryReturnedEntity(" ", []);
    }
}

const getExpressionStringValue = (t1: STLCToken[], t2: STLCToken[] | undefined): string => {

    let arrays = t2 ? t1.concat(t2) : t1.slice();
    let arrayOfVars: STLCToken[] = [];

    let part1 = " \\Gamma" + VDASH;
    let part2 = "";

    arrays.forEach(elem => {
        if (elem.tokenType === "var" && !elem.varAbstracted && elem.varName && elem.varType && !arrayOfVars.find(e => e.varName === elem.varName))
        {
            part1 += ` \\lambda ${elem.varName}:${elem.varType}. `;
            arrayOfVars.push(elem);
        }
    });

    arrays.forEach(elem => {
        if (elem.tokenType === "var")
            part2 += " \\enspace " + elem.varName;
        else
            part2 += " \\enspace " + elem.tokenType;
    });

    let res = part1 + part2;

    return res;
}

const findFirstUnAbsVar = (t: STLCToken[]): STLCToken | undefined => {
    return t.find(elem => elem.tokenType === "var" && elem.varAbstracted === false);
}

const absAllVars = (t: STLCToken[], token: STLCToken, expressionType: BaseType[]): void => {
    t.forEach(elem => {
        if (elem.tokenType === "var" && elem.varName === token.varName) {
            elem.varAbstracted = true;
            elem.gammaType = expressionType[0].type;
        }
    });
}

const isTAbsRule = (t: STLCToken[]): boolean => {
    let lbPosition = 0;

    t.forEach((elem, index) => {
        if (elem.tokenType === "(") {
            lbPosition = index;
            return;
        }
    });

    for (let i = lbPosition; i < t.length; i++) {
        if (t[i].tokenType === "var" && !t[i].varAbstracted)
            return true;
    }

    return false;
}