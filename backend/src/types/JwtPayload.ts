export type TJwtTokenType = 'verify-email' | 'api-key'

export type TJWTPayload = {
    id: number
    email: string
    type: TJwtTokenType
}
