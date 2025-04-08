import { render, screen, act } from '@testing-library/react'; // Import act
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from '@/components/Header'; // Adjust path if necessary
import userProfileReducer from '@/redux/slice/UserProfile'; // Import the actual reducer
import type { RootState } from '@/redux/Store'; // Import RootState type
import type { UserProfile } from '@/type'; // Import UserProfile type for mocking
import { describe, it, expect, vi, beforeEach } from 'vitest'; // Added beforeEach
import axios from 'axios'; // Import axios to mock it

// Mock axios globally for this test file
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true); // Get the typed mock

// No need for mock reducer function or initial state definition here anymore

// Create a mock store for testing using the actual reducer
// preloadedState should match RootState structure if provided
const createMockStore = (preloadedState?: RootState) => { 
  // Add RootState generic type to configureStore
  return configureStore<RootState>({ 
    reducer: {
      userProfile: userProfileReducer, // Use the imported reducer
      // Add other actual reducers here if Header depends on them
      // Ensure the keys here match exactly those in your actual store config
      // Correct mock for organization state structure
      organization: (state = { teamMembers: [], loading: false, error: null }, action) => state, 
    },
    preloadedState, // preloadedState should match RootState structure
  });
};

// Mock localStorage
// Vitest automatically mocks localStorage/sessionStorage, but let's be explicit if needed
// Or ensure your component handles null values gracefully if localStorage is empty.
// For this test, we'll assume the component handles the case where accessToken is null.

describe('Header component', () => {
  // Reset mocks before each test in this suite
  beforeEach(() => {
      vi.restoreAllMocks(); // Clears localStorage mocks etc.
      mockedAxios.get.mockReset(); // Resets axios mock calls/implementations
  });

  it('should render the application name when not logged in', () => {
    const store = createMockStore(); // Create store with default empty state

    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>
    );

    // Check for the application name (using the value from constants)
    expect(screen.getByText('avoda')).toBeInTheDocument();

    // Optionally, check for Login/Register links when not logged in
    expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Register/i })).toBeInTheDocument();
  });

  // Make the test async to use await act
  it('should render the user avatar button when logged in', async () => { 
     // Mock localStorage for logged-in state
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'accessToken') return 'fake-token';
      if (key === 'userId') return 'fake-user-id';
      return null;
    });

    // Structure preloadedState according to RootState and UserProfileState
    // Ensure BOTH slices are present in preloadedState if providing it
    const store = createMockStore({
        userProfile: { // Key matches the slice name in the store config
            userProfile: { // Property within the UserProfileState
                // Assuming UserProfile type has these fields based on slice/component usage
                // Adjust if your UserProfile type is different
                // Ensure this structure matches UserProfile type exactly
                data: { 
                    // userId: 'fake-user-id', // Assuming userId is not part of UserProfile.data
                    userName: 'TestUser', 
                    email: 'test@example.com', 
                    picture: '', // Use empty string instead of undefined
                    verified: 'true', // Add mock value for verified
                    role: 'user', // Add mock value for role
                    // Add other required fields from UserProfile.data type with mock values
                }
            }, 
            loading: false, 
            error: null 
        },
        // Add default state for the organization slice as required by RootState
        organization: { 
            teamMembers: [], 
            loading: false, 
            error: null 
        } 
    });

    // Mock the axios call made by getUserProfile thunk
    // Provide a basic structure matching UserProfile type
    mockedAxios.get.mockResolvedValue({ 
        data: { 
            userName: 'TestUser', 
            email: 'test@example.com', 
            picture: '', 
            verified: 'true', 
            role: 'user',
        } as UserProfile['data'] // Cast to ensure type match
    });

    // Wrap the render call causing state updates in act
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <Header />
          </Router>
        </Provider>
      );
    });
    
    // Check for the application name again
    expect(screen.getByText('avoda')).toBeInTheDocument();

    // Check for the Avatar button (presence indicates logged-in state UI)
    // Using aria-label as defined in the component
    expect(screen.getByRole('button', { name: /Open profile/i })).toBeInTheDocument(); 

    // No need for manual cleanup here as beforeEach handles it
  });
});
