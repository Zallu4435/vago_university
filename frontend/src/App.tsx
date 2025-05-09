import React from "react";
import { Provider } from "react-redux";
// import { QueryClientProvider } from '@tanstack/react-query';
// import queryClient from './frameworks/query-client';
import store from './presentation/redux/store';
// import AppRouter from './frameworks/router';
import './index.css';
import { ApplicationForm } from "./presentation/pages/ApplicationForm";

const App: React.FC = () => {
  return (
    <Provider store={store}>
        <ApplicationForm />
        {/* <AppRouter /> */}
    </Provider>
  )
}

export default App;
