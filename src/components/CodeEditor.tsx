import * as React from 'react';
import Editor from 'react-simple-code-editor';
import Highlight, { Prism, Language, PrismTheme } from 'prism-react-renderer';
import { theme as liveTheme } from '../constants/theme';

export interface CodeEditorProps {
  code: string;
  disabled: boolean;
  language: Language;
  onChange: (newCode: string) => void;
  style: object;
  theme?: PrismTheme;
}

export class CodeEditor extends React.Component<CodeEditorProps> {
  state = {
    code: '',
  };

  static getDerivedStateFromProps(props: any, state: any) {
    if (props.code !== state.prevCodeProp) {
      return { code: props.code, prevCodeProp: props.code };
    }

    return null;
  }

  updateContent = (code: string): void => {
    this.setState({ code }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.code);
      }
    });
  };

  highlightCode = (code: string) => (
    <Highlight
      Prism={Prism}
      code={code}
      theme={this.props.theme || liveTheme}
      language={this.props.language}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </>
      )}
    </Highlight>
  );

  render() {
    // eslint-disable-next-line no-unused-vars
    const {
      style,
      code: _code,
      onChange,
      language,
      theme,
      ...rest
    } = this.props;
    const { code } = this.state;

    const baseTheme: React.CSSProperties =
      theme && typeof theme.plain === 'object' ? theme.plain : ({} as any);

    return (
      <Editor
        value={code}
        padding={10}
        highlight={this.highlightCode}
        onValueChange={this.updateContent}
        style={{
          whiteSpace: 'pre',
          fontFamily: 'monospace',
          ...baseTheme,
          ...style,
        }}
        {...rest}
      />
    );
  }
}
