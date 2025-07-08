// src/educator/EducatorDashboard.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';
import Header from './components/Header';
import Footer from './components/Footer';

const EducatorDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-blue-50 text-gray-800">
      <Header />
      <NavBar />
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default EducatorDashboard;
