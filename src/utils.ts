import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  githubAccessToken: string;
}

const getPreferences = (): Preferences => getPreferenceValues<Preferences>();

export const getGithubAccessToken = (): string => {
  const { githubAccessToken } = getPreferences();
  return githubAccessToken;
}