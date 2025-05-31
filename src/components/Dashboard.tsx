import React, { useEffect, useState } from "react";
import { getEstatisticas, getReservas } from "../services/reservationService"; 

const Dashboard: React.FC = () => {
  const [totalReservas, setTotalReservas] = useState<number>(0);
  const [faturamentoPorCanal, setFaturamentoPorCanal] = useState<Map<string, number>>(new Map());
  const [cidadesMaisReservadas, setCidadesMaisReservadas] = useState<string[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
    
    getEstatisticas()
      .then((response) => {
        const estatisticas = response.data;
        setTotalReservas(estatisticas.totalReservas);  
        setFaturamentoPorCanal(new Map(Object.entries(estatisticas.faturamentoPorCanal)));  
        setCidadesMaisReservadas(estatisticas.cidadesMaisReservadas || []); 
      })
      .catch((error) => {
        console.error("Erro ao carregar estatísticas:", error);
      });

    
    getReservas().then((res) => setReservas(res.data));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Dashboard de Reservas</h1>

      {}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Total de Reservas no Mês</h2>
        <p>{totalReservas}</p>
      </div>

      {}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Faturamento por Canal</h2>
        <ul>
          {Array.from(faturamentoPorCanal).map(([canal, faturamento]) => (
            <li key={canal}>{canal}: R${faturamento}</li>
          ))}
        </ul>
      </div>

      {}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Cidades com Mais Reservas</h2>
        <ul>
          {cidadesMaisReservadas.map((cidade, index) => (
            <li key={index}>{cidade}</li>
          ))}
        </ul>
      </div>

      {}
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
