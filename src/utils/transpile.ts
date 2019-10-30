import {
  withErrorBoundary,
  ElementOrComponent,
} from '../hoc/withErrorBoundary';
import * as React from 'react';

export type TranspileFn = (code: string) => string;

export const evalCode = (code: string, scope: Record<string, any>): any => {
  const scopeKeys = Object.keys(scope);
  const scopeValues = scopeKeys.map(key => scope[key]);
  // eslint-disable-next-line no-new-func
  const res = new Function('React', ...scopeKeys, code);
  return res(React, ...scopeValues);
};

export const generateElement = (
  { code = '', scope = {} },
  transform: TranspileFn,
  errorCallback: (err: any) => void
) => {
  // NOTE: Remove trailing semicolon to get an actual expression.
  const codeTrimmed = code.trim().replace(/;$/, '');

  // NOTE: Workaround for classes and arrow functions.
  const transformed = transform(`return (${codeTrimmed})`).trim();
  return withErrorBoundary(evalCode(transformed, scope), errorCallback);
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
  // eslint-disable-next-line consistent-return
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

  evalCode(transpile(code), { ...scope, render });
};
