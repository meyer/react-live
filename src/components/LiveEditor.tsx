import * as React from 'react';
import { LiveContext } from './LiveContext';
import { CodeEditor, CodeEditorProps } from './CodeEditor';

export type LiveEditorProps = CodeEditorProps;

export const LiveEditor: React.FC<LiveEditorProps> = props => (
  <LiveContext.Consumer>
    {({ code, language, theme, disabled, onChange }) => (
      <CodeEditor
        theme={theme}
        code={code}
        language={language}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />
    )}
  </LiveContext.Consumer>
);
