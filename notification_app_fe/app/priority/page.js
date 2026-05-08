"use client";
import { useEffect, useState } from "react";
import { fetchNotifications, getPriorityNotifications } from "../api";
import {
  Container, Typography, Box, Chip, CircularProgress, Alert,
  Card, CardContent, Select, MenuItem, FormControl, InputLabel,
  AppBar, Toolbar, Button, Slider
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter } from "next/navigation";

const TYPE_COLORS = { Placement: "success", Result: "warning", Event: "info" };
const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function PriorityPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [topN, setTopN] = useState(10);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchNotifications()
      .then((data) => { setNotifications(data.notifications); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const filtered = filter ? notifications.filter((n) => n.Type === filter) : notifications;
  const prioritized = getPriorityNotifications(filtered, topN);

  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <StarIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Priority Inbox</Typography>
          <Button color="inherit" startIcon={<NotificationsIcon />} onClick={() => router.push("/")}>
            All Notifications
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h5">Top {topN} Priority Notifications</Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <Box sx={{ width: 200 }}>
              <Typography variant="caption">Show Top N: {topN}</Typography>
              <Slider value={topN} min={5} max={20} step={5} onChange={(_, v) => setTopN(v)} marks />
            </Box>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Filter by Type</InputLabel>
              <Select value={filter} label="Filter by Type" onChange={(e) => setFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress /></Box>
        ) : (
          prioritized.map((notif, index) => (
            <Card key={notif.ID} sx={{ mb: 2, border: `2px solid ${RANK_COLORS[index] || "#e0e0e0"}` }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" sx={{ color: RANK_COLORS[index] || "#666", fontWeight: "bold" }}>#{index + 1}</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">{notif.Message}</Typography>
                  </Box>
                  <Chip label={notif.Type} color={TYPE_COLORS[notif.Type]} size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary">{notif.Timestamp}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Container>
    </>
  );
}
