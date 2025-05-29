import React, { useState } from "react";

// Define o tipo para o objeto Contato, incluindo o campo 'type'
type Contato = {
  name: string;
  phone: string;
  email: string;
  document: string;
  type: string; // Campo 'type' é necessário para o backend
};

const ContatoForm: React.FC = () => {
  // Inicializa o estado 'contato' com campos vazios e um valor padrão para 'type'
  const [contato, setContato] = useState<Contato>({
    name: "",
    phone: "",
    email: "",
    document: "",
    type: "individual", // Valor padrão para o tipo, pode ser ajustado
  });

  // Estados para mensagens de sucesso e erro
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Função para lidar com a mudança nos inputs e no select do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> // Inclui HTMLSelectElement para o campo 'type'
  ) => {
    const { name, value } = e.target; // Extrai o nome e o valor do input/select
    // Atualiza o estado 'contato' com o novo valor para o campo específico
    setContato((prev) => ({ ...prev, [name]: value }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    setMensagem(null); // Limpa mensagens anteriores de sucesso
    setErro(null); // Limpa mensagens anteriores de erro

    try {
      // Faz a requisição POST para a API de contatos
      const response = await fetch("http://localhost:8081/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify(contato), // Converte o objeto 'contato' para JSON string
      });

      // Verifica se a resposta da requisição foi bem-sucedida (status 2xx)
      if (response.ok) {
        setMensagem("Contato cadastrado com sucesso!"); // Define mensagem de sucesso
        // Limpa o formulário resetando o estado 'contato' para os valores iniciais
        setContato({ name: "", phone: "", email: "", document: "", type: "individual" });
      } else {
        // Se a resposta não foi bem-sucedida, tenta ler a mensagem de erro do servidor
        const errorData = await response.json();
        // Melhora a exibição do erro, tentando buscar a mensagem de validação do backend
        setErro(errorData.message || errorData.violations?.[0]?.interpolatedMessage || "Erro ao cadastrar contato.");
      }
    } catch (error) {
      // Captura erros de conexão ou outros erros de rede
      setErro("Erro na conexão com o servidor.");
      console.error("Erro na conexão com o servidor:", error); // Loga o erro para depuração
    }
  };

  return (
    // Formulário com estilização Tailwind CSS
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Exibe mensagem de sucesso se houver */}
      {mensagem && (
        <div className="bg-green-100 text-green-800 p-3 rounded">
          {mensagem}
        </div>
      )}
      {/* Exibe mensagem de erro se houver */}
      {erro && (
        <div className="bg-red-100 text-red-800 p-3 rounded">{erro}</div>
      )}

      {/* Input para o nome do contato */}
      <input
        name="name" // Atributo 'name' correspondente à chave no objeto 'contato'
        value={contato.name}
        onChange={handleChange}
        placeholder="Nome"
        className="p-3 border rounded w-full"
        required // Campo obrigatório
      />
      {/* Input para o telefone do contato */}
      <input
        name="phone" // Atributo 'name' correspondente à chave no objeto 'contato'
        value={contato.phone}
        onChange={handleChange}
        placeholder="Telefone"
        className="p-3 border rounded w-full"
        required // Campo obrigatório
      />
      {/* Input para o email do contato */}
      <input
        name="email"
        type="email"
        value={contato.email}
        onChange={handleChange}
        placeholder="Email"
        className="p-3 border rounded w-full"
      />
      {/* Input para o documento do contato */}
      <input
        name="document" // Atributo 'name' correspondente à chave no objeto 'contato'
        value={contato.document}
        onChange={handleChange}
        placeholder="Documento"
        className="p-3 border rounded w-full"
        required // Campo obrigatório
      />

      {/* Campo de seleção para o tipo de contato */}
      <select
        name="type" // Atributo 'name' correspondente à chave no objeto 'contato'
        value={contato.type}
        onChange={handleChange}
        className="p-3 border rounded w-full"
        required // Campo obrigatório
      >
        <option value="">Selecione o Tipo</option> {/* Opção vazia para validação */}
        <option value="individual">Individual</option>
        <option value="company">Empresa</option>
      </select>

      {/* Botão de envio do formulário */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold"
      >
        Cadastrar Contato
      </button>
    </form>
  );
};

export default ContatoForm;