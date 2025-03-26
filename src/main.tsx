import * as Sentry from "@sentry/react";
import { browserTracingIntegration, replayIntegration } from "@sentry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./redux/Store.tsx";
import { Provider } from "react-redux";


const env = import.meta.env.ENVIRONMENT || "development"

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    browserTracingIntegration(),
    replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    })
  ],
  // Tracing
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/avoda-fe\.vercel\.app\//],

  replaysSessionSampleRate: env === "development" ? 1.0 : 0.25,
  replaysOnErrorSampleRate: 1.0, //  Capture 100% of the errors
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <App />
      </Router>
    </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);
