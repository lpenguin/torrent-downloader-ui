export interface Config {
  apiRootUrl: string;
  username: string;
  password: string;
}

export const DEFAULT_CONFIG: Config = {
  apiRootUrl: '',
  username: '',
  password: '',
};
