import * as React from 'react';

export type ElementOrComponent = React.FC | React.ReactElement;

export type ErrorBoundary = ReturnType<typeof withErrorBoundary>;

export const withErrorBoundary = (
  elementOrComponent: ElementOrComponent,
  errorCallback: (err: any) => void
) => {
  return class ErrorBoundary extends React.Component {
    componentDidCatch(error: any) {
      errorCallback(error);
    }

    render() {
      return typeof elementOrComponent === 'number' ||
        React.isValidElement(elementOrComponent)
        ? elementOrComponent
        : React.createElement(elementOrComponent);
    }
  };
};
