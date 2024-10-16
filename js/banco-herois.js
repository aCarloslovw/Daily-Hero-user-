let heroes = []; // Array vazio inicialmente
let items = [];

// Função para carregar heróis do localStorage
function loadUserHeroes() {
    const userHeroes = JSON.parse(localStorage.getItem('userHeroes')) || [];
    const heroesList = document.getElementById('heroes-list');
    const heroSelect = document.getElementById('hero-select');

    heroesList.innerHTML = ""; // Limpa a lista existente
    heroSelect.innerHTML = `<option value="">-- Escolha um Herói --</option>`; // Limpa opções do select

    // Ordena os heróis pelo nome em ordem alfabética
    const sortedHeroes = userHeroes.sort((a, b) => a.name.localeCompare(b.name));

    // Exibe os heróis de forma ordenada por nome
    sortedHeroes.forEach(hero => {
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
                <div class="hero-attribute">HP: ${hero.hp}</div> <!-- Exibe o HP -->
            </div>
        `;

        heroesList.appendChild(card); // Adiciona a carta à lista
        heroSelect.innerHTML += `<option value="${hero.name}">${hero.name}</option>`; // Adiciona o herói ao select
    });
}



// Função para carregar itens do localStorage
function loadUserItems() {
    items = JSON.parse(localStorage.getItem('userItems')) || []; // Carrega itens do localStorage
    const itemsList = document.getElementById('items-list');
    const itemSelect = document.getElementById('item-select');
    
    itemsList.innerHTML = ""; // Limpa a lista existente
    itemSelect.innerHTML = `<option value="">-- Escolha um Item --</option>`; // Limpa opções do select

    items.forEach(item => {
        // Verifica se o item é um objeto com a propriedade 'name'
        const itemName = typeof item === 'object' && item.name ? item.name : item;
    
        // Se o item for um objeto sem 'name', pula
        if (itemName === '[object Object]') {
            return; // Ignora objetos inválidos
        }
    
        // Criação do elemento visual para o item
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-card'; // Adiciona a classe da carta de item
        itemDiv.textContent = itemName; // Exibe o nome do item
    
        // Adiciona o item à lista visual
        itemsList.appendChild(itemDiv);
    
        // Adiciona o item ao select, usando o valor do nome corretamente
        itemSelect.innerHTML += `<option value="${itemName}">${itemName}</option>`;
    });
    
}

// Função para gerar um novo ID único
function generateUniqueId() {
    return 'hero_' + Math.random().toString(36).substr(2, 9); // Gera um ID único
}

// Função para evoluir um herói
function evolveHero(selectedHeroName, selectedItemName) {
    // Recupera todos os heróis do localStorage
    let userHeroes = JSON.parse(localStorage.getItem('userHeroes')) || [];

    console.log("Heróis armazenados:", userHeroes);

    // Encontra o herói selecionado
    const selectedHero = userHeroes.find(hero => hero.name === selectedHeroName);

    if (!selectedHero) {
        console.log("Herói não encontrado.");
        return null;
    }
    
    console.log("Herói selecionado para evolução:", selectedHero);

    // Verifica se o herói e o item são válidos para evolução
    if (selectedHeroName === "Knight" && selectedItemName === "Balerion") {
        const uniqueId = generateUniqueId();
        console.log("Condições de evolução satisfeitas. Gerando Aegon...");

        // Criação da nova carta "Aegon, o Conquistador"
        const aegon = {
            uniqueId: uniqueId,
            id: 28, // Gera um novo ID único
            name: "Aegon, o Conquistador", // Nome do novo herói
            power: 100, // Novo poder
            description: "O conquistador dos Sete Reinos.", // Descrição
            image: "https://th.bing.com/th/id/OIG2.pJagMudDQFiN0DV7fWZY?pid=ImgGn", // URL da imagem
            rarity: "lendário", // Raridade
            skill: "Conquista Infinita", // Nova habilidade
            hp: 150, // HP do novo herói
            isDefeated: false // Status de derrotado
        };

        // Adiciona o novo herói ao array existente de heróis
        userHeroes = [...userHeroes, aegon];

        // Remove o herói original da lista de heróis
        userHeroes = userHeroes.filter(hero => hero.name !== selectedHeroName);

        // Atualiza o localStorage com os novos heróis (incluindo a remoção do original)
        localStorage.setItem('userHeroes', JSON.stringify(userHeroes));

        console.log("Heróis após a evolução:", userHeroes);

        // Remover o item selecionado (simulação de array de itens no localStorage)
        let userItems = JSON.parse(localStorage.getItem('userItems')) || [];
        console.log("Itens armazenados antes da remoção:", userItems);

        // Filtra os itens removendo o item evoluído
        userItems = userItems.filter(item => item.uniqueId !== selectedItemName.uniqueId);
        localStorage.setItem('userItems', JSON.stringify(userItems));

        console.log("Itens após a remoção:", userItems);

        return aegon; // Retorna o novo herói evoluído
    }

    return null; // Se não for Knight com Balerion, não evolui
}



function removeItem(uniqueId) {
    let userItems = JSON.parse(localStorage.getItem('userItems')) || [];
    
    // Filtra o item que será removido
    userItems = userItems.filter(item => item.uniqueId !== uniqueId);
    
    // Atualiza o localStorage
    localStorage.setItem('userItems', JSON.stringify(userItems));
}

// Evento de clique no botão de evolução
document.getElementById('evolve-btn').addEventListener('click', () => {
    const heroSelect = document.getElementById('hero-select');
    const itemSelect = document.getElementById('item-select');
    const evolutionResult = document.getElementById('evolution-result');
    const evolvedHeroContainer = document.getElementById('evolved-hero');
    const newHeroCard = document.getElementById('new-hero-card');

    const selectedHeroName = heroSelect.value;
    const selectedItemName = itemSelect.value;

    // Log para verificar os valores selecionados
    console.log("Herói selecionado:", selectedHeroName);
    console.log("Item selecionado:", selectedItemName);

    if (selectedHeroName && selectedItemName) {
        const evolvedHero = evolveHero(selectedHeroName, selectedItemName);

        if (evolvedHero) {
            // Exibe a nova carta do herói
            evolvedHeroContainer.innerHTML = `
                <div class="hero-card">
                    <h3 class="hero-title">${evolvedHero.name}</h3>
                    <p>Poder: ${evolvedHero.power}</p>
                    <p>Raridade: ${evolvedHero.rarity}</p>
                    <p>Descrição: ${evolvedHero.description}</p>
                    <p>Habilidade: ${evolvedHero.skill}</p>
                    <p>HP: ${evolvedHero.hp}</p>
                </div>
            `;
            newHeroCard.style.display = 'block'; // Exibe a nova carta
            evolutionResult.innerHTML = `${selectedHeroName} evoluiu para ${evolvedHero.name}!`;
        } else {
            evolutionResult.innerHTML = 'Evolução falhou.';
        }
    } else {
        evolutionResult.innerHTML = 'Por favor, selecione um herói e um item para evoluir.';
    }
});


// Função para voltar à página anterior
function goBack() {
    window.history.back(); // Retorna à página anterior
}

// Inicializa a página carregando os heróis e itens
window.onload = function () {
    loadUserHeroes(); // Carrega os heróis do usuário
    loadUserItems(); // Carrega os itens do usuário
};
