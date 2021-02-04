import './App.css';
import { PlainEditor, DDFWizardEditor, } from './EditDescriptions';

function App() {
  return (
    <div className="App">
      <PlainEditor
      onCancel={() => console.log('cancel')} onSave={(s, f) => console.log('submit', s, f)}
      />
      <DDFWizardEditor
      onCancel={() => console.log('cancel')} onSave={(s, f) => console.log('submit', s, f)}
      />
    </div>
  );
}

export default App;
