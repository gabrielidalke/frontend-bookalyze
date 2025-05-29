import React, { useState } from "react";

type Reserva = {
  nome: string;
  email: string;
  dataEntrada: string;
  dataSaida: string;
  numeroHospedes: number;
  cidade: string;
  canal: string;
};

const ReservaForm: React.FC = () => {
  const [reserva, setReserva] = useState<Reserva>({
    nome: "",
    email: "",
    dataEntrada: "",
    dataSaida: "",
    numeroHospedes: 1,
    cidade: "",
    canal: "",
  });

  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReserva((prev) => ({
      ...prev,
      [name]: name === "numeroHospedes" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    setErro(null);

    try {
      const response = await fetch("http://localhost:8081/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reserva),
      });

      if (response.ok) {
        setMensagem("Reserva cadastrada com sucesso!");
        setReserva({
          nome: "",
          email: "",
          dataEntrada: "",
          dataSaida: "",
          numeroHospedes: 1,
          cidade: "",
          canal: "",
        });
      } else {
        const errorData = await response.json();
        setErro(errorData.message || "Erro ao cadastrar reserva.");
      }
    } catch (error) {
      setErro("Erro na conexão com o servidor.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6 transition duration-300"
    >
      {mensagem && (
        <div className="bg-green-100 text-green-800 p-3 rounded">{mensagem}</div>
      )}
      {erro && (
        <div className="bg-red-100 text-red-800 p-3 rounded">{erro}</div>
      )}

      <input
        name="nome"
        value={reserva.nome}
        onChange={handleChange}
        placeholder="Nome do hóspede"
        className="p-3 border rounded w-full"
        required
      />
      <input
        name="email"
        type="email"
        value={reserva.email}
        onChange={handleChange}
        placeholder="Email"
        className="p-3 border rounded w-full"
        required
      />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Data de Entrada
          </label>
          <input
            name="dataEntrada"
            type="date"
            value={reserva.dataEntrada}
            onChange={handleChange}
            className="p-3 border rounded w-full"
            required
          />
        </div>
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Data de Saída
          </label>
          <input
            name="dataSaida"
            type="date"
            value={reserva.dataSaida}
            onChange={handleChange}
            className="p-3 border rounded w-full"
            required
          />
        </div>
      </div>
      <input
        name="numeroHospedes"
        type="number"
        min={1}
        value={reserva.numeroHospedes}
        onChange={handleChange}
        className="p-3 border rounded w-full"
        placeholder="Número de hóspedes"
        required
      />
      <input
        name="cidade"
        value={reserva.cidade}
        onChange={handleChange}
        placeholder="Cidade"
        className="p-3 border rounded w-full"
        required
      />
      <select
        name="canal"
        value={reserva.canal}
        onChange={handleChange}
        className="p-3 border rounded w-full"
        required
      >
        <option value="">Selecione o canal</option>
        <option value="Booking">Booking</option>
        <option value="Airbnb">Airbnb</option>
        <option value="Direto">Direto</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold"
      >
        Cadastrar Reserva
      </button>
    </form>
  );
};

export default ReservaForm;
