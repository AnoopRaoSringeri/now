import { render } from '@testing-library/react';

import Sketch from './sketch';

describe('Sketch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Sketch />);
    expect(baseElement).toBeTruthy();
  });
});
