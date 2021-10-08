import React from 'react';
import { render } from '@testing-library/react';
import { Button } from './Button';

it("renders button with the right class", () => {
    const { getByTestId } = render(<Button data-testid="button-to-test" />);
    expect(getByTestId("button-to-test").classList).toContain("btn");
});

it("renders full button with the right class", () => {
    const { getByTestId } = render(<Button fullWidth data-testid="button-to-test" />);
    expect(getByTestId("button-to-test").classList).toContain("btn-full");
});

