/**
 * `PageProps` - interface that provides properties for related pages.
 * 
 * @property infoHandler - callback function of `(message: string) => void` type for display information message.
 * @property errorHandler - callback function of `(message: string) => void` type for display error message.
 * @property errorMessages - array of `string` types that represents amount of errors. Optional property.
 */
export interface PageProps {
    infoHandler: (message: string) => void,
    errorHandler: (message: string) => void,
    errorMessages?: string[]
}

/**
 * `CommonPageProps` interface.
 * 
 * @property isTNBL - flag of `boolean` type that represents is related page `T-NBL` or not.
 */
export interface CommonPageProps {
    isTNBL: boolean
}