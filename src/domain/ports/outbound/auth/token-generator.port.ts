export type TokenPayload = {
  sub: string; // cedula
  email: string;
  role: string;
};

export abstract class TokenGeneratorPort {
  abstract generateAccessToken(payload: TokenPayload): string;
  abstract generateRefreshToken(payload: TokenPayload): string;
  abstract verifyAccessToken(token: string): TokenPayload;
  abstract verifyRefreshToken(token: string): TokenPayload;
}
