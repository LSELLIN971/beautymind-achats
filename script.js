async function loadList() {
  try {
    const res = await fetch('/.netlify/functions/achats');
    if (!res.ok) throw new Error('load error');
    const items = await res.json();
    const tbody = document.querySelector('#shopping-list tbody');
    tbody.innerHTML = '';
    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.produit}</td>
        <td>${item.quantite}</td>
        <td>${item.auteur}</td>
        <td>${new Date(item.date).toLocaleString()}</td>
        <td><button class="btn-delete" data-id="${item.id}">Supprimer</button></td>
      `;
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        await fetch('/.netlify/functions/achats?id=' + encodeURIComponent(id), { method:'DELETE' });
        loadList();
      });
    });
  } catch (e) {
    console.error(e);
    alert("Erreur de chargement de la liste");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadList();

  document.getElementById('shopping-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const produit  = document.getElementById('product-name').value.trim();
    const quantite = Number(document.getElementById('quantity').value);
    const auteur   = document.getElementById('added-by').value.trim();
    if (!produit || !auteur || !quantite || quantite < 1) return;

    await fetch('/.netlify/functions/achats', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ produit, quantite, auteur, date: new Date().toISOString() })
    });

    e.target.reset();
    loadList();
  });
});
