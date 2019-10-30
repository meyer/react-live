import * as React from 'react';
import { LiveContext } from './LiveContext';

export interface LivePreviewProps {
  component: React.ComponentType<any> | keyof JSX.IntrinsicElements;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  component,
  ...rest
}) =>
  React.createElement(
    component,
    rest,
    <LiveContext.Consumer>
      {({ element: Element }) => Element && <Element />}
    </LiveContext.Consumer>
  );

LivePreview.defaultProps = {
  component: 'div',
};
