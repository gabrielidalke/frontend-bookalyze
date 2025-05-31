

import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/DashboardPage'; 
import ReservationList from './pages/ReservationPage'; 
import ReservaForm from './components/ReservationForm'; 
import CalendarView from './components/CalendarView'; 


import ApartamentoFormPage from './pages/ApartamentoForm';
import ContatoFormPage from './pages/ContatoFormPage';
import ReservationFormPage from './pages/ReservationFormPage'; 

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {}
      <nav className="bg-blue-600 p-4 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema de Reservas</h1>
          <div className="space-x-4">
            {}
            <button onClick={() => navigate('/')} className="hover:underline">Home</button>
            <button onClick={() => navigate('/dashboard')} className="hover:underline">Dashboard</button>
            <button onClick={() => navigate('/reservas')} className="hover:underline">Reservas</button>
            <button onClick={() => navigate('/reservas/nova')} className="hover:underline">Nova Reserva</button> {}
            <button onClick={() => navigate('/apartment')} className="hover:underline">Apartamentos</button>
            <button onClick={() => navigate('/contacts')} className="hover:underline">Contatos</button>
            {}
            <button
              onClick={handleLogout}
              className="ml-4 px-3 py-1 bg-red-700 rounded-md hover:bg-red-800 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      {}
      <main className="flex-grow container mx-auto p-6">
        {children} {}
      </main>

      {}
      <footer className="bg-gray-800 p-4 text-white text-center mt-auto">
        <p>&copy; {new Date().getFullYear()} Sistema de Reservas. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};



function App() {
  return (
    <Router>
      <Routes>
        {}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                {}
                <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Bem-vindo ao Sistema de Reservas!</h2>
                {}
                <Dashboard />
                <hr className="my-8 border-t-2 border-gray-200" />
                <ReservationList />
                 {}
                {}
              </MainLayout>
            </PrivateRoute>
          }
        />

        {}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reservas"
          element={
            <PrivateRoute>
              <MainLayout>
                <ReservationList />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reservas/nova" 
          element={
            <PrivateRoute>
              <MainLayout>
                <ReservationFormPage /> {}
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/apartment"
          element={
            <PrivateRoute>
              <MainLayout>
                <ApartamentoFormPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <PrivateRoute>
              <MainLayout>
                <ContatoFormPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/calendario" 
          element={
            <PrivateRoute>
              <MainLayout>
                <CalendarView />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;