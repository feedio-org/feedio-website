import { CognitoUserPool } from "amazon-cognito-identity-js";
const awsconfig = {
  //   Auth: {
  region: "us-east-1",
  UserPoolId: "us-east-1_tE36FUCEy",
  ClientId: "7g080on7ebd8lmiuu0u2nmigtv",
  cookieStorage: {
    // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    domain: ".yourdomain.com",
    // OPTIONAL - Cookie path
    path: "/",
    // OPTIONAL - Cookie expiration in days
    expires: 365,
    // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    sameSite: "strict" | "lax",
    // OPTIONAL - Cookie secure flag
    // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    secure: true,
  },
  oauth: {
    domain: "https://videoassistant.auth.us-east-1.amazoncognito.com",
    scope: ["email", "profile"],
    redirectSignIn: "http://localhost:3000/",
    redirectSignOut: "http://localhost:3000/",
    responseType: "code", // or 'token'
  },
};

export default new CognitoUserPool(awsconfig);
