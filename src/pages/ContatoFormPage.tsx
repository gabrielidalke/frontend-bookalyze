import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Box,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        setContato({
          name: "",
          phone: "",
          email: "",
          document: "",
          type: "individual",
        });
        setOpen(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const errorData = await response.json();
        setErro(
          errorData.message ||
            errorData.violations?.[0]?.interpolatedMessage ||
            "Erro ao cadastrar contato."
        );
        setOpen(true);
      }
    } catch (error) {
      console.error("Erro na conexão com o servidor:", error);
      setErro("Erro na conexão com o servidor.");
      setOpen(true);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button
          onClick={() => navigate("/dashboard")}
          size="small"
          sx={{ textTransform: "none" }}
        >
          ← Voltar para o Dashboard
        </Button>
      </Box>

      <Typography variant="h5" align="center" sx={{ mb: 3 }}>
        Cadastro de Contato
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Nome"
              name="name"
              value={contato.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Telefone"
              name="phone"
              value={contato.phone}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={contato.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Documento (CPF/CNPJ)"
              name="document"
              value={contato.document}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Tipo"
              name="type"
              value={contato.type}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="company">Empresa</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth size="large">
              Cadastrar Contato
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        {mensagem ? (
          <Alert severity="success">{mensagem}</Alert>
        ) : erro ? (
          <Alert severity="error">{erro}</Alert>
        ) : null}
      </Snackbar>
    </Paper>
  );
};

export default ContatoForm;
