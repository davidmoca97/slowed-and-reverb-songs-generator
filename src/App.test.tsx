import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import * as MainView from './MainView/MainView';
import { isJSDocAugmentsTag } from 'typescript';

jest.spyOn(MainView, "MainView").mockImplementation(() => <div data-testid="main-view" />);

test('renders MainView', () => {
  const { queryByTestId } = render(<App />);
  expect(queryByTestId("main-view")).toBeTruthy();
});
