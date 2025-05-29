import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setErro('');
    setSucesso('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    try {
      await axios.post('http://localhost:8081/auth/register', {
        username,
        password: senha,
      });

      setSucesso('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErro('Erro ao registrar. Verifique os dados e tente novamente.');
      console.error(err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#eef1f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '420px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '28px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          Criar Conta
        </h2>

        {erro && (
          <div style={{
            backgroundColor: '#ffe0e0',
            color: '#b30000',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {erro}
          </div>
        )}

        {sucesso && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {sucesso}
          </div>
        )}

        <input
          type="text"
          placeholder="Usuário"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          autoComplete="new-password"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />

        <button
          onClick={handleRegister}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Cadastrar
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </div>
      </div>
    </div>
  );
}
