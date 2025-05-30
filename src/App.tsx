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
        {/* Páginas públicas */}
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
    // Remover o token de autenticação
    localStorage.removeItem('token');
    // Redirecionar para a página de login
    window.location.href = '/login';
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-4">
        Sistema de Reservas 
        <button 
          onClick={handleLogout} 
          className="ml-4 text-sm text-blue-600 underline">
            Sair
        </button>
      </h1>
      
      {/* Seção do Dashboard */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Dashboard de Reservas</h2>
        <Dashboard />
      </div>
      
      <hr className="my-4" />
      
      {/* Seção do Calendar View */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Calendário de Reservas</h2>
        <CalendarView />
      </div>

      <hr className="my-4" />
      
      {/* Seção do Formulário de Reserva */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Cadastrar Nova Reserva</h2>
        <ReservaForm />
      </div>

      <hr className="my-4" />
      
      {/* Seção da Lista de Reservas */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Lista de Reservas</h2>
        <ReservationList />
      </div>
    </div>
  );
}

export default App;
