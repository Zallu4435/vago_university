import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/main/Footer';
import { UGHome } from '../pages/ug_admissions/UGHome';
import { UGAdmissions } from '../pages/ug_admissions/UGAdmissions';
import UGProgrammes from '../pages/ug_admissions/UGProgrammes';
import { UGScholarships } from '../pages/ug_admissions/UGScholarships';
import { UGWhy_VAGO } from '../pages/ug_admissions/UGWhy_VAGO';
import ContactUs from '../components/ContactUs';

const UGLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <Header />
      <Navbar layoutType='ug' />
      <main className="flex-1">
        <Routes>
          <Route index element={<UGHome />} />
          <Route path="admissions" element={<UGAdmissions />} />
          <Route path="programmes" element={<UGProgrammes />} />
          <Route path="scholarships" element={<UGScholarships />} />
          <Route path="why-vago" element={<UGWhy_VAGO />} />
          <Route path="contact" element={<ContactUs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default UGLayout;