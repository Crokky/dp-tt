/**
 * `STLCToken` interface.
 * 
 * @property tokenType - defines STLC token.
 * @property varName - stores the name of a variable if the token is a `var`. Optional property.
 * @property varType - stores the type of a variable if the token is a `var`. Optional property.
 * @property varAbstracted - stores the state (is variable abstracted or not) of a variable if the token is a `var`. Optional property.
 * @property gammaType - stores the context type of a variable if the token is a `var`. Optional property.
 */
export interface STLCToken {
    tokenType: true | false | "pred" | "succ" | "iszero" | 0 | "if" | "then" | "else" | "(" | ")" | "VD" | "var" | "f";
    varName?: string;
    varType?: "Nat" | "Bool";
    varAbstracted?: boolean;
    gammaType?: "Nat" | "Bool";
}

/**
 * Factory of `STLCToken` object.
 * 
 * @param tokenType - type of token. Possible types options: `true` or `false` or `pred` or `succ` or `iszero` or `0` or `if` or `then` or `else` or `(` or `)` or `VD` or `var` or `f`
 * @param varName - stores the name of a variable if the token is a `var`. Optional property.
 * @param varType - stores the type of a variable if the token is a `var`. Optional property.
 * @param varAbstracted - stores the state (is variable abstracted or not) of a variable if the token is a `var`. Optional property.
 * @param gammaType - stores the context type of a variable if the token is a `var`. Optional property.
 * 
 * @returns `STLCToken` object.
 */
export const factorySTLCToken = (
    tokenType: true | false | "pred" | "succ" | "iszero" | 0 | "if" | "then" | "else" | "(" | ")" | "VD" | "var" | "f",
    varName?: string,
    varType?: "Nat" | "Bool",
    varAbstracted?: boolean,
    gammaType?: "Nat" | "Bool"
): STLCToken => (
    {
        tokenType: tokenType,
        varName: varName,
        varType: varType,
        varAbstracted: varAbstracted,
        gammaType: gammaType
    }
);