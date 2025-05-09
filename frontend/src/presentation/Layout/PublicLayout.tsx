import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/main/Footer';
import { Home } from '../pages/main/Home';
import { Admissions } from '../pages/main/Admissions';
import ContactUs from '../components/ContactUs';
import { Education } from '../pages/main/Education';
import { About } from '../pages/main/About';
import Login from '../pages/Auth/Login';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <Header />
      <Navbar layoutType='public' />
      <main className="flex-1">
        <Routes>
          <Route index element={<Home />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="education" element={<Education />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;