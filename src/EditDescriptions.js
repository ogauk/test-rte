import React, { useRef, useState, useEffect } from "react";
import FormRenderer, { componentTypes } from "@data-driven-forms/react-form-renderer";
import { componentMapper } from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import MUIRichTextEditor from 'mui-rte';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, ContentState, convertFromRaw, convertToRaw } from 'draft-js'

const defaultTheme = createMuiTheme()

Object.assign(defaultTheme, {
  overrides: {
      MUIRichTextEditor: {
          root: {
            width: "100%"
          },
          toolbar: {
            borderTop: "1px solid gray",
            borderLeft: "1px solid gray",
            borderRight: "1px solid gray",
            backgroundColor: "whitesmoke"
          },
          editor: {
              border: "1px solid gray",
              marginBottom: 10,
              paddingLeft: '5px',
              paddingRight: '5px'
          }
      }
  }
})

function RTEtoHtml(data) {
  return stateToHTML(convertFromRaw(JSON.parse(data)));
}

function htmlToRTE(html) {
  const contentHTML = convertFromHTML(html || '');
  const contentState = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
  return JSON.stringify(convertToRaw(contentState));
}


export function PlainEditor({ onCancel, onSave, short='', full='' }) {

  const [state, setState] = useState({ short, full, saving: 'no' });
  const shortRef = useRef(null);
  const fullRef = useRef(null);

  useEffect(() => {
    switch (state.saving) {
    case 'short':
      fullRef.current.save();
      break;
    case 'full':
      setState({ ...state, saving: 'no' });
      onSave(state.short, state.full);
      break;
    default:
      // console.log('effect do nothing');
    }
  }, [state, onSave]);

  const handleSaveShort = (rte) => {
    const short = RTEtoHtml(rte)
    setState({ ...state, short, saving: 'short' });
  };

  const handleSaveFull = (rte) => {
    const full = RTEtoHtml(rte)
    setState({ ...state, full, saving: 'full' });
  };

  const handleSave = () => {
    shortRef.current.save();
  }

  return (
    <Paper>
      <Typography variant="h5">Plain Editor</Typography>
      <Typography variant="h6">Short description</Typography>
      <MuiThemeProvider theme={defaultTheme}>
        <MUIRichTextEditor
          controls={["bold", "italic"]}
          label="Start typing..."
          name='short_description'
          onSave={handleSaveShort}
          defaultValue={htmlToRTE(state.short)}
          maxLength="500"
          ref={shortRef}
        />
      </MuiThemeProvider>
      <Typography variant="h6">Full description</Typography>
      <MuiThemeProvider theme={defaultTheme}>
        <MUIRichTextEditor
          controls={["title", "bold", "italic", "numberList", "bulletList", "link" ]}
          label="Start typing..."
          name='full_description'
          onSave={handleSaveFull}
          defaultValue={htmlToRTE(state.full)}
          ref={fullRef}
        />
      </MuiThemeProvider>
      <Button variant="outlined" color="primary" onClick={onCancel}>Cancel</Button>
      <Button variant="outlined" color="primary" onClick={handleSave}>Send</Button>
    </Paper>
  );
}

const HtmlEditor = (props) => {

  const [blurry, setBlurry] = useState(false);

  const ref = useRef(null);
  const { input } = useFieldApi(props);

  const handleBlur = () => {
      setBlurry(true);
      ref.current.save();
  }

  const handleSave = (data) => {
      const html = stateToHTML(convertFromRaw(JSON.parse(data)));
      if(blurry) {
        setBlurry(false);          
        input.onChange(html);  
      } else {
        input.onChange(html);  
      }
  }

  return (<>
    <Typography>{props.title}</Typography>
    <MUIRichTextEditor
    label='type some text'
    controls={props.controls}
    onSave={handleSave}
    defaultValue={htmlToRTE(input.value)}
    onBlur={handleBlur}
    ref={ref}
    />
    </>);
}

const schema = {
  fields: [
    {
      component: componentTypes.WIZARD,
      name: "boat",
      fields: [
        {
          name: "descriptions-step",
          fields: [
            { 
              title: "Wizard Wrapped Editor",
              name: "descriptions",
              component: componentTypes.SUB_FORM,
              "fields": [
                {
                  component: 'html',
                  title: "Short description",        
                  name: "short_description",
                  controls: ["bold", "italic"],
                  maxLength: 500,
                },
                {
                  component: 'html',
                  title: "Full description",        
                  name: "full_description",
                  controls: ["title", "bold", "italic", "numberList", "bulletList", "link" ],
                },
              ]
            }                
          ],
        },
      ],
    },
  ],
};

export function DDFWizardEditor({ onCancel, onSave, short='', full='' }) {

  const handleSubmit = (values) => {
    onSave(values.short_description, values.full_description);
  }

  const FormTemplate = ({schema, formFields}) => {
    return (
      <>
        { schema.title }
        { formFields }
      </>
    )
  }

  return (<MuiThemeProvider theme={defaultTheme}>
    <FormRenderer
       schema={schema}
       componentMapper={
         { 
           ...componentMapper,
           html: HtmlEditor,
         }
       }
       FormTemplate={FormTemplate}
       onCancel={onCancel}
       onSubmit={handleSubmit}
     />
     </MuiThemeProvider>);
   }
   