import React, { useState } from "react";
import './App.css';
import { PlainEditor, DDFWizardEditor, } from './demo';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

function App() {
  const [plain, setPlain] = useState('');
  const [wiz, setWiz] = useState('');
  return (
    <div className="App">
      <Grid container rows>
        <Grid container>
          <Grid item>
            <PlainEditor
              initialValue={'some text'}
              onCancel={() => console.log('cancel')} 
              onSave={(data) => setPlain(data)}
              />
          </Grid>
          <Grid item>
            <Typography variant="h5">Submitted</Typography>
            {plain}
          </Grid>
        </Grid>
      </Grid>
      <Divider/>
      <Grid container>
        <Grid item>
          <DDFWizardEditor
          initialValue={'some text'}
          onCancel={() => console.log('cancel')} 
          onSave={(data) => setWiz(data)}
          />
        </Grid>
        <Grid item>
          <Typography variant="h5">Submitted</Typography>
          {wiz}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
