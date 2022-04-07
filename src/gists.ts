import { showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { Octokit } from "octokit";
import { GraphQlQueryResponseData, GraphqlResponseError } from "@octokit/graphql";
import { getGithubAccessToken } from "./utils";

interface GistFileLanguage {
  name: string;
}

export interface GistFile {
  id: string;
  name: string;
  text: string;
  language: GistFileLanguage;
}

export interface Gist {
  createdAt: string;
  description: string;
  url: string;
  id: string;
  isPublic: boolean;
  name: string;
  files: GistFile[];
}

export enum GistScope {
  Public = "public",
  Private = "private",
}

interface CreateGistParams {
  description: string | undefined;
  filename: string;
  text: string;
  scope: GistScope;
}

interface CreateGistResult {
  url: string;
}

export const createGist = async (params: CreateGistParams): Promise<CreateGistResult> => {
  const accessToken = getGithubAccessToken();
  const octokit = new Octokit({ auth: accessToken });

  const response = await octokit.rest.gists.create({
    description: params.description,
    public: params.scope === GistScope.Public,
    files: {
      [params.filename]: { content: params.text },
    },
  });

  const url = response.data.html_url as string;

  return { url };
};

export const titleForGist = (gist: Gist): string => (gist.description ? gist.description : gist.files[0].name);

export const withGists = (): [Gist[], boolean, () => void] => {
  const [isLoading, setIsLoading] = useState(true);
  const [gists, setGists] = useState<Gist[]>([]);

  const accessToken = getGithubAccessToken();
  const octokit = new Octokit({ auth: accessToken });

  const loadGists = async () => {
    const loadingToast = await showToast({
      style: Toast.Style.Animated,
      title: "Loading gists...",
    });

    try {
      const response = await octokit.graphql<GraphQlQueryResponseData>(`
        query {
          viewer { 
            gists (first: 100, privacy: ALL, orderBy: {field: CREATED_AT, direction: DESC} ) {
              edges {
                node {
                  createdAt
                  description
                  id
                  isPublic
                  name
                  url
                  files {
                    name
                    language {
                      name
                    }
                    text
                  }
                }
              }
            }
          }
        }
      `);

      const gists: Gist[] = response.viewer.gists.edges.map((edge: { node: Gist }) => edge.node);

      setGists(gists);
      await loadingToast.hide();
      setIsLoading(false);
    } catch (error) {
      await loadingToast.hide();
      setIsLoading(false);

      if (error instanceof GraphqlResponseError) {
        const errorToast = await showToast({
          style: Toast.Style.Failure,
          title: "Gists could not be loaded",
          message: error.message,
        });

        setTimeout(() => {
          errorToast.hide();
        }, 5000);
      } else {
        const errorToast = await showToast({
          style: Toast.Style.Failure,
          title: "Gists could not be loaded",
          message: JSON.stringify(error),
        });

        setTimeout(() => {
          errorToast.hide();
        }, 5000);
      }
    }
  };

  useEffect(() => {
    (async () => {
      loadGists();
    })();
  }, []);

  return [gists, isLoading, loadGists];
};
