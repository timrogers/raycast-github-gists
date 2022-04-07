import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { withGists, nameForGist } from './gists';

interface GistFileLanguage {
  name: string;
}

interface GistFile {
  id: string;
  name: string;
  text: string,
  language: GistFileLanguage;
}

interface Gist {
  createdAt: string;
  description: string;
  url: string;
  id: string;
  isPublic: boolean;
  name: string;
  files: GistFile[];
}

const GistFileList = (props: { gist: Gist }): JSX.Element => {
  const gist = props.gist;

  return (
    <List>
      {gist.files.map((file, fileIndex) => (
        <GistFileListItem key={file.name} gist={gist} file={file} fileIndex={fileIndex} />
      ))}
    </List>
  );
}

const GistFileDetail = (props: {file: GistFile, gist: Gist}): JSX.Element => {
  const gist = props.gist;
  const file = props.file;

  const markdown = `\`\`\`${file.language}\n${file.text}\n\`\`\``;

  return (<Detail 
            markdown={markdown}
            navigationTitle={file.name}
            actions={
              <ActionPanel>
                <Action.CopyToClipboard
                  title="Copy Content to Clipboard"
                  content={file.text}
                />
                <Action.CopyToClipboard
                  title="Copy URL to Clipboard"
                  content={gist.url}
                />
              </ActionPanel>
            }
          />)
}

const GistFileListItem = (props: { gist: Gist, file: GistFile, fileIndex: number }): JSX.Element => {
  const gist = props.gist;
  const file = props.file
  const fileIndex = props.fileIndex;

  return (
    <List.Item
      id={`${gist.id}-${fileIndex}`}
      icon="list-icon.png"
      title={file.name}
      key={gist.id}
      actions={
        <ActionPanel>
          <Action.Push
            title="View File"
            target={
              <GistFileDetail gist={gist} file={file} />
            }
          />
          <Action.CopyToClipboard
            title="Copy Content to Clipboard"
            content={file.text}
          />
          <Action.CopyToClipboard
            title="Copy URL to Clipboard"
            content={gist.url}
            shortcut={{
              key: 'c',
              modifiers: ['cmd', 'shift'],
            }}
          />
          <Action.OpenInBrowser
            url={gist.url}
            title="Open in Browser"
            shortcut={{
              key: 'o',
              modifiers: ['cmd'],
            }}
          />
        </ActionPanel>
      }
    />
  )
}

const GistListItem = (props: { gist: Gist, refreshGists: (() => void), }): JSX.Element => {
  const gist = props.gist;
  const refreshGists = props.refreshGists;
  
  if (gist.files.length == 1) {
    const [file] = gist.files;

    return (
      <List.Item
        id={gist.id}
        icon="list-icon.png"
        title={nameForGist(gist)}
        key={gist.id}
        subtitle={gist.files.length > 1 ? `+${gist.files.length - 1} files` : undefined}
        accessories={[{ text: gist.isPublic ? 'Public' : 'Private'}]}
        actions={
          <ActionPanel>
            <Action.Push
              title="View File"
              target={
                <GistFileDetail gist={gist} file={file} />
              }
            />
            <Action.CopyToClipboard
              title="Copy Content to Clipboard"
              content={file.text}
            />
            <Action.CopyToClipboard
              title="Copy URL to Clipboard"
              content={gist.url}
              shortcut={{
                key: 'c',
                modifiers: ['cmd', 'shift'],
              }}
            />
            <Action.OpenInBrowser
              url={gist.url}
              title="Open in Browser" 
              shortcut={{
                key: 'o',
                modifiers: ['cmd'],
              }}
            />
            <Action
              title="Refresh"
              onAction={() => refreshGists}
              shortcut={{
                key: 'r',
                modifiers: ['cmd'],
              }}
            />
          </ActionPanel>
        }
    />)
  } else {
    const file = gist.files[0];

    return (
      <List.Item
        id={gist.id}
        icon="list-icon.png"
        title={file.name}
        key={gist.id}
        subtitle={`+${gist.files.length - 1} other files`}
        accessories={[{ text: gist.isPublic ? 'Public' : 'Private'}]}
        actions={
          <ActionPanel>
            <Action.Push
              title="View Files"
              target={
                <GistFileList gist={gist} />
              }
            />
            <Action.CopyToClipboard
              title="Copy URL to Clipboard"
              content={gist.url}
            />
            <Action.OpenInBrowser
              url={gist.url}
              title="Open in Browser"
              shortcut={{
                key: 'o',
                modifiers: ['cmd'],
              }}
            />
            <Action
              title="Refresh"
              onAction={() => refreshGists}
              shortcut={{
                key: 'r',
                modifiers: ['cmd'],
              }}
            />
          </ActionPanel>
        }
    />)
  };
}

export default function Command() {
  const [gists, isLoading, refreshGists] = withGists();

  return (
    <List isLoading={isLoading}>
      {gists.length === 0 ? (
        <List.EmptyView
          icon={{ source: "https://placekitten.com/500/500" }}
          title="Create your first gist at https://gist.github.com"
        />
      ) : (
        gists.map(gist => <GistListItem key={gist.id} gist={gist} refreshGists={refreshGists} />)
      )}
    </List>
  );
}
