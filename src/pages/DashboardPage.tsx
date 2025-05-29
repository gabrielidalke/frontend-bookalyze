import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Estatisticas = {
  totalReservas: number;
  totalApartamentos: number;
  totalContatos: number;
};

const DashboardPage: React.FC = () => {
  const [dados, setDados] = useState<Estatisticas>({
    totalReservas: 0,
    totalApartamentos: 0,
    totalContatos: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/dashboard")
      .then((res) => res.json())
      .then((data) => setDados(data))
      .catch((err) => console.error("Erro ao buscar estatísticas:", err));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10"
      >
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-12">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-blue-50 p-6 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              Total de Reservas
            </h2>
            <p className="text-4xl font-bold text-blue-900">{dados.totalReservas}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-green-700 mb-2">
              Total de Apartamentos
            </h2>
            <p className="text-4xl font-bold text-green-900">
              {dados.totalApartamentos}
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Total de Contatos
            </h2>
            <p className="text-4xl font-bold text-purple-900">
              {dados.totalContatos}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/reservas")}
            className="bg-blue-600 text-white py-4 rounded-xl shadow hover:bg-blue-700 transition text-lg font-medium"
          >
            Reservas
          </button>
          <button
            onClick={() => navigate("/apartment")}
            className="bg-green-600 text-white py-4 rounded-xl shadow hover:bg-green-700 transition text-lg font-medium"
          >
            Apartamentos
          </button>
          <button
            onClick={() => navigate("/contacts")}
            className="bg-purple-600 text-white py-4 rounded-xl shadow hover:bg-purple-700 transition text-lg font-medium"
          >
            Contatos
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
