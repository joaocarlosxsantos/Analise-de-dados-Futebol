// Lógica da tela "Meu Clube": busca com autocomplete -> campeonatos do
// clube -> tabela ou chaveamento do campeonato + últimos/próximos jogos.

const viewBusca = document.getElementById('view-busca');
const viewCampeonatos = document.getElementById('view-campeonatos');
const viewDetalhe = document.getElementById('view-detalhe');

const searchInput = document.getElementById('team-search-input');
const suggestionsBox = document.getElementById('suggestions');
const searchStatus = document.getElementById('search-status');

const clubHeader = document.getElementById('club-header');
const campeonatosStatus = document.getElementById('campeonatos-status');
const campeonatosGrid = document.getElementById('campeonatos-grid');

const detalheTitulo = document.getElementById('detalhe-titulo');
const detalheStatus = document.getElementById('detalhe-status');
const detalheTabelaWrap = document.getElementById('detalhe-tabela-wrap');
const detalheChaveamentoWrap = document.getElementById('detalhe-chaveamento-wrap');
const bracketContainer = document.getElementById('bracket-container');

let selectedTeam = null; // { id, name, logo, country }
let debounceTimer = null;

function showView(view) {
    [viewBusca, viewCampeonatos, viewDetalhe].forEach((v) => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function showStatus(el, message) {
    el.textContent = message;
    el.style.display = message ? 'block' : 'none';
}

// --- Busca de clube (autocomplete) ---

searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    clearTimeout(debounceTimer);
    suggestionsBox.innerHTML = '';

    if (q.length < 3) {
        showStatus(searchStatus, q.length > 0 ? 'Digite ao menos 3 letras para buscar.' : '');
        return;
    }

    showStatus(searchStatus, 'Buscando...');
    debounceTimer = setTimeout(() => buscarTimes(q), 350);
});

function buscarTimes(q) {
    fetch(`/api/team-search?q=${encodeURIComponent(q)}`)
        .then((response) => response.json())
        .then((data) => {
            const teams = data.teams || [];
            if (teams.length === 0) {
                showStatus(searchStatus, 'Nenhum clube encontrado com esse nome.');
                return;
            }
            showStatus(searchStatus, '');
            renderSuggestions(teams);
        })
        .catch((error) => {
            showStatus(searchStatus, 'Erro ao buscar clubes. Tente novamente.');
            console.error('Erro ao buscar clubes:', error);
        });
}

function renderSuggestions(teams) {
    suggestionsBox.innerHTML = '';
    teams.forEach((team) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `<img src="${team.logo}" alt="${team.name}" class="team-crest"> <span>${team.name}</span><span class="suggestion-country">${team.country || ''}</span>`;
        item.addEventListener('click', () => selecionarClube(team));
        suggestionsBox.appendChild(item);
    });
}

function selecionarClube(team) {
    selectedTeam = team;
    searchInput.value = '';
    suggestionsBox.innerHTML = '';
    showStatus(searchStatus, '');
    carregarCampeonatosDoClube();
}

document.getElementById('btn-trocar-clube').addEventListener('click', () => {
    selectedTeam = null;
    showView(viewBusca);
    searchInput.focus();
});

// --- Campeonatos do clube ---

function carregarCampeonatosDoClube() {
    showView(viewCampeonatos);
    clubHeader.innerHTML = `<img src="${selectedTeam.logo}" alt="${selectedTeam.name}" class="team-crest"> <span>${selectedTeam.name}</span>`;
    campeonatosGrid.innerHTML = '';
    showStatus(campeonatosStatus, 'Carregando campeonatos...');

    fetch(`/api/team-leagues?team=${selectedTeam.id}`)
        .then((response) => response.json())
        .then((data) => {
            const leagues = data.leagues || [];
            if (leagues.length === 0) {
                showStatus(
                    campeonatosStatus,
                    'Nenhum campeonato em andamento foi encontrado para esse clube na base de dados da API-Football.'
                );
                return;
            }
            showStatus(campeonatosStatus, '');
            renderCampeonatos(leagues);
        })
        .catch((error) => {
            showStatus(campeonatosStatus, 'Erro ao buscar campeonatos do clube. Tente novamente.');
            console.error('Erro ao buscar campeonatos do clube:', error);
        });
}

function renderCampeonatos(leagues) {
    campeonatosGrid.innerHTML = '';
    leagues.forEach((league) => {
        const card = document.createElement('button');
        card.className = 'competition-card';
        const logoHtml = league.logo
            ? `<img src="${league.logo}" alt="${league.name}" class="competition-logo">`
            : `<span class="competition-logo competition-logo--placeholder">🏆</span>`;
        card.innerHTML = `
            ${logoHtml}
            <span class="competition-name">${league.name}</span>
            <span class="competition-meta">${league.type === 'Cup' ? 'Mata-mata' : 'Pontos corridos'}</span>
        `;
        card.addEventListener('click', () => abrirDetalheCampeonato(league));
        campeonatosGrid.appendChild(card);
    });
}

// --- Detalhe do campeonato: tabela/chaveamento + últimos/próximos jogos ---

function abrirDetalheCampeonato(league) {
    showView(viewDetalhe);
    detalheTitulo.textContent = `${league.name} ${league.season} — ${selectedTeam.name}`;
    detalheTabelaWrap.classList.add('hidden');
    detalheChaveamentoWrap.classList.add('hidden');
    document.getElementById('detalhe-last-list').innerHTML = '';
    document.getElementById('detalhe-next-list').innerHTML = '';
    showStatus(detalheStatus, 'Carregando...');

    const tableUrl = `/api/league-table?league=${league.id}&season=${league.season}&type=${encodeURIComponent(league.type)}`;
    const fixturesUrl = `/api/team-fixtures?team=${selectedTeam.id}&league=${league.id}&season=${league.season}`;

    Promise.all([
        fetch(tableUrl).then((r) => r.json()),
        fetch(fixturesUrl).then((r) => r.json())
    ])
        .then(([tableData, fixturesData]) => {
            showStatus(detalheStatus, '');
            renderDetalheCampeonato(tableData);
            renderGamesList(fixturesData.last, document.getElementById('detalhe-last-list'), 'Nenhum jogo anterior encontrado.');
            renderGamesList(fixturesData.next, document.getElementById('detalhe-next-list'), 'Nenhum jogo futuro agendado ainda.');
        })
        .catch((error) => {
            showStatus(detalheStatus, 'Erro ao carregar dados do campeonato. Tente novamente.');
            console.error('Erro ao carregar detalhe do campeonato:', error);
        });
}

function renderDetalheCampeonato(data) {
    if (data.format === 'bracket') {
        detalheChaveamentoWrap.classList.remove('hidden');
        renderBracket(data.rounds, data.fixturesByRound, bracketContainer);
        return;
    }

    detalheTabelaWrap.classList.remove('hidden');
    const groups = data.groups || [];
    const tbody = document.querySelector('#detalhe-tabela tbody');
    // Competições com fase de grupos têm mais de um grupo; mostramos o
    // primeiro grupo que contiver o clube selecionado (ou o primeiro, se
    // não achar — evita tela vazia).
    const grupoDoTime =
        groups.find((grupo) => grupo.some((linha) => linha.team.id === selectedTeam.id)) || groups[0] || [];
    renderStandingsTable(grupoDoTime, tbody);
}

document.getElementById('btn-voltar-campeonatos').addEventListener('click', () => {
    showView(viewCampeonatos);
});

// Estado inicial
showView(viewBusca);
