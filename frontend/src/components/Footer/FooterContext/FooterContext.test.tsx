import { FooterContextWrapper, useFooterContext } from './FooterContext';
import { waitFor, screen } from '@testing-library/react';
import { renderWithContext } from 'JestTest/utils';
import { useEffect } from 'react';

const mockUseLocationValue = {
  pathname: "/datasources/123/models",
  search: '',
  hash: '',
  state: null
}

jest.mock('react-router', () => ({
  ...jest.requireActual("react-router") as {},
  useLocation: jest.fn().mockImplementation(() => {
      return mockUseLocationValue as any;
  })
}));


describe('FooterContext', () => {
  it('ChildrenValueTest', async () => {
    renderWithContext(
      <FooterContextWrapper>
        <MockChildren />
      </FooterContextWrapper>
    );
    await waitFor(() => {
      const loadingValue = screen.getByTestId('childrenValue').textContent;
      expect(loadingValue).toBe('My Children');
    });
  });
});

const MockChildren = () => {
  const { children, setChildren } = useFooterContext();
  useEffect(() => {
    setChildren(<span>My Children</span>);
  }, []);

  return <p data-testid="childrenValue">{children}</p>;
};
