  // Função para carregar heróis do localStorage
  function loadHeroesFromStorage() {
    const storedHeroes = JSON.parse(localStorage.getItem('userHeroes')) || [];
    return storedHeroes;
}

let selectedHero = null; // Variável para armazenar o herói selecionado
let keysAvailable = 0; // Inicializa o contador de chaves
let rescuedHeroes = []; // Array para armazenar os heróis resgatados
let defeatedHeroes = [];

// Função para mostrar o banco de heróis
function showHeroSelection() {
    const heroSelection = document.getElementById('hero-selection');
    const heroList = document.getElementById('hero-list');
    heroList.innerHTML = ''; // Limpa a lista antes de gerar os heróis

    const storedHeroes = loadHeroesFromStorage(); // Carrega heróis do localStorage

    storedHeroes.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.classList.add('hero-card');

        // Define a cor com base na raridade
        let rarityColor;
        switch (hero.rarity) {
            case "lendário":
                rarityColor = "gold";
                break;
            case "heroico":
                rarityColor = "red";
                break;
            case "comum":
                rarityColor = "gray";
                break;
            default:
                rarityColor = "black";
        }

        // Aplica a cor ao nome do herói
        heroCard.innerHTML = `
            <img src="${hero.image}" alt="${hero.name}">
            <h3 style="color: ${rarityColor};">${hero.name}</h3>
            <p>Poder: ${hero.power}</p>
            <p>HP: ${hero.hp}</p>
        `;
        heroCard.onclick = () => selectHero(hero);
        heroList.appendChild(heroCard);
    });

    heroSelection.style.display = 'flex';
}

// Função para selecionar o herói
function selectHero(hero) {
    // Verifica se o herói está na lista de derrotados
    if (defeatedHeroes.includes(hero.id)) {
        showCustomAlert("Este herói foi derrotado e não pode ser selecionado novamente.");
        return; // Impede a seleção do herói derrotado
    }

    // Verifica se o herói tem HP válido (diferente de undefined, null, ou 0)
    if (!hero.hp || hero.hp <= 0) {
        showCustomAlert("Herói inválido: sem pontos de vida."); // Exibe uma mensagem de erro
        return; // Impede a seleção do herói
    }

    selectedHero = hero;
    document.getElementById('hero-name').textContent = hero.name;
    document.getElementById('hero-power').textContent = hero.power;
    document.getElementById('hero-skill').textContent = hero.skill;
    document.getElementById('hero-hp').textContent = hero.hp; // Atualiza HP do herói
    document.getElementById('hero-image').src = hero.image;
    document.getElementById('hero-hp-bar').style.width = hero.hp + '%'; // Atualiza barra de HP do herói
    document.getElementById('hero-selection').style.display = 'none';
}



let bossHp = 100; // HP do boss fora da função para persistência

// Função para iniciar a batalha
function startBattle() {
    console.log("A função startBattle foi chamada.");

    // Verifica se um herói foi selecionado
    if (!selectedHero) {
        showCustomAlert("Por favor, selecione um herói antes de lutar!");
        return;
    }

    if (defeatedHeroes.includes(selectedHero.id)) {
        showCustomAlert("Este herói foi derrotado e não pode ser selecionado novamente.");
        return; // Impede a função de continuar
    }   
    const bossPower = 100; // Poder do boss
    const heroPower = selectedHero.power; // Poder do herói
    let heroHp = selectedHero.hp; // HP do herói

    // Função que realiza a batalha em turnos
    function turn() {
        bossHp -= heroPower; // Dano ao boss
        updateHpDisplay();
        document.querySelector('.boss').classList.add('attack'); // Adiciona animação de ataque

        if (bossHp <= 0) {
            document.getElementById('battle-result').textContent = `${selectedHero.name} venceu o Dragão Ancião!`;

            // Adiciona a animação ao herói
            document.querySelector('.hero').classList.add('win');

            keysAvailable++; // Incrementa o contador de chaves ao vencer o boss
            updateKeyCount(); // Atualiza a exibição de chaves
            return; // Encerra a batalha
        }

        // O boss ataca o herói
        setTimeout(() => {
            heroHp -= bossPower; // Dano do boss
            updateHpDisplay();
            document.querySelector('.hero').classList.add('attack'); // Adiciona animação de ataque

            if (heroHp <= 0) {
                document.getElementById('battle-result').textContent = `${selectedHero.name} foi derrotado pelo Dragão Ancião!`;
                
                // Marca o herói como derrotado
                defeatedHeroes.push(selectedHero.id);
                console.log(`Herói derrotado: ${selectedHero.name}`);
                return; //Encerra a batalha
            }

            setTimeout(turn, 1000); // Próximo turno
        }, 1000);
    }
            
    // Atualiza a exibição de HP
    function updateHpDisplay() {
        const bossHpElement = document.getElementById('boss-hp');
        const bossHpBarElement = document.getElementById('boss-hp-bar');
        const heroHpElement = document.getElementById('hero-hp');
        const heroHpBarElement = document.getElementById('hero-hp-bar');

        // Atualiza os valores de HP
        bossHpElement.textContent = bossHp;
        bossHpBarElement.style.width = `${Math.max(0, (bossHp / 100) * 100)}%`;
        heroHpElement.textContent = heroHp;
        heroHpBarElement.style.width = `${Math.max(0, (heroHp / selectedHero.hp) * 100)}%`;

        // Remove a animação após o ataque
        setTimeout(() => {
            document.querySelector('.boss').classList.remove('attack');
            document.querySelector('.hero').classList.remove('attack');
        }, 500);
    }

    turn(); // Inicia o primeiro turno
}

