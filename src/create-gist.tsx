import { Form, Clipboard, ActionPanel, Action, showHUD, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { RequestError } from "@octokit/request-error";

import { createGist, GistScope } from "./gists";

export default function Command() {
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [text, setText] = useState<string | undefined>(undefined);
  const [scope, setScope] = useState<GistScope>(GistScope.Private);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const text = await Clipboard.readText();
      setText(text);

      await showToast({
        title: "Clipboard contents copied",
        style: Toast.Style.Success,
      });
    })();
  }, []);

  const submitForm = async () => {
    if (typeof text === "undefined") {
      await showToast({
        title: "You must add a body to your gist.",
        style: Toast.Style.Failure,
      });

      return;
    }

    if (typeof filename === "undefined") {
      await showToast({
        title: "You must provide a filename for your gist.",
        style: Toast.Style.Failure,
      });

      return;
    }

    const creatingToast = await showToast({
      style: Toast.Style.Animated,
      title: "Creating gist...",
    });

    setIsLoading(true);

    try {
      const { url } = await createGist({
        filename,
        description,
        text,
        scope,
      });

      await Clipboard.copy(url);

      await creatingToast.hide();

      await showHUD("Copied gist URL to clipboard");
    } catch (e) {
      await creatingToast.hide();
      setIsLoading(false);

      if (e instanceof RequestError) {
        await showToast({
          style: Toast.Style.Failure,
          title: `Unable to create gist: ${e.message}`,
        });
      } else {
        await showToast({
          style: Toast.Style.Failure,
          title: `Unable to create gist: ${JSON.stringify(e)}`,
        });
      }
    }
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Gist" onSubmit={submitForm} />
        </ActionPanel>
      }
      isLoading={isLoading}
    >
      <Form.TextField id="filename" title="Filename" value={filename} onChange={setFilename} placeholder="example.js" />
      <Form.TextArea id="text" title="Content" value={text} onChange={setText} />
      <Form.TextField
        id="description"
        title="Description"
        value={description}
        onChange={setDescription}
        placeholder="A pithy summary of what this file is"
      />
      <Form.Dropdown id="scope" value={scope} title="Visibility" onChange={(scope) => setScope(scope as GistScope)}>
        <Form.Dropdown.Item value={GistScope.Private} title="Private" />
        <Form.Dropdown.Item value={GistScope.Public} title="Public" />
      </Form.Dropdown>
      <Form.Description text="Your new gist's URL will be copied to the clipboard." />
    </Form>
  );
}
