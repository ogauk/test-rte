import React, { useRef, useState } from "react";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import MUIRichTextEditor from 'mui-rte';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, ContentState, convertFromRaw, convertToRaw } from 'draft-js'
import { createMuiTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';

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

export function RTEtoHtml(data) {
  return stateToHTML(convertFromRaw(JSON.parse(data)));
}

export function htmlToRTE(html) {
  const contentHTML = convertFromHTML(html || '');
  const contentState = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
  return JSON.stringify(convertToRaw(contentState));
}

export const HtmlEditor = (props) => {

  const [blurry, setBlurry] = useState(false);

  const ref = useRef(null);
  const { input } = useFieldApi(props);

  const handleBlur = () => {
      setBlurry(true);
      ref.current.save();
  }

  const handleSave = (data) => {
      const html = RTEtoHtml(data);
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
