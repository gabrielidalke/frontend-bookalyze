import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import ReservationList from './pages/ReservationPage';
import ReservationForm from './components/ReservationForm';
import Dashboard from './pages/DashboardPage';
import FormPage from './pages/FormPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './routes/PrivateRoute';
import './index.css';
import RegisterPage from './pages/RegisterPage';
import ApartamentoFormPage from './pages/ApartamentoForm';
import ContatoFormPage from './pages/ContatoFormPage';
import ReservationFormPage from './pages/ReservationFormPage';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reservas" element={<PrivateRoute><ReservationList /></PrivateRoute>} />
        <Route path="/nova" element={<PrivateRoute><ReservationForm /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/form" element={<PrivateRoute><FormPage /></PrivateRoute>} />
        <Route path="/reservas/nova" element={<PrivateRoute><ReservationFormPage /></PrivateRoute>} />
        <Route path="/apartment" element={<PrivateRoute><ApartamentoFormPage /></PrivateRoute>} />
        <Route path="/contacts" element={<PrivateRoute><ContatoFormPage /></PrivateRoute>} />


        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
