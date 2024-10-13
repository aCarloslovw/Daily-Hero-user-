const heroes = [
    { id: 1, name: "Knight" },
    { id: 2, name: "Mage" },
    { id: 3, name: "Archer" }
  ];
  
  // Função para exibir mensagem de feedback
  function showFeedback(message, isError = false) {
    const feedbackElement = document.getElementById('feedback-message');
    feedbackElement.innerText = message;
    feedbackElement.style.color = isError ? 'red' : 'green';
  
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
      feedbackElement.innerText = "";
    }, 3000);
  }
  
  // Função para resgatar um herói aleatório
  function getRandomHero() {
    const randomIndex = Math.floor(Math.random() * heroes.length);
    return heroes[randomIndex];
  }
  
  // Verifica se o usuário já resgatou um herói hoje
  function checkHeroRescue() {
    const lastRescue = localStorage.getItem('lastRescue');
    const today = new Date().toDateString();
  
    if (lastRescue === today) {
      document.getElementById('hero-message').innerText = "Você já resgatou um herói hoje!";
      return false;
    }
  
    return true;
  }
  
  // Resgata o herói e salva no localStorage
  function rescueHero() {
    if (checkHeroRescue()) {
      const hero = getRandomHero();
      let userHeroes = JSON.parse(localStorage.getItem('userHeroes')) || [];
      userHeroes.push(hero);
      localStorage.setItem('userHeroes', JSON.stringify(userHeroes));
      localStorage.setItem('lastRescue', new Date().toDateString());
  
      document.getElementById('hero-message').innerText = `Você resgatou: ${hero.name}`;
      updateHeroList();
    }
  }
  
  // Carrega os heróis do usuário e atualiza a lista
  function loadUserHeroes() {
    const userHeroes = JSON.parse(localStorage.getItem('userHeroes')) || [];
    const heroesList = document.getElementById('heroes-list');
    heroesList.innerHTML = "";
  
    userHeroes.forEach(hero => {
      const listItem = document.createElement('li');
      listItem.innerText = hero.name;
      heroesList.appendChild(listItem);
    });
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
      const importedHeroes = JSON.parse(e.target.result);
      localStorage.setItem('userHeroes', JSON.stringify(importedHeroes));
      updateHeroList();
      document.getElementById('hero-message').innerText = "Lista de heróis atualizada!";
  
      // Mensagem de feedback de sucesso
      showFeedback("Heróis carregados com sucesso!");
    };
    reader.readAsText(file);
  }
  
  // Inicializa a página carregando os heróis
  window.onload = function () {
    loadUserHeroes();
  };
  