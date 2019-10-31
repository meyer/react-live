import {
  withErrorBoundary,
  ElementOrComponent,
} from '../hoc/withErrorBoundary';
import * as React from 'react';

export type TranspileFn = (code: string) => Promise<string>;

export const evalCode = (code: string, scope: Record<string, any>): any => {
  const scopeKeys = Object.keys(scope);
  const scopeValues = scopeKeys.map(key => scope[key]);
  // eslint-disable-next-line no-new-func
  const res = new Function('React', ...scopeKeys, code);
  return res(React, ...scopeValues);
};

export interface RenderElementAsyncParams {
  code: string;
  scope?: Record<string, any>;
}

export const renderElementAsync = (
  params: RenderElementAsyncParams,
  transpile: TranspileFn,
  resultCallback: (result: any) => void,
  errorCallback: (err: any) => void
) => {
  const { code = '', scope = {} } = params;

  const render = (element: ElementOrComponent) => {
    if (typeof element === 'undefined') {
      errorCallback(new SyntaxError('`render` must be called with valid JSX.'));
    } else {
      resultCallback(withErrorBoundary(element, errorCallback));
    }
  };

  if (!/render\s*\(/.test(code)) {
    return errorCallback(
      new SyntaxError('No-Inline evaluations must call `render`.')
    );
  }

  transpile(code)
    .then(transpiledCode => evalCode(transpiledCode, { ...scope, render }))
    .catch(errorCallback);
};
