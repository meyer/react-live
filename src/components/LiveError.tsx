import * as React from 'react';
import { LiveContext } from './LiveContext';

export type LiveErrorProps = JSX.IntrinsicElements['pre'];

export const LiveError: React.FC<LiveErrorProps> = props => (
  <LiveContext.Consumer>
    {({ error }) => (error ? <pre {...props}>{error}</pre> : null)}
  </LiveContext.Consumer>
);
