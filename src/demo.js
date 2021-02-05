import React, { useRef, useState } from "react";
import FormRenderer, { componentTypes } from "@data-driven-forms/react-form-renderer";
import { componentMapper } from "@data-driven-forms/mui-component-mapper";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MUIRichTextEditor from 'mui-rte';
import { RTEtoHtml, htmlToRTE, HtmlEditor } from './rte';

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
              marginBottom: 50,
              paddingLeft: '5px',
              paddingRight: '5px'
          }
      }
  }
})

export function PlainEditor({ onCancel, onSave, initialValue='' }) {

  const [html, setHtml] = useState(initialValue);

  const ref = useRef(null);

  const handleBlur = () => {
    ref.current.save();
  }

  const handleSave = (data) => {
    setHtml(RTEtoHtml(data));
  }

  return (
    <Grid container>
      <Grid item xs={6}>
      <Typography variant="h5">Plain Editor</Typography>
      </Grid>
      <Grid item xs={12}>
      <MuiThemeProvider theme={defaultTheme}>
        <MUIRichTextEditor
          controls={["title", "bold", "italic", "numberList", "bulletList", "link" ]}
          label="Start typing..."
          name='full_description'
          onBlur={handleBlur}
          onSave={handleSave}
          defaultValue={htmlToRTE(initialValue)}
          ref={ref}
        />
      </MuiThemeProvider>
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" color="primary" onClick={onCancel}>Cancel</Button>
        <Button variant="outlined" color="primary" 
          onClick={() => onSave(html)}
        >Submit</Button>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6">Form Value</Typography>
        <Typography>{html}</Typography>
      </Grid>
    </Grid>
  );
}

export function DDFWizardEditor({ onCancel, onSave, initialValue='' }) {

  const handleSubmit = (values) => {
    onSave(values.description);
  }

  const FormTemplate = ({schema, formFields}) => {
    return (
      <>
        { schema.title }
        { formFields }
      </>
    )
  }

  const schema = {
    fields: [      
      {
        component: componentTypes.WIZARD,
        name: "richtext",
        fields: [
          {
            name: "main-step",
            fields: [
              { 
                component: 'html',
                title: "Wizard Wrapped Editor",
                name: "description",
                controls: ["title", "bold", "italic", "numberList", "bulletList", "link" ],
              }                
            ],
          },
        ],
      },
      {
        component: componentTypes.TEXTAREA,
        name: 'description',
        label: 'Form Value',
        isReadOnly: true
      }
    ],
  };

  return (<MuiThemeProvider theme={defaultTheme}>
    <FormRenderer
       schema={schema}
       componentMapper={
         { 
           ...componentMapper,
           html: HtmlEditor,
         }
       }
       initialValues={{description: initialValue}}
       FormTemplate={FormTemplate}
       onCancel={onCancel}
       onSubmit={handleSubmit}
     />
     </MuiThemeProvider>);
   }
   