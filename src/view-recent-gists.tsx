import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { Gist, GistFile, withGists, titleForGist } from "./gists";

// We only show the first N characters of a file in the view, as
// too much data tends to crash Raycast.
const FILE_MAX_DISPLAY_LENGTH = 10_000;

const GistFileList = (props: { gist: Gist }): JSX.Element => {
  const gist = props.gist;

  return (
    <List navigationTitle={titleForGist(gist)}>
      {gist.files.map((file, fileIndex) => (
        <GistFileListItem key={file.name} gist={gist} file={file} fileIndex={fileIndex} />
      ))}
    </List>
  );
};

const truncateText = (text: string, maxLength: number): [string, boolean] => {
  if (text.length <= maxLength) {
    return [text, false];
  } else {
    return [text.substring(0, maxLength), true];
  }
};

const GistFileDetail = (props: { file: GistFile; gist: Gist; navigationTitle?: string | undefined }): JSX.Element => {
  const gist = props.gist;
  const file = props.file;
  const navigationTitle = props.navigationTitle;

  const [text, isTruncated] = truncateText(file.text, FILE_MAX_DISPLAY_LENGTH);

  const markdown = `\`\`\`${file.language}\n${text}\n\`\`\`${isTruncated ? "\n\n *(truncated)*" : ""}`;

  return (
    <Detail
      markdown={markdown}
      navigationTitle={typeof navigationTitle === "undefined" ? file.name : navigationTitle}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Content to Clipboard" content={file.text} />
          <Action.CopyToClipboard title="Copy URL to Clipboard" content={gist.url} />
        </ActionPanel>
      }
    />
  );
};

const GistFileListItem = (props: { gist: Gist; file: GistFile; fileIndex: number }): JSX.Element => {
  const gist = props.gist;
  const file = props.file;
  const fileIndex = props.fileIndex;

  return (
    <List.Item
      id={`${gist.id}-${fileIndex}`}
      icon="list-icon.png"
      title={file.name}
      key={gist.id}
      actions={
        <ActionPanel>
          <Action.Push title="View File" target={<GistFileDetail gist={gist} file={file} />} />
          <Action.CopyToClipboard title="Copy Content to Clipboard" content={file.text} />
          <Action.CopyToClipboard
            title="Copy URL to Clipboard"
            content={gist.url}
            shortcut={{
              key: "c",
              modifiers: ["cmd", "shift"],
            }}
          />
          <Action.OpenInBrowser
            url={gist.url}
            title="Open in Browser"
            shortcut={{
              key: "o",
              modifiers: ["cmd"],
            }}
          />
        </ActionPanel>
      }
    />
  );
};

const GistListItem = (props: { gist: Gist; refreshGists: () => void }): JSX.Element => {
  const gist = props.gist;
  const refreshGists = props.refreshGists;

  if (gist.files.length == 1) {
    const [file] = gist.files;
    const title = titleForGist(gist);

    return (
      <List.Item
        id={gist.id}
        icon="list-icon.png"
        title={title}
        key={gist.id}
        accessories={[{ text: gist.isPublic ? "Public" : "Private" }]}
        actions={
          <ActionPanel>
            <Action.Push
              title="View File"
              target={<GistFileDetail gist={gist} file={file} navigationTitle={title} />}
            />
            <Action.CopyToClipboard title="Copy Content to Clipboard" content={file.text} />
            <Action.CopyToClipboard
              title="Copy URL to Clipboard"
              content={gist.url}
              shortcut={{
                key: "c",
                modifiers: ["cmd", "shift"],
              }}
            />
            <Action.OpenInBrowser
              url={gist.url}
              title="Open in Browser"
              shortcut={{
                key: "o",
                modifiers: ["cmd"],
              }}
            />
            <Action
              title="Refresh"
              onAction={() => refreshGists}
              shortcut={{
                key: "r",
                modifiers: ["cmd"],
              }}
            />
          </ActionPanel>
        }
      />
    );
  } else {
    return (
      <List.Item
        id={gist.id}
        icon="list-icon.png"
        title={titleForGist(gist)}
        key={gist.id}
        subtitle={`${gist.files.length} files`}
        accessories={[{ text: gist.isPublic ? "Public" : "Private" }]}
        actions={
          <ActionPanel>
            <Action.Push title="View Files" target={<GistFileList gist={gist} />} />
            <Action.CopyToClipboard title="Copy URL to Clipboard" content={gist.url} />
            <Action.OpenInBrowser
              url={gist.url}
              title="Open in Browser"
              shortcut={{
                key: "o",
                modifiers: ["cmd"],
              }}
            />
            <Action
              title="Refresh"
              onAction={() => refreshGists}
              shortcut={{
                key: "r",
                modifiers: ["cmd"],
              }}
            />
          </ActionPanel>
        }
      />
    );
  }
};

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
        gists.map((gist) => <GistListItem key={gist.id} gist={gist} refreshGists={refreshGists} />)
      )}
    </List>
  );
}
