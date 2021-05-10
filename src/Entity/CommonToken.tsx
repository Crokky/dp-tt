/**
 * `CommonToken` interface.
 * 
 * @property tokenType - defines common token.
 */
export interface CommonToken {
    tokenType: true | false | "pred" | "succ" | "iszero" | 0 | "if" | "then" | "else" | "(" | ")" | "Nat" | "Bool"
}

/**
 * Factory of `CommonToken` object.
 * 
 * @param type - type of token. Possible types options: `true` or `false` or `pred` or `succ` or `iszero` or `0` or `if` or `then` or `else` or `(` or `)` or `Nat` or `Bool`
 * 
 * @returns `CommonToken` object.
 */
export const factoryCommonToken = (
    type: true | false | "pred" | "succ" | "iszero" | 0 | "if" | "then" | "else" | "(" | ")" | "Nat" | "Bool"
): CommonToken => ({
    tokenType: type
});

/**
 * Constant that represents `latex` tourniquet.
 */
export const VDASH = " \\vdash ";