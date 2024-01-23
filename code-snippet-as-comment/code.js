const AUTHORIZED_USER_ID = "";

figma.showUI(__html__, { width: 400, height: 500 });

const isCurrentUserAuthorized = false;
figma.ui.postMessage({
  type: "user-authorization",
  isAuthorized: isCurrentUserAuthorized,
});

figma.ui.onmessage = (msg) => {
  if (msg.type === "save-snippet") {
    const nodes = figma.currentPage.selection;

    if (nodes.length === 0) {
      figma.notify("Please select a layer to attach the code snippet to.");
      return;
    }

    const node = nodes[0];
    node.setPluginData("code-snippet", msg.codeSnippet);

    if (!node.name.startsWith("[📜] ")) {
      node.name = "[📜] " + node.name;
    }

    figma.notify("Code snippet saved to layer!");
  }

  if (msg.type === "snippet-copied") {
    figma.notify("Code snippet copied to clipboard!");
  }

  if (msg.type === "remove-snippet") {
    const nodes = figma.currentPage.selection;

    if (nodes.length === 0) {
      figma.notify("Please select a node to remove the snippet from.");
      return;
    }

    const node = nodes[0];
    node.setPluginData("code-snippet", "");

    if (node.name.startsWith("[📜] ")) {
      node.name = node.name.replace("[📜] ", "");
    }

    figma.closePlugin();
  }
};

const selectedNodes = figma.currentPage.selection;
if (selectedNodes.length > 0) {
  const savedSnippet = selectedNodes[0].getPluginData("code-snippet");
  if (savedSnippet) {
    if (isCurrentUserAuthorized) {
      figma.ui.postMessage({
        type: "display-snippet-textarea",
        codeSnippet: savedSnippet,
      });
    } else {
      figma.ui.postMessage({
        type: "display-snippet-formatted",
        codeSnippet: savedSnippet,
      });
    }
  }
}
