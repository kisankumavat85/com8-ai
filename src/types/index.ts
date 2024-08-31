export type GitHubUser = {
  id: number;
  login: string;
  email: string;
  name: string;
  image: string;
};

export type GitHubUserEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};
