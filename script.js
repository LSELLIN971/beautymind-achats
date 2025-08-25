document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shopping-form');
    const productNameInput = document.getElementById('product-name');
    const quantityInput = document.getElementById('quantity');
    const addedByInput = document.getElementById('added-by');
    const tableBody = document.querySelector('#shopping-list tbody');

    // La clé pour stocker nos données dans le localStorage
    // C'est une alternative simple au SharePoint pour un usage côté client
    const STORAGE_KEY = 'beautyMindShoppingList';

    // Fonction pour récupérer les données depuis le localStorage
    const getItems = () => {
        const items = localStorage.getItem(STORAGE_KEY);
        return items ? JSON.parse(items) : [];
    };

    // Fonction pour sauvegarder les données dans le localStorage
    const saveItems = (items) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    };

    // Fonction pour afficher les produits dans le tableau
    const renderTable = () => {
        tableBody.innerHTML = '';
        const items = getItems();
        
        if (items.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 5;
            td.textContent = 'La liste est vide pour le moment.';
            td.style.textAlign = 'center';
            tr.appendChild(td);
            tableBody.appendChild(tr);
            return;
        }

        items.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.product}</td>
                <td>${item.quantity}</td>
                <td>${item.addedBy}</td>
                <td>${item.date}</td>
                <td><button class="delete-btn" data-index="${index}" title="Supprimer">🗑️</button></td>
            `;
            tableBody.appendChild(tr);
        });
    };

    // Gérer la soumission du formulaire
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newItem = {
            product: productNameInput.value.trim(),
            quantity: quantityInput.value,
            addedBy: addedByInput.value.trim(),
            date: new Date().toLocaleDateString('fr-FR')
        };
        
        const items = getItems();
        items.push(newItem);
        saveItems(items);

        renderTable();
        form.reset();
        productNameInput.focus();
    });

    // Gérer la suppression d'un élément
    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            let items = getItems();
            items.splice(index, 1); // Supprime l'élément du tableau
            saveItems(items);
            renderTable();
        }
    });

    // Afficher la table au chargement de la page
    renderTable();
});

