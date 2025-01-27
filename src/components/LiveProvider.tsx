import * as React from 'react';

import { LiveContext } from './LiveContext';
import {
  renderElementAsync,
  TranspileFn,
  GetScopeFn,
} from '../utils/transpile';
import { Language, PrismTheme } from 'prism-react-renderer';
import { ErrorBoundary } from '../hoc/withErrorBoundary';

export interface LiveProviderProps {
  code: string;
  disabled?: boolean;
  language?: Language;
  scope?: Record<string, any>;
  theme?: PrismTheme;
  transpile: TranspileFn;
  getScope: GetScopeFn;
}

interface LiveProviderState {
  element?: ErrorBoundary | null;
  error?: any;
  unsafeWrapperError?: any;
}

interface TranspileOptions {
  code: string;
  scope?: Record<string, any>;
  transpile: TranspileFn;
  getScope: GetScopeFn;
}

export class LiveProvider extends React.Component<
  LiveProviderProps,
  LiveProviderState
> {
  static defaultProps = {
    code: '',
    language: 'jsx',
    disabled: false,
  };

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { code, scope, transpile, getScope } = this.props;

    this.transpile({ code, scope, transpile, getScope });
  }

  componentDidUpdate({
    code: prevCode,
    scope: prevScope,
    transpile: prevTranspile,
  }: LiveProviderProps) {
    const { code, scope, transpile, getScope } = this.props;
    if (
      code !== prevCode ||
      scope !== prevScope ||
      transpile !== prevTranspile
    ) {
      this.transpile({ code, scope, transpile, getScope });
    }
  }

  onChange = (code: string): void => {
    const { scope, transpile, getScope } = this.props;
    this.transpile({ code, scope, transpile, getScope });
  };

  onError = (error: any): void => {
    this.setState({ error: error.toString() });
  };

  transpile = (options: TranspileOptions) => {
    const { code, transpile, getScope } = options;

    const errorCallback = (err: any) =>
      this.setState({ element: undefined, error: err.toString() });

    const renderElement = (element: ErrorBoundary) =>
      this.setState({ ...state, element });

    // State reset object
    const state = { unsafeWrapperError: undefined, error: undefined };

    try {
      this.setState({ ...state, element: null }); // Reset output for async (no inline) evaluation
      renderElementAsync(
        code,
        transpile,
        getScope,
        renderElement,
        errorCallback
      );
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
