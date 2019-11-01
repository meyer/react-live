import * as React from 'react';
import {
  withErrorBoundary,
  ElementOrComponent,
} from '../hoc/withErrorBoundary';

export interface ImportSpecifier {
  type: 'ImportSpecifier';
  source: string;
  local: string;
  imported: string;
}

export interface ImportDefaultSpecifier {
  type: 'ImportDefaultSpecifier';
  source: string;
  local: string;
}

export interface ImportNamespaceSpecifier {
  type: 'ImportNamespaceSpecifier';
  source: string;
  local: string;
}

export interface TranspileResult {
  code: string;
  imports: Array<
    ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
  >;
}

export type TranspileFn = (code: string) => Promise<TranspileResult>;

export type GetScopeFn = (res: TranspileResult) => Promise<Record<string, any>>;

export const evalCode = (code: string, scope: Record<string, any>): any => {
  const scopeKeys = Object.keys(scope);
  const scopeValues = scopeKeys.map(key => scope[key]);
  // eslint-disable-next-line no-new-func
  const res = new Function('React', ...scopeKeys, code);
  return res(React, ...scopeValues);
};

export const renderElementAsync = (
  code: string,
  transpile: TranspileFn,
  getScope: GetScopeFn,
  resultCallback: (result: any) => void,
  errorCallback: (err: any) => void
) => {
  const render = (element: ElementOrComponent) => {
    if (typeof element === 'undefined') {
      errorCallback(new SyntaxError('`render` must be called with valid JSX.'));
    } else {
      resultCallback(withErrorBoundary(element, errorCallback));
    }
  };

  transpile(code)
    .then(transpiledCode => {
      return getScope(transpiledCode).then(scope => {
        return evalCode(transpiledCode.code, {
          ...scope,
          transpiledCode,
          render,
        });
      });
    })
    .catch(errorCallback);
};
