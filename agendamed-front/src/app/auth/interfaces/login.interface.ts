export interface ILogin {
    message: string,
    access_token: string
}

export interface ILoginError {
    message: string,
    error: string,
    statusCode: number
}