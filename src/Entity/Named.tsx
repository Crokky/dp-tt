import { BaseType } from "./BaseType";

/**
 * `Named` interface.
 * 
 * @property expression - identifier that uniquely identifies `Named` object. Readonly property.
 * @property setExpression - array of `T extends BaseType` objects. Readonly property.
 */
export interface Named<T extends BaseType[]> {
  readonly id: number;
  readonly type: T;
}

/**
 * Factory of `Named` object.
 * 
 * @param id - identifier that uniquely identifies `Named` object.
 * @param type - array of `BaseType` objects.
 * 
 * @returns `Named` object.
 */
export const toNamed = (id: number, type: BaseType[]): Named<BaseType[]> => ({
  id: id,
  type: type,
});