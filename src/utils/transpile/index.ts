import { transform } from './transform';
import { errorBoundary, ElementOrComponent } from './errorBoundary';
import { evalCode } from './evalCode';

export const generateElement = (
  { code = '', scope = {} },
  errorCallback: (err: any) => void
) => {
  // NOTE: Remove trailing semicolon to get an actual expression.
  const codeTrimmed = code.trim().replace(/;$/, '');

  // NOTE: Workaround for classes and arrow functions.
  const transformed = transform(`return (${codeTrimmed})`).trim();
  return errorBoundary(evalCode(transformed, scope), errorCallback);
};

export interface RenderElementAsyncParams {
  code: string;
  scope?: Record<string, any>;
}

export const renderElementAsync = (
  params: RenderElementAsyncParams,
  resultCallback: (result: any) => void,
  errorCallback: (err: any) => void
  // eslint-disable-next-line consistent-return
) => {
  const { code = '', scope = {} } = params;

  const render = (element: ElementOrComponent) => {
    if (typeof element === 'undefined') {
      errorCallback(new SyntaxError('`render` must be called with valid JSX.'));
    } else {
      resultCallback(errorBoundary(element, errorCallback));
    }
  };

  if (!/render\s*\(/.test(code)) {
    return errorCallback(
      new SyntaxError('No-Inline evaluations must call `render`.')
    );
  }

  evalCode(transform(code), { ...scope, render });
};
