figma.showUI(__html__, { width: 240, height: 400 });

interface Message {
  type: string;
  mapping?: { [targetName: string]: string };
}

const renameLayers = (mapping: { [targetName: string]: string }): string[] => {
  const changes: string[] = [];

  const renameRecursive = (node: SceneNode) => {
    const trimmedName = node.name.trim();
    if (trimmedName in mapping) {
      node.name = mapping[trimmedName];
      changes.push(node.id);
    }
    if ('children' in node) {
      node.children.forEach((child) => {
        renameRecursive(child);
      });
    }
  };

  figma.currentPage.children.forEach((child) => {
    renameRecursive(child);
  });

  return changes;
};

figma.ui.onmessage = (msg: Message) => {
  if (msg.type === 'rename-layers') {
    const mapping = msg.mapping;
    const changes = renameLayers(mapping);

    figma.ui.postMessage({
      type: 'rename-layers',
      message: `🎉 Renamed ${changes.length} layers`,
    });
  }
};
