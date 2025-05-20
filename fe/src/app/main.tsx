import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../shared/styles/index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true }); // 최신 PWA 등록 방식

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="895021191714-fh66qamfbsvr5kfglnelm4ooahe7lnil.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
