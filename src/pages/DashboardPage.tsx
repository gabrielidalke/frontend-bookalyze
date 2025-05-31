import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Container,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ContactsIcon from "@mui/icons-material/Contacts";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

type Estatisticas = {
  totalReservas: number;
  totalApartamentos: number;
  totalContatos: number;
};

type DadosExtras = {
  reservas: number;
  apartamentos: number;
  contatos: number;
};

const DashboardPage: React.FC = () => {
  const [dados, setDados] = useState<Estatisticas>({
    totalReservas: 0,
    totalApartamentos: 0,
    totalContatos: 0,
  });

  const [extras, setExtras] = useState<DadosExtras>({
    reservas: 0,
    apartamentos: 0,
    contatos: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8081/dashboard")
      .then((res) => res.json())
      .then((data) => setDados(data))
      .catch((err) => console.error("Erro ao buscar estatísticas:", err));

    fetch("http://localhost:8081/api/reservas")
      .then((res) => res.json())
      .then((data) => setExtras((prev) => ({ ...prev, reservas: data.length })))
      .catch((err) => console.error("Erro ao buscar reservas:", err));

    fetch("http://localhost:8081/api/apartments")
      .then((res) => res.json())
      .then((data) =>
        setExtras((prev) => ({ ...prev, apartamentos: data.length }))
      )
      .catch((err) => console.error("Erro ao buscar apartamentos:", err));

    fetch("http://localhost:8081/api/contacts")
      .then((res) => res.json())
      .then((data) =>
        setExtras((prev) => ({ ...prev, contatos: data.length }))
      )
      .catch((err) => console.error("Erro ao buscar contatos:", err));
  }, []);

  const Card = ({
    title,
    total,
    extra,
    icon,
    color,
  }: {
    title: string;
    total: number;
    extra: number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <Paper elevation={3} sx={{ p: 4, textAlign: "center", bgcolor: `${color}.50` }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>{icon}</Box>
      <Typography variant="h6" color={`${color}.700`} gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" color={`${color}.900`} fontWeight="bold">
        {total}
      </Typography>
      <Typography variant="body2" color={`${color}.600`}>
         {extra}
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom color="primary">
        Dashboard
      </Typography>

      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} md={4}>
          <Card
            title="Total de Reservas"
            total={dados.totalReservas}
            extra={extras.reservas}
            icon={<CalendarMonthIcon fontSize="large" color="primary" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            title="Total de Apartamentos"
            total={dados.totalApartamentos}
            extra={extras.apartamentos}
            icon={<ApartmentIcon fontSize="large" color="success" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            title="Total de Contatos"
            total={dados.totalContatos}
            extra={extras.contatos}
            icon={<ContactsIcon fontSize="large" color="secondary" />}
            color="secondary"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => navigate("/reservas")}
            size="large"
          >
            Ver Reservas
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={() => navigate("/apartment")}
            size="large"
          >
            Ver Apartamentos
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => navigate("/contacts")}
            size="large"
          >
            Ver Contatos
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
