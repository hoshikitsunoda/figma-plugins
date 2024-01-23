import React, { useState } from 'react';
import '../styles/ui.css';

function App() {
  const [mapping, setMapping] = useState<{ [targetName: string]: string }>({});
  const [targetName, setTargetName] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleTargetNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetName(event.target.value);
  };

  const handleNewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };

  const handleAddMapping = () => {
    if (!targetName.trim() || !newName.trim()) {
      setMessage('⛔ Both Target Name and New Name must be provided.');
      return;
    }
    setMapping({
      ...mapping,
      [targetName]: newName,
    });
    setTargetName('');
    setNewName('');
    setMessage('');
  };

  const handleRemoveMapping = (target: string) => {
    const newMapping = { ...mapping };
    delete newMapping[target];
    setMapping(newMapping);
  };

  const handleRenameLayers = () => {
    parent.postMessage({ pluginMessage: { type: 'rename-layers', mapping } }, '*');
  };

  window.onmessage = (event) => {
    const message = event.data.pluginMessage;
    if (message && message.type === 'rename-layers') {
      setMessage(message.message);
      setMapping({});
    }
  };

  return (
    <div className="App">
      <h1>Rename Layers</h1>
      <div className="inputGroup">
        <label>
          Target Name:
          <input type="text" value={targetName} onChange={handleTargetNameChange} />
        </label>
      </div>
      <div className="inputGroup">
        <label>
          New Name:
          <input type="text" value={newName} onChange={handleNewNameChange} />
        </label>
      </div>
      <div>
        <button onClick={handleAddMapping}>Add Mapping</button>
      </div>
      {Object.keys(mapping).length > 0 && (
        <>
          <div>
            <h2>Current Mappings:</h2>
            <ul>
              {Object.entries(mapping).map(([target, newN]) => (
                <li key={target}>
                  {target} -&gt; {newN} <button onClick={() => handleRemoveMapping(target)}>x</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <button className="renameButton" onClick={handleRenameLayers}>
              Rename Layers
            </button>
          </div>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
