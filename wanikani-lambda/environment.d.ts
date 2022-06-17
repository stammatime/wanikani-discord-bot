declare global {
    namespace NodeJS {
      interface ProcessEnv {
        GITHUB_AUTH_TOKEN: string;
        PUBLIC_KEY: string;
        NODE_ENV: 'development' | 'production';
        BOT_TOKEN: string;
        APP_ID: string;
        GUILD_ID: string;
      }
    }
  }

  export {}