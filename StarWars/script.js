let currentPageUrl = 'https://swapi.dev/api/people/';
let nextUrl = null;      // Variável para armazenar a URL da próxima página
let previousUrl = null;  // Variável para armazenar a URL da página anterior

window.onload = async () => {
    try {
        await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button');
    nextButton.addEventListener('click', loadNextPage);

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', loadPreviousPage);
};

// Função robusta para extrair o ID numérico da URL do personagem
function getCharacterId(url) {
    const urlWithoutSlash = url.replace(/\/$/, ''); // Remove barra final
    const urlParts = urlWithoutSlash.split('/');
    return urlParts[urlParts.length - 1]; // Último elemento = ID
}

// Função para gerar URL da imagem com fallback
function getCharacterImage(id) {
    return `
        https://starwars-visualguide.com/assets/img/characters/${id}.jpg,
        https://starwars-visualguide.com/assets/img/characters/${id}.jpeg,
        https://starwars-visualguide.com/assets/img/placeholder.jpg
    `;
}

// Função principal para carregar personagens
async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Limpa resultados anteriores

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        // Paginação
        nextUrl = responseJson.next;
        previousUrl = responseJson.previous;

        responseJson.results.forEach((character) => {
            const characterId = getCharacterId(character.url);

            const card = document.createElement("div");
            card.className = "cards";
            card.style.backgroundImage = `url('${getCharacterImage(characterId)}')`;

            const characterNameBG = document.createElement("div");
            characterNameBG.className = "character-name-bg";

            const characterName = document.createElement("span");
            characterName.className = "character-name";
            characterName.innerText = character.name;

            characterNameBG.appendChild(characterName);
            card.appendChild(characterNameBG);

            // Modal
            card.onclick = () => {
                const modal = document.getElementById("modal");
                modal.style.visibility = "visible";

                const modalContent = document.getElementById("modal-content");
                modalContent.innerHTML = '';

                const characterImage = document.createElement("div");
                characterImage.className = "character-image";
                characterImage.style.backgroundImage = `url('${getCharacterImage(characterId)}')`;

                const name = document.createElement("span");
                name.className = "character-details";
                name.innerText = `Nome: ${character.name}`;

                const characterHeight = document.createElement("span");
                characterHeight.className = "character-details";
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`;

                const mass = document.createElement("span");
                mass.className = "character-details";
                mass.innerText = `Peso: ${convertMass(character.mass)}`;

                const eyeColor = document.createElement("span");
                eyeColor.className = "character-details";
                eyeColor.innerText = `Cor dos olhos: ${convertEyeColor(character.eye_color)}`;

                const birthYear = document.createElement("span");
                birthYear.className = "character-details";
                birthYear.innerText = `Nascimento: ${convertBirthYear(character.birth_year)}`;

                modalContent.appendChild(characterImage);
                modalContent.appendChild(name);
                modalContent.appendChild(characterHeight);
                modalContent.appendChild(mass);
                modalContent.appendChild(eyeColor);
                modalContent.appendChild(birthYear);
            }

            mainContent.appendChild(card);
        });

        // Atualiza botões de navegação
        const nextButton = document.getElementById('next-button');
        const backButton = document.getElementById('back-button');
        nextButton.disabled = !nextUrl;
        backButton.disabled = !previousUrl;
        backButton.style.visibility = previousUrl ? "visible" : "hidden";

        currentPageUrl = url;
    } catch (error) {
        throw new Error('Erro ao carregar personagens');
    }
}

// Função para fechar modal
function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.visibility = "hidden";
}

// Funções de conversão
function convertEyeColor(eyeColor) {
    const cores = {
        blue: "azul",
        brown: "castanho",
        green: "verde",
        yellow: "amarelo",
        black: "preto",
        pink: "rosa",
        red: "vermelho",
        orange: "laranja",
        hazel: "avela",
        unknown: "desconhecida"
    };
    return cores[eyeColor.toLowerCase()] || eyeColor;
}

function convertHeight(height) {
    if (height === "unknown") return "desconhecida";
    return (height / 100).toFixed(2);
}

function convertMass(mass) {
    if (mass === "unknown") return "desconhecido";
    return `${mass} kg`;
}

function convertBirthYear(birthYear) {
    if (birthYear === "unknown") return "desconhecido";
    return birthYear;
}

// Navegação
async function loadNextPage() {
    if (!nextUrl) return;
    try {
        await loadCharacters(nextUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a próxima página');
    }
}

async function loadPreviousPage() {
    if (!previousUrl) return;
    try {
        await loadCharacters(previousUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar a página anterior');
    }
}
