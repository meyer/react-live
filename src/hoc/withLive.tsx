import * as React from 'react';
import { LiveContext } from '../components/LiveContext';

export const withLive = <T extends any>(
  wrappedComponent: React.ComponentType<T>
): React.FC<T> => {
  const WithLive: React.FC<T> = props => (
    <LiveContext.Consumer>
      {live => React.createElement(wrappedComponent, { live, ...props })}
    </LiveContext.Consumer>
  );

  if (process.env.NODE_ENV === 'development') {
    const displayName = wrappedComponent.displayName || 'WrappedComponent';
    WithLive.displayName = `withLive(${displayName})`;
  }

  return WithLive;
};
