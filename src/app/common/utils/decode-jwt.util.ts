import { jwtDecode, JwtPayload } from "jwt-decode";

export function getDecodedAccessToken(token: string): any {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (Error) {
    return null;
  }
}
