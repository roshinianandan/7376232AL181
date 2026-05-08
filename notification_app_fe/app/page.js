"use client";
import { useEffect, useState } from "react";
import { fetchNotifications } from "./api";
import {
  Container, Typography, Box, Chip, CircularProgress, Alert,
  Card, CardContent, Select, MenuItem, FormControl, InputLabel,
  AppBar, Toolbar, Button, Badge
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import { useRouter } from "next/navigation";

const TYPE_COLORS = { Placement: "success", Result: "warning", Event: "info" };

export default function Home() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [readIds, setReadIds] = useState(new Set());
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("readIds");
    if (stored) setReadIds(new Set(JSON.parse(stored)));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchNotifications({ notification_type: filter || undefined })
      .then((data) => { setNotifications(data.notifications); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [filter]);

  const markRead = (id) => {
    const updated = new Set([...readIds, id]);
    setReadIds(updated);
    localStorage.setItem("readIds", JSON.stringify([...updated]));
  };

  const unreadCount = notifications.filter((n) => !readIds.has(n.ID)).length;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Campus Notifications</Typography>
          <Button color="inherit" startIcon={<StarIcon />} onClick={() => router.push("/priority")}>
            Priority Inbox
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5">
            All Notifications{" "}
            <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }}>
              <NotificationsIcon />
            </Badge>
          </Typography>
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
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress /></Box>
        ) : (
          notifications.map((notif) => {
            const isRead = readIds.has(notif.ID);
            return (
              <Card key={notif.ID} sx={{ mb: 2, opacity: isRead ? 0.6 : 1, cursor: "pointer", border: isRead ? "1px solid #ddd" : "2px solid #1976d2" }}
                onClick={() => markRead(notif.ID)}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {!isRead && <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "primary.main" }} />}
                      <Typography variant="subtitle1" fontWeight={isRead ? "normal" : "bold"}>{notif.Message}</Typography>
                    </Box>
                    <Chip label={notif.Type} color={TYPE_COLORS[notif.Type]} size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">{notif.Timestamp}</Typography>
                  {isRead && <Chip label="Read" size="small" sx={{ ml: 1 }} />}
                </CardContent>
              </Card>
            );
          })
        )}
      </Container>
    </>
  );
}
