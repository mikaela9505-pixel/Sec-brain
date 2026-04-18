const https = require("https");

exports.handler = async (event) => {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;

  if (!NOTION_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: "NOTION_TOKEN not configured" }) };
  }

  const headers = {
    "Authorization": `Bearer ${NOTION_TOKEN}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  const path = event.queryStringParameters?.path || "";
  const method = event.httpMethod;
  const body = event.body;

  return new Promise((resolve) => {
    const options = {
      hostname: "api.notion.com",
      path: `/v1/${path}`,
      method,
      headers,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          body: data,
        });
      });
    });

    req.on("error", (e) => {
      resolve({ statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: e.message }) });
    });

    if (body) req.write(body);
    req.end();
  });
};
