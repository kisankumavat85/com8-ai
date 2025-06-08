import { z, ZodError } from "zod";
import { env } from "./env";

const AccessTokenSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  scope: z.string(),
});

const UserSchema = z.object({
  id: z.number(),
  email: z.string().nullable(),
  name: z.string(),
  avatar_url: z.string(),
});

export class AuthClient {
  provider: string;

  constructor(provider: string) {
    this.provider = provider;
  }

  private get redirectURL() {
    const url = new URL(
      env.OAUTH_BASE_REDIRECT_URI.replace("provider", this.provider)
    ).toString();
    return url;
  }

  generateState = (length: number = 32) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    // This chars.length pick character from chars
    return Array.from(array, (value) => chars[value % chars.length]).join("");
  };

  createAuthURL = (state: string) => {
    const url = "https://github.com/login/oauth/authorize";
    const authURL = new URL(url);
    // TODO: remove static provider
    // console.log("redirectURL", this.redirectURL);
    authURL.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    authURL.searchParams.set("redirect_uri", this.redirectURL);
    authURL.searchParams.set("state", state);
    authURL.searchParams.set("scopes", "user");
    return authURL.toString();
  };

  getAccessToken = async (code: string) => {
    const payload = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: this.redirectURL,
    });

    try {
      const response = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          body: payload,
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      return AccessTokenSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AuthClientError(
          "Validation error: Error while parsing AccessToken data"
        );
      }
      throw new AuthClientError("Error while fetching access token");
    }
  };

  getUser = async (tokenData: { token_type: string; access_token: string }) => {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
        },
      });
      const data = await response.json();
      return UserSchema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AuthClientError(
          "Validation error: Error while parsing User data"
        );
      }
      throw new AuthClientError("Error while fetching access token");
    }
  };
}

export class AuthClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthClientError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
