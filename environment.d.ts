export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEON_DB_URL: string,
      COOKIE_NAME: string,
      REFRESH_COKIE_NAME: string,
      SECRET_KEY: string,
      SERVICE_ACCOUNT: string;
      FOLDER_POST: string;
      FOLDER_AVATAR: string;
      FOLDER_BANNER: string;
    }
  }
}