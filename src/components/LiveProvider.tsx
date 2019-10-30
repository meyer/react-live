import * as React from 'react';

import { LiveContext } from './LiveContext';
import {
  generateElement,
  renderElementAsync,
  RenderElementAsyncParams,
} from '../utils/transpile';
import { Language, PrismTheme } from 'prism-react-renderer';
import { ErrorBoundary } from '../utils/transpile/errorBoundary';

export interface LiveProviderProps {
  code: string;
  disabled?: boolean;
  language?: Language;
  noInline?: boolean;
  scope?: Record<string, any>;
  theme?: PrismTheme;
  transformCode?: any;
}

interface LiveProviderState {
  element?: ErrorBoundary | null;
  error?: any;
  unsafeWrapperError?: any;
}

interface TranspileOptions {
  code: string;
  scope?: Record<string, any>;
  transformCode?: any;
  noInline?: boolean;
}

export class LiveProvider extends React.Component<
  LiveProviderProps,
  LiveProviderState
> {
  static defaultProps = {
    code: '',
    noInline: false,
    language: 'jsx',
    disabled: false,
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { code, scope, transformCode, noInline } = this.props;

    this.transpile({ code, scope, transformCode, noInline });
  }

  componentDidUpdate({
    code: prevCode,
    scope: prevScope,
    noInline: prevNoInline,
    transformCode: prevTransformCode,
  }: LiveProviderProps) {
    const { code, scope, noInline, transformCode } = this.props;
    if (
      code !== prevCode ||
      scope !== prevScope ||
      noInline !== prevNoInline ||
      transformCode !== prevTransformCode
    ) {
      this.transpile({ code, scope, transformCode, noInline });
    }
  }

  onChange = (code: string): void => {
    const { scope, transformCode, noInline } = this.props;
    this.transpile({ code, scope, transformCode, noInline });
  };

  onError = (error: any): void => {
    this.setState({ error: error.toString() });
  };

  transpile = (options: TranspileOptions) => {
    const { code, scope, transformCode, noInline = false } = options;

    // Transpilation arguments
    const input: RenderElementAsyncParams = {
      code: transformCode ? transformCode(code) : code,
      scope,
    };

    const errorCallback = (err: any) =>
      this.setState({ element: undefined, error: err.toString() });

    const renderElement = (element: ErrorBoundary) =>
      this.setState({ ...state, element });

    // State reset object
    const state = { unsafeWrapperError: undefined, error: undefined };

    try {
      if (noInline) {
        this.setState({ ...state, element: null }); // Reset output for async (no inline) evaluation
        renderElementAsync(input, renderElement, errorCallback);
      } else {
        renderElement(generateElement(input, errorCallback));
      }
    } catch (error) {
      this.setState({ ...state, error: error.toString() });
    }
  };

  render() {
    const { children, code, language, theme, disabled } = this.props;

    return (
      <LiveContext.Provider
        value={{
          ...this.state,
          code,
          language,
          theme,
          disabled,
          onError: this.onError,
          onChange: this.onChange,
        }}
      >
        {children}
      </LiveContext.Provider>
    );
  }
}
