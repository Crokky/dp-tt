/**
 * `BaseType` interface.
 * 
 * @property type - token's or expression's base type.
 */
export interface BaseType {
    type: "Nat" | "Bool";
}

/**
 * Factory of `BaseType` object.
 * 
 * @param type - `Nat` or `Bool` type of `BaseType` object.
 * 
 * @returns `BaseType` object.
 */
export const factoryBaseType = (
    type: "Nat" | "Bool"
): BaseType => ({
    type: type
});

/**
 * Function provides `latex` string representation of array of `BaseType` objects.
 * 
 * @param types - array of `BaseType` objects.
 * @param onError - callback function of `(message: string) => void` type for display error message.
 * 
 * @returns `latex` string representation of array of `BaseType` objects.
 */
export const BaseTypeArrToLatexString = (types: BaseType[], onError: (message: string) => void): string => {
    if (types && types.length > 0 && types[0] !== undefined)
        return types.map(elem => { return elem.type }).join(" \\to ");

    onError("Expression error");
    return "ERROR";
}