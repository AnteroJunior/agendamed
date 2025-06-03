export interface ILogin {
    message: string,
    access_token: string
}

export interface ILoginError {
    error: {
        message: string,
        error: string,
        statusCode: number
    }
}