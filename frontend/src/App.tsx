import React from "react";
import { Provider } from "react-redux";
import store from './presentation/redux/store';
import './index.css';
import PublicLayout from './presentation/Layout/PublicLayout';
import UGLayout from './presentation/Layout/UGLayout';
import { Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Routes>
        {/* Public routes */}
        <Route path="/*" element={<PublicLayout />} />

        {/* UG routes */}
        <Route path="/ug/*" element={<UGLayout />} />
      </Routes>
    </Provider>
  );
};

export default App;