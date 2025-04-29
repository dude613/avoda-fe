/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, act } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import Header from "@/components/Header"
import userProfileReducer from "@/redux/slice/UserProfile"
import type { RootState } from "@/redux/Store"
import type { UserProfile } from "@/type"
import { describe, it, expect, vi, beforeEach } from "vitest"
import axios from "axios"

// Mock axios globally for this test file
vi.mock("axios")
const mockedAxios = vi.mocked(axios, true)

// Create a mock store for testing using the actual reducer
const createMockStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      userProfile: userProfileReducer as any,
      organization: (state = { teamMembers: [], loading: false, error: null }) => state,
      timer: (
        state = {
          activeTimer: null,
          timerHistory: [],
          loading: false,
          historyLoading: false,
          error: null,
          totalPages: 1,
          currentPage: 1,
        },
      ) => state,
      clients: (
        state = {
          clients: [],
          archivedClients: [],
          loading: false,
          error: null,
        },
      ) => state,
      project: (state = { projects: [], loading: false, error: null }) => state,
      clientAssignments: (state = { assignments: [], loading: false, error: null }) => state,
      tasks: (state = { tasks: [], loading: false, error: null }) => state,
    },
    preloadedState,
  });
};

describe("Header component", () => {
  // Reset mocks before each test in this suite
  beforeEach(() => {
    vi.restoreAllMocks()
    mockedAxios.get.mockReset()
  })

  it("should render the application name when not logged in", () => {
    const store = createMockStore()

    render(
      <Provider store={store}>
        <Router>
          <Header />
        </Router>
      </Provider>,
    )

    expect(screen.getByText("avoda")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Register/i })).toBeInTheDocument()
  })

  it("should render the user avatar button when logged in", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "accessToken") return "fake-token"
      if (key === "userId") return "fake-user-id"
      return null
    })

    // Include the timer state in the preloaded state
    const store = createMockStore({
      userProfile: {
        userProfile: {
          data: {
            userName: "TestUser",
            email: "test@example.com",
            picture: "",
            verified: "true",
            role: "user",
          },
        },
        loading: false,
        error: null,
      },
      organization: {
        teamMembers: [],
        loading: false,
        error: null,
      },
      timer: {
        activeTimer: null,
        timerHistory: [],
        loading: false,
        historyLoading: false,
        error: null,
        totalPages: 1,
        currentPage: 1,
      },
    })

    mockedAxios.get.mockResolvedValue({
      data: {
        userName: "TestUser",
        email: "test@example.com",
        picture: "",
        verified: "true",
        role: "user",
      } as UserProfile["data"],
    })

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <Header />
          </Router>
        </Provider>,
      )
    })

    expect(screen.getByText("avoda")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Open profile/i })).toBeInTheDocument()
  })
})
