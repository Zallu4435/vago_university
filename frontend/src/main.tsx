import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./presentation/redux/store";
import App from "./App";

// React Query setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Toast notification setup
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <App />
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
  // </React.StrictMode>
);



