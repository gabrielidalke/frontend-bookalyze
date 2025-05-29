import React, { useEffect, useState } from "react";
import axios from "axios"; // axios já está importado e é uma boa escolha

// Tipos para Apartamento e Contato (com ID para os selects)
type Apartamento = {
  id: number;
  title: string;
  city: string;
  state: string;
  maxGuests: number;
  dailyRate: number; // Necessário para calcular o preço total
};

type Contato = {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: string;
};

// Tipo para a Reserva (o que será enviado para o backend, alinhado com a entidade Java)
type ReservaPayload = {
  apartmentId: number | null; // Usar null para estado inicial e validação
  contactId: number | null;   // Usar null para estado inicial e validação
  startDate: string; // Corresponde a 'startDate' no backend
  endDate: string;   // Corresponde a 'endDate' no backend
  guests: number;     // ADICIONADO: Campo guests
  channel: string;    // ADICIONADO: Campo channel
};

const ReservaForm: React.FC = () => {
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Adicionado estado de carregamento

  const [reserva, setReserva] = useState<ReservaPayload>({
    apartmentId: null, // Inicializa com null para que a opção "Selecione..." seja a padrão
    contactId: null,   // Inicializa com null
    startDate: "",
    endDate: "",
    guests: 1,         // ADICIONADO: Valor inicial para guests
    channel: "",       // ADICIONADO: Valor inicial para channel
  });

  // useEffect para buscar apartamentos e contatos ao carregar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // CORRIGIDO: URLs dos endpoints para 'apartments' e 'contacts'
        const [apartmentsRes, contactsRes] = await Promise.all([
          axios.get("http://localhost:8081/api/apartments"),
          axios.get("http://localhost:8081/api/contacts"),
        ]);

        setApartamentos(apartmentsRes.data);
        setContatos(contactsRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setErro("Erro ao carregar apartamentos ou contatos. Verifique o console e o backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReserva((prev) => ({
      ...prev,
      // Converte para número se for apartmentId, contactId ou guests
      [name]: ["apartmentId", "contactId", "guests"].includes(name) ? Number(value) : value,
    }));
  };

  // Função para calcular o preço total
  const calculateTotalPrice = (): number => {
    const { apartmentId, startDate, endDate } = reserva;

    if (apartmentId && startDate && endDate) {
      const apartment = apartamentos.find(apt => apt.id === apartmentId);
      if (apartment) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Dias de diferença
        // Certifica-se de que a data de término não é anterior à data de início
        if (start.getTime() > end.getTime()) {
          return 0; // Datas inválidas
        }
        return diffDays * apartment.dailyRate;
      }
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    setErro(null);

    // Validações básicas
    if (!reserva.apartmentId || !reserva.contactId || !reserva.startDate || !reserva.endDate || !reserva.channel) { // ADICIONADO: Validação para channel
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const calculatedPrice = calculateTotalPrice();
    if (calculatedPrice <= 0) {
      setErro("As datas de reserva são inválidas ou o preço calculado é zero/negativo.");
      return;
    }

    // Payload alinhado com a entidade Reservation do backend
    const payloadToSend = {
      apartmentId: reserva.apartmentId,
      contactId: reserva.contactId,
      startDate: reserva.startDate,
      endDate: reserva.endDate,
      totalPrice: calculatedPrice,
      guests: reserva.guests,     // ADICIONADO: guests no payload
      channel: reserva.channel,   // ADICIONADO: channel no payload
    };

    try {
      // Usando axios para a requisição POST
     await axios.post("http://localhost:8081/api/reservas", payloadToSend); // Corrigido para '/api/reservas'

      setMensagem("Reserva cadastrada com sucesso!");
      // Limpa o formulário
      setReserva({
        apartmentId: null,
        contactId: null,
        startDate: "",
        endDate: "",
        guests: 1,
        channel: "",
      });
    } catch (err: any) { // Captura o erro para exibir a mensagem do backend
      console.error("Erro ao cadastrar reserva:", err.response?.data || err.message);
      setErro(err.response?.data?.message || "Erro ao cadastrar reserva. Verifique o console.");
    }
  };

  if (loading) {
    return <div className="text-center p-4 text-gray-700">Carregando dados...</div>;
  }

  // Se houver um erro no carregamento inicial e não houver mensagem de sucesso
  if (erro && !mensagem) {
    return <div className="bg-red-100 text-red-800 p-3 rounded text-center">{erro}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-10 rounded-2xl shadow-xl w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-800">Cadastro de Reserva</h2>

      {mensagem && <div className="bg-green-100 text-green-800 p-3 rounded">{mensagem}</div>}
      {erro && <div className="bg-red-100 text-red-800 p-3 rounded">{erro}</div>}

      {/* Selecionar Apartamento */}
      <select
        name="apartmentId"
        value={reserva.apartmentId || ""} // Garante que a opção vazia seja selecionada se for null
        onChange={handleChange}
        className="p-3 border rounded w-full"
        required
      >
        <option value="">Selecione o apartamento</option>
        {apartamentos.map((a) => (
          <option key={a.id} value={a.id}>
            {a.title} - {a.city} (R$ {a.dailyRate.toFixed(2)}/dia)
          </option>
        ))}
      </select>

      {/* Selecionar Contato */}
      <select
        name="contactId"
        value={reserva.contactId || ""} // Garante que a opção vazia seja selecionada se for null
        onChange={handleChange}
        className="p-3 border rounded w-full"
        required
      >
        <option value="">Selecione o contato</option>
        {contatos.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} - {c.email}
          </option>
        ))}
      </select>

      {/* Data de Check-in */}
      <input
        type="date"
        name="startDate"
        value={reserva.startDate}
        onChange={handleChange}
        className="p-3 border rounded w-full"
        required
      />

      {/* Data de Check-out */}
      <input
        type="date"
        name="endDate"
        value={reserva.endDate}
        onChange={handleChange}
        className="p-3 border rounded w-full"
        required
      />

      {/* Campo de hóspedes (AGORA ATIVO) */}
      <input
        type="number"
        name="guests"
        value={reserva.guests} // Agora o valor vem do estado da reserva
        onChange={handleChange} // Agora o handleChange atualiza o estado
        className="p-3 border rounded w-full"
        placeholder="Número de hóspedes"
        required // Campo obrigatório
      />

      {/* Campo de preço total (calculado automaticamente, não editável) */}
      <input
        type="number"
        name="totalPrice"
        value={calculateTotalPrice()} // Exibe o preço calculado
        onChange={() => {}} // Não permite edição manual
        className="p-3 border rounded w-full bg-gray-100 cursor-not-allowed"
        placeholder="Preço total (calculado)"
        required
        readOnly // Apenas leitura
      />

      {/* Campo de canal (AGORA ATIVO) */}
      <select
        name="channel"
        value={reserva.channel} // Agora o valor vem do estado da reserva
        onChange={handleChange} // Agora o handleChange atualiza o estado
        className="p-3 border rounded w-full"
        required // Campo obrigatório
      >
        <option value="">Selecione o canal</option>
        <option value="airbnb">Airbnb</option>
        <option value="booking.com">Booking.com</option>
        <option value="direto">Direto</option>
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
