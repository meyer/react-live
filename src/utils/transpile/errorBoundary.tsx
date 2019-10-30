import * as React from 'react';

export type ElementOrComponent = React.FC | React.ReactElement;

export type ErrorBoundary = ReturnType<typeof errorBoundary>;

export const errorBoundary = (
  elementOrComponent: ElementOrComponent,
  errorCallback: (err: any) => void
) => {
  return class ErrorBoundary extends React.Component {
    componentDidCatch(error: any) {
      errorCallback(error);
    }

    render() {
      return React.isValidElement(elementOrComponent)
        ? elementOrComponent
        : React.createElement(elementOrComponent);
    }
  };
};
