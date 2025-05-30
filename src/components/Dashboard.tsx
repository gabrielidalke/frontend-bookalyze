// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [totalReservas, setTotalReservas] = useState<number>(0);
  const [faturamentoPorCanal, setFaturamentoPorCanal] = useState<Map<string, number>>(new Map());
  const [cidadesMaisReservadas, setCidadesMaisReservadas] = useState<string[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
    // Total de reservas no mês
    axios.get('http://localhost:8081/api/reservas/total-mes')
      .then(response => setTotalReservas(response.data));

    // Faturamento por canal
    axios.get('http://localhost:8081/api/reservas/faturamento-canal')
      .then(response => setFaturamentoPorCanal(new Map(Object.entries(response.data))));

    // Cidades com mais reservas
    axios.get('http://localhost:8081/api/reservas/cidades-mais-reservadas')
      .then(response => setCidadesMaisReservadas(response.data));

    // Reservas filtradas (exemplo, você pode personalizar)
    axios.get('http://localhost:8081/api/reservas', { params: { cidade: 'São Paulo' } })
      .then(response => setReservas(response.data));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Reservas</h1>

      {/* Total de Reservas no Mês */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Total de Reservas no Mês</h2>
        <p>{totalReservas}</p>
      </div>

      {/* Faturamento por Canal */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Faturamento por Canal</h2>
        <ul>
          {Array.from(faturamentoPorCanal).map(([canal, faturamento]) => (
            <li key={canal}>{canal}: R${faturamento}</li>
          ))}
        </ul>
      </div>

      {/* Cidades com Mais Reservas */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Cidades com Mais Reservas</h2>
        <ul>
          {cidadesMaisReservadas.map((cidade, index) => (
            <li key={index}>{cidade}</li>
          ))}
        </ul>
      </div>

      {/* Lista de Reservas */}
      <div>
        <h2 className="text-xl font-semibold">Lista de Reservas</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome Cliente</th>
              <th>Cidade</th>
              <th>Data Entrada</th>
              <th>Data Saída</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.nomeCliente}</td>
                <td>{reserva.cidade}</td>
                <td>{reserva.dataEntrada}</td>
                <td>{reserva.dataSaida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
