// FIXME: not used rn, doen't get caught properly

type ErrorResponse = {
    message: string
    stack?: string
}

export class CustomError {
    statusCode: number
    message: string

    constructor(statusCode: number, message: string) {
        // super(message)

        this.statusCode = statusCode
        this.message = message
    }

    get JSON(): ErrorResponse {
        return {
            message: 'hi',
            // stack: this.stack,
        }
    }
}
