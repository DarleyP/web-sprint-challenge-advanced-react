import React from 'react';
import { render } from '@testing-library/react';
import AppFunctional from './AppFunctional';

describe('AppFunctional', () => {
  it('renders the UP, DOWN, RIGHT, and LEFT buttons', () => {
    const { queryByTestId } = render(<AppFunctional />);
    
    const upButton = queryByTestId('up');
    const downButton = queryByTestId('down');
    const rightButton = queryByTestId('right');
    const leftButton = queryByTestId('left');

    expect(upButton).toBeTruthy();
    expect(downButton).toBeTruthy();
    expect(rightButton).toBeTruthy();
    expect(leftButton).toBeTruthy();
  });
});




