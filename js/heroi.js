let heroes = []; // Array vazio inicialmente

// Função para carregar heróis do arquivo JSON
function loadHeroes() {
    fetch('BD_herois.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o arquivo JSON");
            }
            return response.json();
        })
        .then(data => {
            heroes = data; // Atualiza o array de heróis
            updateHeroList(); // Atualiza a lista de heróis do usuário
        })
        .catch(error => {
            console.error("Erro:", error);
            showFeedback("Erro ao carregar heróis.", true);
        });
}

// Função para resgatar um herói aleatório
function getRandomHero() {
    if (heroes.length === 0) return null; // Verifica se há heróis disponíveis
    const randomIndex = Math.floor(Math.random() * heroes.length);
    return heroes[randomIndex];
}

// Exibir mensagem de feedback
function showFeedback(message, isError = false) {
    const feedbackElement = document.getElementById('feedback-message');
    feedbackElement.innerText = message;
    feedbackElement.style.color = isError ? 'red' : 'green';

    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        feedbackElement.innerText = "";
    }, 3000);
}

// Atribui raridade com base no poder do herói
function assignRarity(power) {
    if (power > 80) {
        return "lendário"; // Poder acima de 80 é lendário
    } else if (power >= 75) {
        return "heroico"; // Poder de 70 a 80 é heroico
    } else {
        return "comum"; // Poder abaixo de 70 é comum
    }
}

// Verifica se o usuário já resgatou um herói
function checkHeroRescue() {
    const heroRescued = localStorage.getItem('heroRescued');
    const rescueDate = localStorage.getItem('rescueDate');
    const today = new Date().toISOString().split('T')[0]; // Pega a data atual no formato YYYY-MM-DD

    if (heroRescued === 'true' && rescueDate && rescueDate.split('T')[0] === today) {
        return false; // Impede o resgate se já resgatou hoje
    }

    return true; // Permite resgatar
}

function rescueHero() {
    const canRescue = checkHeroRescue();
    if (!canRescue) {
        showFeedback("Você já resgatou um herói hoje!", true);
       return; // Impede o resgate se já resgatou hoje
    }

    const hero = getRandomHero();
    if (!hero) {
        showFeedback("Nenhum herói disponível.", true);
        return;
    }

    // Busca o herói completo
    const heroDetails = heroes.find(h => h.id === hero.id);

    // Atribui raridade com base no poder do herói
    heroDetails.rarity = assignRarity(heroDetails.power);

    let userHeroes = JSON.parse(localStorage.getItem('userHeroes')) || [];

    // Adiciona o novo herói com detalhes
    userHeroes.push(heroDetails);
    localStorage.setItem('userHeroes', JSON.stringify(userHeroes));
    localStorage.setItem('heroRescued', 'true'); // Marca que um herói foi resgatado
    localStorage.setItem('rescueDate', new Date().toISOString()); // Armazena a data do resgate

    // Mostra mensagem do herói resgatado
    const heroMessage = document.getElementById('hero-message');
    heroMessage.innerText = `Você resgatou: ${heroDetails.name}`;

    // Atualiza a lista de heróis do usuário e anima o novo herói
    updateHeroList();

    // Adiciona a animação ao novo herói resgatado
    const heroesList = document.getElementById('heroes-list');
    const latestHeroCard = heroesList.lastElementChild; // Última carta é o herói resgatado
    latestHeroCard.classList.add('hero-rescue'); // Adiciona classe de animação
}



// Carrega os heróis do usuário e atualiza a lista
// Carrega os heróis do usuário e exibe apenas o mais recente
function loadUserHeroes() {
    const userHeroes = JSON.parse(localStorage.getItem('userHeroes')) || [];
    const heroesList = document.getElementById('heroes-list');
    heroesList.innerHTML = ""; // Limpa a lista existente

    if (userHeroes.length > 0) {
        // Carrega todos os heróis, mas só exibe o mais recente
        const latestHero = userHeroes[userHeroes.length - 1]; // Pega o herói mais recente

        const card = document.createElement('div');
        card.className = 'hero-card'; // Adiciona a classe da carta

        // Define a cor com base na raridade
        let rarityColor;
        switch (latestHero.rarity) {
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
            <img src="${latestHero.image}" alt="${latestHero.name}">
            <div class="hero-content">
                <div class="hero-title" style="color: ${rarityColor};">${latestHero.name}</div>
                <div class="hero-rarity">${latestHero.rarity}</div>
                <div class="hero-attribute">Poder: ${latestHero.power}</div>
                <div class="hero-attribute">Descrição: ${latestHero.description}</div>
                <div class="hero-attribute">Habilidade: ${latestHero.skill}</div>
                <div class="hero-attribute">HP: ${latestHero.hp}</div> <!-- Exibe o HP -->
            </div>
        `;

        heroesList.appendChild(card); // Adiciona a carta do herói mais recente à lista
    }
}



// Atualiza a lista de heróis do usuário
function updateHeroList() {
    loadUserHeroes();
}

// Exporta os heróis como arquivo JSON
function exportHeroes() {
    const userHeroes = JSON.parse(localStorage.getItem('userHeroes')) || [];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userHeroes));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "user_heroes.json");
    document.body.appendChild(downloadAnchorNode); // necessário para o Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    // Mensagem de feedback de sucesso
    showFeedback("Heróis exportados com sucesso!");
}

// Importa heróis de um arquivo JSON
function importHeroes(event) {
    const file = event.target.files[0];
    if (!file) {
        showFeedback("Nenhum arquivo selecionado", true);
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedHeroes = JSON.parse(e.target.result);
            // Verificação de propriedades (opcional)
            if (Array.isArray(importedHeroes)) {
                localStorage.setItem('userHeroes', JSON.stringify(importedHeroes));
                updateHeroList();
                document.getElementById('hero-message').innerText = "Lista de heróis atualizada!";
                showFeedback("Heróis carregados com sucesso!");
            } else {
                throw new Error("Formato inválido");
            }
        } catch (error) {
            showFeedback("Erro ao carregar heróis: " + error.message, true);
        }
    };
    reader.readAsText(file);
}

// Inicializa a página carregando os heróis
window.onload = function () {
    loadHeroes(); // Carrega os heróis do arquivo JSON
    loadUserHeroes(); // Carrega os heróis do usuário
};
function goToHeroBank() {
    window.location.href = 'banco-herois.html'; // Altere o nome do arquivo conforme necessário
};

// Função para limpar o histórico de heróis
// Função para limpar o histórico de heróis exibidos
function clearHeroHistory() {
    // Limpa a lista de heróis exibida
    const heroesList = document.getElementById('heroes-list');
    heroesList.innerHTML = ""; // Remove todos os heróis da lista exibida

    // Mensagem de feedback
    showFeedback("Histórico de heróis exibidos limpo!");
}


// Adiciona um ouvinte de eventos ao botão
document.getElementById('clear-history-button').addEventListener('click', clearHeroHistory);

function goToBossFight() {
    // Lógica para ir à área de luta contra o Boss
    alert("Você está indo para a luta contra o Boss!");
    // Aqui você pode redirecionar para uma nova página ou abrir a interface de luta
    // Exemplo de redirecionamento:
    window.location.href = 'boss-fight.html';
}
