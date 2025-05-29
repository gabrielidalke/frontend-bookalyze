import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReservas, searchReservas } from "../services/reservationService";

export default function ReservationListPage() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [cidade, setCidade] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getReservas().then((res) => setReservas(res.data));
  }, []);

  const handleBuscar = () => {
    searchReservas(cidade, dataInicio, dataFim).then((res) => setReservas(res.data));
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Voltar e Nova Reserva */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            ← Voltar para o Dashboard
          </button>

          <button
            onClick={() => navigate("/reservas/nova")}
            className="bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition px-4 py-2 text-sm"
          >
            + Nova Reserva
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Lista de Reservas
        </h1>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="p-3 border rounded w-full"
          />
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="p-3 border rounded w-full"
          />
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="p-3 border rounded w-full"
          />
          <button
            onClick={handleBuscar}
            className="bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition px-4 py-3"
          >
            Buscar
          </button>
        </div>

        <ul className="divide-y divide-gray-200">
          {reservas.length === 0 ? (
            <li className="text-center text-gray-500 py-6">
              Nenhuma reserva encontrada.
            </li>
          ) : (
            reservas.map((reserva, i) => (
              <li
                key={i}
                className={`p-4 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <strong>{reserva.apartamento?.nome}</strong> —{" "}
                {reserva.contato?.nome}
                <br />
                {reserva.dataInicio} até {reserva.dataFim}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
