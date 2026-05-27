export interface TokenPayload extends Record<string, unknown> {
  sub: string;
  email: string;
  role: string;
}

export abstract class TokenGeneratorPort {
  abstract generate(payload: TokenPayload): string;
  abstract generateRefreshToken(payload: TokenPayload): string;
  abstract verify(token: string): TokenPayload;
}