function displayAvailableHeroes(heroes) {
    const heroContainer = document.getElementById('hero-container');
    heroContainer.innerHTML = ''; // Limpa a exibição anterior

    // Filtra os heróis que não estão na lista de derrotados
    const availableHeroes = heroes.filter(hero => !defeatedHeroes.includes(hero.id));

    availableHeroes.forEach(hero => {
        const heroElement = document.createElement('div');
        heroElement.textContent = hero.name;
        heroElement.onclick = () => selectHero(hero); // Seleciona o herói ao clicar
        heroContainer.appendChild(heroElement);
    });
}
// Função para atualizar a contagem de chaves na interface
function updateKeyCount() {
    document.getElementById('keys-available').textContent = keysAvailable;
    document.getElementById('rescue-button').disabled = keysAvailable <= 0;
}

function rescueHero() {
    if (keysAvailable > 0) {
        const newHero = getRandomHero(); // Função que retorna um herói aleatório

        // Adiciona o novo herói à lista de heróis resgatados
        rescuedHeroes.push(newHero);

        // Atualiza a exibição da lista de heróis resgatados
        updateRescuedHeroesList();

        // Exibe o herói resgatado como uma "propaganda"
        showRescuedHeroAd(newHero);

        // Decrementa a contagem de chaves
        keysAvailable--;
        updateKeyCount(); // Atualiza a exibição das chaves disponíveis
    } else {
        showCustomAlert("Você não tem chaves suficientes para resgatar um novo herói.");
    }
}

function showRescuedHeroAd(hero) {
    // Cria o elemento de propaganda
    const adContainer = document.createElement('div');
    adContainer.classList.add('hero-ad');

    // Adiciona o conteúdo do herói resgatado
    adContainer.innerHTML = `
        <div class="hero-ad-content">
            <img src="${hero.image}" alt="${hero.name}">
            <h3>${hero.name}</h3>
            <p>Poder: ${hero.power}</p>
            <p>Habilidade: ${hero.skill}</p>
            <p>HP: ${hero.hp}</p>
        </div>
    `;

    // Adiciona a classe de animação para girar o herói
    adContainer.classList.add('spin-animation');

    // Adiciona o anúncio ao corpo da página
    document.body.appendChild(adContainer);

    // Remove o anúncio após alguns segundos (por exemplo, 5 segundos)
    setTimeout(() => {
        adContainer.classList.remove('spin-animation'); // Para remover a animação após o tempo
        adContainer.remove(); // Remove o anúncio da tela
    }, 5000); // Exibe por 5 segundos
}



// Função para atualizar a lista de heróis resgatados
function updateRescuedHeroesList() {
    const rescuedHeroesList = document.getElementById('rescued-heroes-list');
    rescuedHeroesList.innerHTML = ''; // Limpa a lista antes de atualizar

    rescuedHeroes.forEach(hero => {
        const heroCard = document.createElement('div');
        heroCard.classList.add('rescued-hero-card');

        heroCard.innerHTML = `
            <img src="${hero.image}" alt="${hero.name}">
            <h3>${hero.name}</h3>
            <p>Poder: ${hero.power}</p>
            <p>Habilidade: ${hero.skill}</p>
            <p>HP: ${hero.hp}</p>
        `;
        rescuedHeroesList.appendChild(heroCard);
    });
}

// Função para obter um herói aleatório
function getRandomHero() {
    const heroes = [
        { name: "Baby Dragon", power: 20, skill: "Corte Poderoso", hp: 50, image: "https://th.bing.com/th/id/OIG3.FSFYb04IkPf3bieUvP_A?w=1024&h=1024&rs=1&pid=ImgDetMain" },
        { name: "Cavaleiro Dragão", power: 80, skill: "Fogo Mágico", hp: 85, image: "https://tse4.mm.bing.net/th?id=OIG2..rkR9vAnghogNT7ZXb1J&pid=ImgGn" },
        { name: "Rei Dragão", power: 100, skill: "Kings Will", hp: 120, image: "https://tse3.mm.bing.net/th?id=OIG3.Z4nvGNc3EQEmWANRKFll&pid=ImgGn" },
    ];

    const randomNumber = Math.floor(Math.random() * 100);
    let selectedHero;

    if (randomNumber === 0) {
        selectedHero = heroes[2]; // Rei Dragão
    } else {
        const otherHeroes = [heroes[0], heroes[1]];
        selectedHero = otherHeroes[Math.floor(Math.random() * otherHeroes.length)];
    }

    const heroDetails = {
        name: selectedHero.name,
        power: selectedHero.power,
        skill: selectedHero.skill,
        hp: selectedHero.hp,
        image: selectedHero.image,
        rarity: assignRarity(selectedHero.power) // Atribui a raridade com base no poder
    };

    let userHeroes = JSON.parse(localStorage.getItem('userHeroes')) || [];
    userHeroes.push(heroDetails);
    localStorage.setItem('userHeroes', JSON.stringify(userHeroes));

    return heroDetails; // Retorna o herói detalhado
}

// Função para atribuir raridade ao herói
function assignRarity(power) {
    if (power > 80) {
        return "lendário";
    } else if (power >= 50) {
        return "heroico";
    } else {
        return "comum";
    }
}

// Função para abrir o modal com uma mensagem personalizada
function showCustomAlert(message) {
    const modal = document.getElementById("custom-alert");
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = message;
    modal.style.display = "block"; // Exibe o modal
}

// Função para fechar o modal
document.getElementById("close-modal").onclick = function() {
    document.getElementById("custom-alert").style.display = "none";
}

// Fecha o modal se clicar fora da área do conteúdo
window.onclick = function(event) {
    const modal = document.getElementById("custom-alert");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}



// Chama as funções quando a página é carregada
window.onload = function () {
    loadHeroesFromStorage();
    updateKeyCount();
    updateRescuedHeroesList();
};
