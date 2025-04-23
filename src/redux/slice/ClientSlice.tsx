/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState } from "../Store"
import {
  fetchClientsAPI,
  fetchArchivedClientsAPI,
  createClientAPI,
  updateClientAPI,
  archiveClientAPI,
  restoreClientAPI,
  deleteClientAPI,
} from "@/service/clientApi"
import { Client } from "@/types/Client"

interface ClientState {
  clients: Client[]
  archivedClients: Client[]
  loading: boolean
  error: string | null
}

// Define filter parameters interface
export interface ClientFilters {
  name?: string
  email?: string
  industry?: string
}

const initialState: ClientState = {
  clients: [],
  archivedClients: [],
  loading: false,
  error: null,
}

// Async thunks
// Updated fetchClients to accept filter parameters
export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
  async (filters: ClientFilters | undefined, { rejectWithValue }) => {
    try {
      const response: any = await fetchClientsAPI(filters)
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to fetch clients")
      }
      const clients: Client[] = response.data?.clients || response.data || []
      return clients
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "Failed to fetch clients")
    }
  },
)
export const fetchArchivedClients = createAsyncThunk(
  "clients/fetchArchivedClients",
  async (filters: ClientFilters | undefined, { rejectWithValue }) => {
    try {
      const response: any = await fetchArchivedClientsAPI(filters)
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to fetch archived clients")
      }
      const clients: Client[] = response.data?.clients || response.data || []
      return clients
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "Failed to fetch clients")
    }
  },
)

export const createClient = createAsyncThunk(
  "clients/createClient",
  async (clientData: Omit<Client, "id" | "status" | "projects">, { rejectWithValue }) => {
    try {
      const response = await createClientAPI(clientData)
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to create client")
      }
      return response.data as Client
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create client")
    }
  },
)

export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async (clientData: Client, { rejectWithValue }) => {
    try {
      const response = await updateClientAPI(clientData)
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to update client")
      }
      return response.data as Client
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update client")
    }
  },
)

export const archiveClient = createAsyncThunk(
  "clients/archiveClient",
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await archiveClientAPI(clientId)
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to archive client")
      }
      return clientId
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to archive client")
    }
  },
)

export const restoreClient = createAsyncThunk(
  "clients/restoreClient",
  async (clientId: string, { rejectWithValue }) => {
    try {
      const response = await restoreClientAPI(clientId)
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to restore client")
      }
      return clientId
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to restore client")
    }
  },
)

export const deleteClient = createAsyncThunk("clients/deleteClient", async (clientId: string, { rejectWithValue }) => {
  try {
    const response = await deleteClientAPI(clientId)
    if (!response.success) {
      return rejectWithValue(response.error || "Failed to delete client")
    }
    return clientId
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete client")
  }
})

const clientSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchClients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false
        const clients = action.payload || []
        state.clients = clients.filter((client: Client) => client.status === "active")
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // fetchArchivedClients
      .addCase(fetchArchivedClients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArchivedClients.fulfilled, (state, action) => {
        state.loading = false
        state.archivedClients = action.payload
      })
      .addCase(fetchArchivedClients.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // createClient
      .addCase(createClient.fulfilled, (state, action) => {
        if (action.payload) {
          state.clients.push(action.payload)
        }
      })

      // updateClient
      .addCase(updateClient.fulfilled, (state, action) => {
        if (!action.payload) return

        const updatedClient = action.payload
        if (updatedClient.status === "active") {
          const index = state.clients.findIndex((client) => client.id === updatedClient.id)
          if (index !== -1) {
            state.clients[index] = updatedClient
          }
        } else {
          const index = state.archivedClients.findIndex((client) => client.id === updatedClient.id)
          if (index !== -1) {
            state.archivedClients[index] = updatedClient
          }
        }
      })

      // archiveClient
      .addCase(archiveClient.fulfilled, (state, action) => {
        const clientId = action.payload
        const clientToArchive = state.clients.find((client) => client.id === clientId)
        if (clientToArchive) {
          state.clients = state.clients.filter((client) => client.id !== clientId)
          state.archivedClients.push({ ...clientToArchive, status: "archived" })
        }
      })

      // restoreClient
      .addCase(restoreClient.fulfilled, (state, action) => {
        const clientId = action.payload
        const clientToRestore = state.archivedClients.find((client) => client.id === clientId)
        if (clientToRestore) {
          state.archivedClients = state.archivedClients.filter((client) => client.id !== clientId)
          state.clients.push({ ...clientToRestore, status: "active" })
        }
      })

      // deleteClient
      .addCase(deleteClient.fulfilled, (state, action) => {
        const clientId = action.payload
        state.archivedClients = state.archivedClients.filter((client) => client.id !== clientId)
      })
  },
})

// Selectors
export const selectClients = (state: RootState) => state.clients.clients
export const selectArchivedClients = (state: RootState) => state.clients.archivedClients
export const selectClientsLoading = (state: RootState) => state.clients.loading
export const selectClientsError = (state: RootState) => state.clients.error

export default clientSlice.reducer
