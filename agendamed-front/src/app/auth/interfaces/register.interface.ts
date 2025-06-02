export interface IRegister {
    name: string;
    message: string;
}

export interface IRegisterError {
    message: string,
    error: string,
    statusCode: number
}