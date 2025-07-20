import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { receipt, userId } = req.body;

  if (!receipt) {
    return res.status(400).json({ error: "Missing receipt" });
  }

  const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY;

  const response = await fetch("https://api.revenuecat.com/v1/receipts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${REVENUECAT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      app_user_id: userId || undefined,
      fetch_token: receipt
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
} 