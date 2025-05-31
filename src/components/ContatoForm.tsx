import React, { useState } from "react";


type Contato = {
  name: string;
  phone: string;
  email: string;
  document: string;
  type: string; 
};

const ContatoForm: React.FC = () => {
 
  const [contato, setContato] = useState<Contato>({
    name: "",
    phone: "",
    email: "",
    document: "",
    type: "individual", 
  });

 
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

 
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> 
  ) => {
    const { name, value } = e.target; 
    
    setContato((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setMensagem(null); 
    setErro(null); 

    try {
     
      const response = await fetch("http://localhost:8081/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(contato), 
      });

      
      if (response.ok) {
        setMensagem("Contato cadastrado com sucesso!"); 
       
        setContato({ name: "", phone: "", email: "", document: "", type: "individual" });
      } else {
        
        const errorData = await response.json();
       
        setErro(errorData.message || errorData.violations?.[0]?.interpolatedMessage || "Erro ao cadastrar contato.");
      }
    } catch (error) {
      
      setErro("Erro na conexão com o servidor.");
      console.error("Erro na conexão com o servidor:", error); 
    }
  };

  return (
  
    <form onSubmit={handleSubmit} className="space-y-6">
      {}
      {mensagem && (
        <div className="bg-green-100 text-green-800 p-3 rounded">
          {mensagem}
        </div>
      )}
      {}
      {erro && (
        <div className="bg-red-100 text-red-800 p-3 rounded">{erro}</div>
      )}

      {}
      <input
        name="name" 
        value={contato.name}
        onChange={handleChange}
        placeholder="Nome"
        className="p-3 border rounded w-full"
        required
      />
      {}
      <input
        name="phone" 
        value={contato.phone}
        onChange={handleChange}
        placeholder="Telefone"
        className="p-3 border rounded w-full"
        required 
      />
      {}
      <input
        name="email"
        type="email"
        value={contato.email}
        onChange={handleChange}
        placeholder="Email"
        className="p-3 border rounded w-full"
      />
      {}
      <input
        name="document" 
        value={contato.document}
        onChange={handleChange}
        placeholder="Documento"
        className="p-3 border rounded w-full"
        required 
      />

      {}
      <select
        name="type" 
        value={contato.type}
        onChange={handleChange}
        className="p-3 border rounded w-full"
        required 
      >
        <option value="">Selecione o Tipo</option> {}
        <option value="individual">Individual</option>
        <option value="company">Empresa</option>
      </select>

      {}
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