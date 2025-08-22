import { getStore } from "@netlify/blobs";

export async function handler(event) {
  const store = getStore("achats"); // "achats" = nom du stockage
  const method = event.httpMethod;

  if (method === "GET") {
    const list = await store.list();
    const values = await Promise.all(list.blobs.map(b => store.get(b.key, { type: "json" })));
    return { statusCode: 200, body: JSON.stringify(values) };
  }

  if (method === "POST") {
    const data = JSON.parse(event.body);
    const key = Date.now().toString();
    await store.setJSON(key, data);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
}
