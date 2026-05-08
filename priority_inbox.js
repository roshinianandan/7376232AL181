const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJyb3NoaW5pLmFsMjNAYml0c2F0aHkuYWMuaW4iLCJleHAiOjE3NzgyMzIzMTMsImlhdCI6MTc3ODIzMTQxMywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY3YzRlZjQ1LTY3MTYtNDhmOC04ZDhkLTBmNTczZDYyOWM5NyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InJvc2hpbmkiLCJzdWIiOiI3OTMxMDM5Zi0xZTMyLTQ1NjktODUzNy00Y2I0MmM2NzlkMjAifSwiZW1haWwiOiJyb3NoaW5pLmFsMjNAYml0c2F0aHkuYWMuaW4iLCJuYW1lIjoicm9zaGluaSIsInJvbGxObyI6IjczNzYyMzJhbDE4MSIsImFjY2Vzc0NvZGUiOiJ1S2FKZm0iLCJjbGllbnRJRCI6Ijc5MzEwMzlmLTFlMzItNDU2OS04NTM3LTRjYjQyYzY3OWQyMCIsImNsaWVudFNlY3JldCI6ImpDUVVQcGR1SlV2ekNUR0EifQ.eOty4se9TzOYQHFkPUtVsQbS50NJc5chBKloqXdJg08";
const API_URL = "http://4.224.186.213/evaluation-service/notifications";
const TOP_N = 10;
const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };
function calculateScore(notification) {
  const typeWeight = TYPE_WEIGHT[notification.Type] || 0;
  const timestampMs = new Date(notification.Timestamp).getTime();
  return typeWeight * 1e12 + timestampMs;
}
async function getTopNNotifications(n = TOP_N) {
  console.log("[INFO] Fetching notifications from API...");
  const response = await fetch(API_URL, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();
  const notifications = data.notifications;
  console.log(`[INFO] Total notifications received: ${notifications.length}`);
  const scored = notifications.map((n) => ({ ...n, score: calculateScore(n) }));
  scored.sort((a, b) => b.score - a.score);
  const topN = scored.slice(0, n);
  console.log(`\n========== TOP ${n} PRIORITY NOTIFICATIONS ==========\n`);
  topN.forEach((notif, index) => {
    console.log(`#${index + 1}`);
    console.log(`  Type     : ${notif.Type}`);
    console.log(`  Message  : ${notif.Message}`);
    console.log(`  Timestamp: ${notif.Timestamp}`);
    console.log(`  Score    : ${notif.score}`);
    console.log("");
  });
  return topN;
}
getTopNNotifications(TOP_N).catch((err) => console.error(`[ERROR] ${err.message}`));
