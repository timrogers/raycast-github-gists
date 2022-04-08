# GitHub Gists Raycast Extension

This [Raycast](https://raycast.com) extension allows you to work with you [GitHub Gists](https://gist.github.com) from Raycast in just a few keystrokes.

You can:

- Create a gist (with its URL copied to your clipboard!)
- Access your most recent gists, and copy the content or URL to your clipboard

At present, the extension is only compatible with GitHub.com. You won't be able to use it with GitHub Enterprise Cloud or GitHub Enterprise Server.

## Usage

You'll soon be able to install this extension from the [Raycast Store](https://www.raycast.com/store).

Until then, assuming that you have Node.js v16.x installed, you can run the extension locally by:

- cloning this repo
- running `npm install` to install the dependencies
- installing the extension with `npm run dev`

In order to use the extension's two commands - "Create Gist" and "View Recent Gists" - you will need to [create a GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the `gist` scope. Raycast will prompt you to do this when you try to use the extension.

## Contributing

The extension is built in Node.js using the [GitHub REST API](https://docs.github.com/en/rest) and the [GitHub GraphQL API](https://docs.github.com/en/graphql), accessed with the [Octokit.js](https://github.com/octokit/octokit.js) client library.

### Running locally

Clone this repo, run `npm install` and then run `npm run dev`.

The extension will be installed into Raycast, and any changes you make will be reflected in Raycast immediately.

### Linting

You can check the code style and formatting with `npx eslint .` and `npx prettier -c .` respectively. This will be run automatically by GitHub Actions when new code is pushed.
