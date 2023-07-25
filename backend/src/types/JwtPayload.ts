export type TJwtTokenType = 'verify-email' | 'api-key' | 'password-reset'

export type TJWTPayload = {
    id: number
    email: string
    tokenType: TJwtTokenType
}
