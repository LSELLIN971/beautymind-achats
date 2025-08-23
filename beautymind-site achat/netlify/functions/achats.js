// netlify/functions/achats.js
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const store = getStore('achats');
  const method = event.httpMethod;

  if (method === 'GET') {
    const raw = await store.get('list');
    const list = raw ? JSON.parse(raw) : [];
    return json(list);
  }

  if (method === 'POST') {
    let body;
    try { body = JSON.parse(event.body); } catch { return bad('JSON invalide'); }
    const { produit, quantite, auteur, date } = body || {};
    if (!produit || !auteur || !quantite || Number(quantite) < 1) {
      return bad('Champs requis: produit, quantite (>0), auteur');
    }

    const item = {
      id: crypto.randomUUID(),
      produit: String(produit).trim(),
      quantite: Number(quantite),
      auteur: String(auteur).trim(),
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
    };

    const raw = await store.get('list');
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(item);
    await store.set('list', JSON.stringify(list));
    return json(item, 201);
  }

  if (method === 'DELETE') {
    const id = (event.queryStringParameters || {}).id;
    if (!id) return bad('Paramètre "id" requis');

    const raw = await store.get('list');
    const list = raw ? JSON.parse(raw) : [];
    const next = list.filter(x => x.id !== id);
    await store.set('list', JSON.stringify(next));
    return json({ ok: true });
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};

function json(data, statusCode = 200) {
  return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) };
}
function bad(msg) { return json({ error: msg }, 400); }
