declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCOUNTID: string;
      PASSWORD: string;
      NODE_ENV: 'test' | 'development' | 'production';
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
