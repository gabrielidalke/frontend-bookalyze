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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

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
      setOpen(true);
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
        setOpen(true);
        setApartamento({
          title: "",
          city: "",
          state: "",
          maxGuests: 1,
          dailyRate: NaN,
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const errorData = await response.json();
        setErro(errorData.message || "Erro ao cadastrar apartamento.");
        setOpen(true);
      }
    } catch (error) {
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
        Cadastro de Apartamento
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Título do Apartamento"
              name="title"
              value={apartamento.title}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Cidade"
              name="city"
              value={apartamento.city}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Estado"
              name="state"
              value={apartamento.state}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Máx. Hóspedes"
              name="maxGuests"
              type="number"
              inputProps={{ min: 1 }}
              value={apartamento.maxGuests}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Valor da Diária (R$)"
              name="dailyRate"
              type="number"
              inputProps={{ min: 0, step: "0.01" }}
              value={isNaN(apartamento.dailyRate) ? "" : apartamento.dailyRate}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth size="large">
              Cadastrar Apartamento
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

export default ApartamentoForm;
