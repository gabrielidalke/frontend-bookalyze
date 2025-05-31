import React, { useState, useEffect } from "react";


type Apartamento = {
  id: number;
  title: string;
  city: string;
  state: string;
  maxGuests: number;
  dailyRate: number;
};

const ApartamentoList: React.FC = () => {
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApartamentos = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/apartments");

        if (response.ok) {
          const data: Apartamento[] = await response.json();
          setApartamentos(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Erro ao carregar apartamentos.");
        }
      } catch (err) {
        setError("Erro na conexão com o servidor.");
        console.error("Erro ao buscar apartamentos:", err);
      }
    };

    fetchApartamentos();
  }, []);

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
