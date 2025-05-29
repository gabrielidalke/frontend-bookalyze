import React, { useState, useEffect } from "react";

// Define o tipo para a estrutura de um apartamento, incluindo o 'id'
type Apartamento = {
  id: number; // Adicionado o ID, pois você vai buscar apartamentos existentes
  title: string;
  city: string;
  state: string;
  maxGuests: number;
  dailyRate: number;
};

const ApartamentoList: React.FC = () => {
  // Estado para armazenar a lista de apartamentos
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  // Estados para mensagens de carregamento e erro
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para buscar os apartamentos quando o componente for montado
  useEffect(() => {
    const fetchApartamentos = async () => {
      try {
        // Faz a requisição GET para o endpoint que retorna todos os apartamentos
        const response = await fetch("http://localhost:8081/api/apartments");

        if (response.ok) {
          const data: Apartamento[] = await response.json();
          setApartamentos(data); // Atualiza o estado com a lista de apartamentos
        } else {
          // Se a resposta não for OK, tenta ler a mensagem de erro do servidor
          const errorData = await response.json();
          setError(errorData.message || "Erro ao carregar apartamentos.");
        }
      } catch (err) {
        // Captura erros de conexão ou outros erros de rede
        setError("Erro na conexão com o servidor ao carregar apartamentos.");
        console.error("Erro ao buscar apartamentos:", err);
      } finally {
        setLoading(false); // Define o estado de carregamento como falso, independentemente do sucesso ou falha
      }
    };

    fetchApartamentos(); // Chama a função para buscar os apartamentos
  }, []); // O array de dependências vazio garante que a função seja executada apenas uma vez, na montagem do componente

  if (loading) {
    return <div className="text-center p-4">Carregando apartamentos...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-3 rounded text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Apartamentos</h2>
      {apartamentos.length === 0 ? (
        <p className="text-center text-gray-600">Nenhum apartamento cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apartamentos.map((apt) => (
            <div key={apt.id} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{apt.title}</h3>
              <p className="text-gray-700">
                <span className="font-medium">Local:</span> {apt.city}, {apt.state}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Hóspedes:</span> {apt.maxGuests}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Diária:</span> R$ {apt.dailyRate.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApartamentoList;
