const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyb3NoaW5pLmFsMjNAYml0c2F0aHkuYWMuaW4iLCJleHAiOjE3NzgyMzQyOTYsImlhdCI6MTc3ODIzMzM5NiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY1Nzk0NjI1LWViOTctNDhmNy04MzY5LTI1NzQwOTg2ODQwMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InJvc2hpbmkiLCJzdWIiOiI3OTMxMDM5Zi0xZTMyLTQ1NjktODUzNy00Y2I0MmM2NzlkMjAifSwiZW1haWwiOiJyb3NoaW5pLmFsMjNAYml0c2F0aHkuYWMuaW4iLCJuYW1lIjoicm9zaGluaSIsInJvbGxObyI6IjczNzYyMzJhbDE4MSIsImFjY2Vzc0NvZGUiOiJ1S2FKZm0iLCJjbGllbnRJRCI6Ijc5MzEwMzlmLTFlMzItNDU2OS04NTM3LTRjYjQyYzY3OWQyMCIsImNsaWVudFNlY3JldCI6ImpDUVVQcGR1SlV2ekNUR0EifQ.okjVJMvlQ76PbN_A5T0gHUY2j_z0wWJSghC9YsxCZ9E";

export async function fetchNotifications({ limit, page, notification_type } = {}) {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit);
  if (page) params.append("page", page);
  if (notification_type) params.append("notification_type", notification_type);
  const url = `/api/notifications${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

export function getPriorityNotifications(notifications, n = 10) {
  const scored = notifications.map((notif) => ({
    ...notif,
    score: (TYPE_WEIGHT[notif.Type] || 0) * 1e12 + new Date(notif.Timestamp).getTime(),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n);
}
