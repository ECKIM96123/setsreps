const fetch = require("node-fetch");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { receipt, userId } = req.body;

  if (!receipt) {
    return res.status(400).json({ error: "Missing receipt" });
  }

  // Byt ut mot din RevenueCat REST API key (Secret key, börja med 'sk_...')
  Hconst REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY;

  const response = await fetch("https://api.revenuecat.com/v1/receipts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${REVENUECAT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      app_user_id: userId || undefined,
      fetch_token: receipt,
      platform: "ios"
    })
  });

  const data = await response.json();
  res.status(response.status).json(data);
} 