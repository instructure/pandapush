import jwt from "jsonwebtoken";

interface TokenPayload {
  channel: string;
  pub?: boolean;
  sub?: boolean;
  presence?: Record<string, unknown>;
  exp?: number;
}

export function generateToken(
  keyId: string,
  keySecret: string,
  payload: TokenPayload,
): string {
  return jwt.sign({ keyId, ...payload }, keySecret);
}
