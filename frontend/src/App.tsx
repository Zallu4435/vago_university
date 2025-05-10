import React from "react";
import { Provider } from "react-redux";
import store from './presentation/redux/store';
import './index.css';
import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from './presentation/Layout/PublicLayout';
import UGLayout from './presentation/Layout/UGLayout';
import LoginPage from "./presentation/pages/Auth/Login";
import { ApplicationForm } from "./presentation/pages/ApplicationForm";

  

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Routes>
        {/* Each layout handles its own internal routes */}
        <Route path="/*" element={<PublicLayout />} />
        <Route path="/ug/*" element={<UGLayout />} />

        {/* Independent full-page routes (if outside PublicLayout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admission" element={<ApplicationForm />} />
      </Routes>
    </Provider>
  );
};

export default App;
