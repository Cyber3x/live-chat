export class CustomError<T> extends Error {
    message: string
    error?: T

    constructor(message: string, error?: T) {
        super(message)
        this.message = message
        this.error = error
    }
}
