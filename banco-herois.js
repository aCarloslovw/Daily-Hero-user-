let heroes = []; // Array vazio inicialmente

// Função para carregar heróis do localStorage
function loadUserHeroes() {
    const userHeroes = JSON.parse(localStorage.getItem('userHeroes')) || [];
    const heroesList = document.getElementById('heroes-list');
    heroesList.innerHTML = ""; // Limpa a lista existente

    userHeroes.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-card'; // Adiciona a classe da carta

        // Define a cor com base na raridade
        let rarityColor;
        switch (hero.rarity) {
            case "lendário":
                rarityColor = "gold"; // Cor dourada para lendário
                break;
            case "heroico":
                rarityColor = "red"; // Cor vermelha para heroico
                break;
            case "comum":
                rarityColor = "gray"; // Cor cinza para comum
                break;
            default:
                rarityColor = "black"; // Cor padrão
        }

        card.innerHTML = `
            <img src="${hero.image}" alt="${hero.name}">
            <div class="hero-content">
                <div class="hero-title" style="color: ${rarityColor};">${hero.name}</div>
                <div class="hero-rarity">${hero.rarity}</div>
                <div class="hero-attribute">Poder: ${hero.power}</div>
                <div class="hero-attribute">Descrição: ${hero.description}</div>
                <div class="hero-attribute">Habilidade: ${hero.skill}</div>
            </div>
        `;

        heroesList.appendChild(card); // Adiciona a carta à lista
    });
}


// Função para voltar à página anterior
function goBack() {
    window.history.back(); // Retorna à página anterior
}

// Inicializa a página carregando os heróis
window.onload = function () {
    loadUserHeroes(); // Carrega os heróis do usuário
};
