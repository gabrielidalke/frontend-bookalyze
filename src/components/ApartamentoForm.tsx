import React, { useState } from "react";

type Apartamento = {
  title: string;
  city: string;
  state: string;
  maxGuests: number;
  dailyRate: number;
};

const ApartamentoForm: React.FC = () => {
  const [apartamento, setApartamento] = useState<Apartamento>({
    title: "",
    city: "",
    state: "",
    maxGuests: 1,
    dailyRate: NaN, 
  });

  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApartamento((prev) => ({
      ...prev,
      [name]: name === "maxGuests" || name === "dailyRate" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    setErro(null);

    
    if (isNaN(apartamento.dailyRate) || apartamento.dailyRate <= 0) {
      setErro("A diária deve ser um valor positivo.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/apartments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apartamento),
      });

      if (response.ok) {
        setMensagem("Apartamento cadastrado com sucesso!");
        setApartamento({
          title: "",
          city: "",
          state: "",
          maxGuests: 1,
          dailyRate: NaN, 
        });
      } else {
        const errorData = await response.json();
        setErro(errorData.message || "Erro ao cadastrar apartamento.");
      }
    } catch (error) {
      setErro("Erro na conexão com o servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mensagem && (
        <div className="bg-green-100 text-green-800 p-3 rounded">{mensagem}</div>
      )}
      {erro && (
        <div className="bg-red-100 text-red-800 p-3 rounded">{erro}</div>
      )}

      <input
        name="title"
        value={apartamento.title}
        onChange={handleChange}
        placeholder="Título do apartamento"
        className="p-3 border rounded w-full"
        required
      />
      <input
        name="city"
        value={apartamento.city}
        onChange={handleChange}
        placeholder="Cidade"
        className="p-3 border rounded w-full"
        required
      />
      <input
        name="state"
        value={apartamento.state}
        onChange={handleChange}
        placeholder="Estado"
        className="p-3 border rounded w-full"
        required
      />
      <input
        name="maxGuests"
        type="number"
        min={1}
        value={apartamento.maxGuests}
        onChange={handleChange}
        placeholder="Máx. Hóspedes"
        className="p-3 border rounded w-full"
        required
      />
      <input
        name="dailyRate"
        type="number"
        step="0.01"
        value={isNaN(apartamento.dailyRate) ? "" : apartamento.dailyRate} 
        onChange={handleChange}
        placeholder="Diária (R$)"
        className="p-3 border rounded w-full"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold"
      >
        Cadastrar Apartamento
      </button>
    </form>
  );
};

export default ApartamentoForm;
