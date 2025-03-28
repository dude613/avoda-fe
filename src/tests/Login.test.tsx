import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '../pages/Login';
import { titles } from '@/constants/Auth';
import { describe } from 'node:test';

const { LOGIN_PAGE_TITLE, LOGIN_PAGE_SUBTITLE } = titles;

describe('Login component', () => {
  it('should render login form with title and subtitle from Constants', () => {
    const { getByText } = render(
      <GoogleOAuthProvider clientId="test-client-id">
        <Router>
          <Login />
        </Router>
      </GoogleOAuthProvider>
    );

    expect(getByText(LOGIN_PAGE_TITLE)).toBeInTheDocument();
    expect(getByText(LOGIN_PAGE_SUBTITLE)).toBeInTheDocument();
  });
});
