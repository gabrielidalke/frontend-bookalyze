import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Snackbar,
  Alert,
  MenuItem,
  Box,
} from "@mui/material";
import axios from "axios";

type Apartamento = {
  id: number;
  title: string;
  city: string;
  state: string;
  maxGuests: number;
  dailyRate: number;
};

type Contato = {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: string;
};

type ReservaFormState = {
  apartmentId: number | null;
  contactId: number | null;
  startDate: string;
  endDate: string;
  guests: number;
  channel: string;
};

const ReservaForm: React.FC = () => {
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [reserva, setReserva] = useState<ReservaFormState>({
    apartmentId: null,
    contactId: null,
    startDate: "",
    endDate: "",
    guests: 1,
    channel: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apartmentsRes, contactsRes] = await Promise.all([
          axios.get("http://localhost:8081/api/apartments"),
          axios.get("http://localhost:8081/api/contacts"),
        ]);

        setApartamentos(apartmentsRes.data);
        setContatos(contactsRes.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setErro("Erro ao carregar apartamentos ou contatos.");
        setOpen(true);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReserva((prev) => ({
      ...prev,
      [name]: ["apartmentId", "contactId", "guests"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const calculateTotalPrice = (): number => {
    const { apartmentId, startDate, endDate } = reserva;

    if (apartmentId && startDate && endDate) {
      const apartment = apartamentos.find((apt) => apt.id === apartmentId);
      if (apartment) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) return 0;

        const diffDays = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );

        return (diffDays > 0 ? diffDays : 1) * apartment.dailyRate;
      }
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    setErro(null);

    const totalPrice = calculateTotalPrice();

    if (
      !reserva.apartmentId ||
      !reserva.contactId ||
      !reserva.startDate ||
      !reserva.endDate ||
      !reserva.channel
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      setOpen(true);
      return;
    }

    if (totalPrice <= 0) {
      setErro("Datas inválidas ou total zerado.");
      setOpen(true);
      return;
    }

    const payload = {
      apartment: { id: reserva.apartmentId },
      contact: { id: reserva.contactId },
      checkinDate: reserva.startDate,
      checkoutDate: reserva.endDate,
      totalPrice: totalPrice,
      guests: reserva.guests,
      channel: reserva.channel,
    };

    try {
      await axios.post("http://localhost:8081/api/reservas", payload);
      setMensagem("Reserva cadastrada com sucesso!");
      setOpen(true);
      setReserva({
        apartmentId: null,
        contactId: null,
        startDate: "",
        endDate: "",
        guests: 1,
        channel: "",
      });
    } catch (err: any) {
      console.error(err);
      setErro(err.response?.data?.message || "Erro ao cadastrar reserva.");
      setOpen(true);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 4 }}>
      <Typography variant="h5" textAlign="center" mb={3}>
        Cadastro de Reserva
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              name="apartmentId"
              label="Apartamento"
              value={reserva.apartmentId || ""}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="">Selecione</MenuItem>
              {apartamentos.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.title} - {a.city} (R$ {a.dailyRate.toFixed(2)}/dia)
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              name="contactId"
              label="Contato"
              value={reserva.contactId || ""}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="">Selecione</MenuItem>
              {contatos.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name} - {c.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Data de Entrada"
              name="startDate"
              type="date"
              value={reserva.startDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Data de Saída"
              name="endDate"
              type="date"
              value={reserva.endDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Hóspedes"
              name="guests"
              type="number"
              inputProps={{ min: 1 }}
              value={reserva.guests}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Valor Total (R$)"
              name="totalPrice"
              value={calculateTotalPrice().toFixed(2)}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              name="channel"
              label="Canal"
              value={reserva.channel}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="">Selecione</MenuItem>
              <MenuItem value="airbnb">Airbnb</MenuItem>
              <MenuItem value="booking.com">Booking.com</MenuItem>
              <MenuItem value="direto">Direto</MenuItem>
              <MenuItem value="outros">Outros</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth size="large">
              Cadastrar Reserva
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

export default ReservaForm;
