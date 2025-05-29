import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApartamentoForm from "../components/ApartamentoForm";

const ApartamentoFormPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-10"
      >
        {/* Botão de Voltar */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:underline font-medium text-sm"
          >
            ← Voltar para o Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Cadastro de Apartamento
        </h1>
        <ApartamentoForm />
      </motion.div>
    </div>
  );
};

export default ApartamentoFormPage;
