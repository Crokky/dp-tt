import { BaseType } from "./BaseType";

/**
 * `ReturnedEntity` interface.
 * 
 * @property str - represents `latex` string.
 * @property type - represents evaluated type of expression.
 */
export interface ReturnedEntity {
    str: string;
    type: BaseType[];
}

/**
 * Factory of `ReturnedEntity` object.
 * 
 * @property str - represents `latex` string.
 * @property type - represents evaluated type of expression. 
 * 
 * @returns `ReturnedEntity` object.
 */
export const factoryReturnedEntity = (
    str: string,
    type: BaseType[]
): ReturnedEntity => ({
    str: str,
    type: type
});