import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/DashboardPage';
import ReservaForm from './components/ReservationForm';
import ReservationList from './pages/ReservationPage';
import CalendarView from './components/CalendarView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> 

        {/* Rota inicial protegida com conteúdo completo */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppConteudo />
            </PrivateRoute>
          }
        />

        {/* Rotas protegidas individuais */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/form"
          element={
            <PrivateRoute>
              <ReservaForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/reservas"
          element={
            <PrivateRoute>
              <ReservationList />
            </PrivateRoute>
          }
        />

        <Route
          path="/calendario"
          element={
            <PrivateRoute>
              <CalendarView />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// Conteúdo principal mostrado na rota "/"
function AppConteudo() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">
        Sistema de Reservas <button onClick={handleLogout} className="ml-4 text-sm text-blue-600 underline">Sair</button>
      </h1>
      <Dashboard />
      <hr className="my-4" />
      <CalendarView />
      <hr className="my-4" />
      <ReservaForm />
      <hr className="my-4" />
      <ReservationList />
    </div>
  );
}

export default App;
