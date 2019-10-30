import * as React from 'react';
import { _poly } from './transform';

export const evalCode = (code: string, scope: Record<string, any>) => {
  const scopeKeys = Object.keys(scope);
  const scopeValues = scopeKeys.map(key => scope[key]);
  // eslint-disable-next-line no-new-func
  const res = new Function('_poly', 'React', ...scopeKeys, code);
  return res(_poly, React, ...scopeValues);
};
