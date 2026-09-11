// Funções de renderização compartilhadas entre index.html e clube.html.
// Os formatos aqui batem com o que os endpoints em /api devolvem
// (ver api/_lib/rounds.js -> mapFixture, e api/standings.js / api/league-table.js).

function generateFormDots(form) {
    if (!form) return '';
    const colors = { W: 'green', L: 'red', D: 'gray' };
    // Aceita tanto "W,D,L,W,W" (football-data.org) quanto "WDLWW" (outras
    // fontes já usadas neste projeto) — normaliza removendo vírgulas antes.
    return form
        .replace(/,/g, '')
        .split('')
        .map((char) => {
            const color = colors[char.trim()];
            return color ? `<span class="dot" style="background-color: ${color};"></span>` : '';
        })
        .join(' ');
}

function formatDateTime(iso) {
    if (!iso) return '';
    try {
        return new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(iso));
    } catch (error) {
        return iso;
    }
}

// Renderiza uma tabela de classificação (linhas de standings da API-Football)
// dentro de um <tbody>.
function renderStandingsTable(rows, tbody) {
    tbody.innerHTML = '';
    (rows || []).forEach((row) => {
        const tr = document.createElement('tr');

        const position = document.createElement('td');
        position.textContent = row.rank;
        tr.appendChild(position);

        const nameCell = document.createElement('td');
        nameCell.className = 'team-name-cell';
        const crestImg = document.createElement('img');
        crestImg.src = row.team.logo;
        crestImg.alt = `Escudo ${row.team.name}`;
        crestImg.className = 'team-crest';
        const nameSpan = document.createElement('span');
        nameSpan.textContent = row.team.name;
        nameSpan.style.marginLeft = '8px';
        nameCell.appendChild(crestImg);
        nameCell.appendChild(nameSpan);
        tr.appendChild(nameCell);

        const form = document.createElement('td');
        form.innerHTML = generateFormDots(row.form);
        tr.appendChild(form);

        const points = document.createElement('td');
        points.textContent = row.points;
        tr.appendChild(points);

        const played = document.createElement('td');
        played.textContent = row.all?.played ?? '';
        tr.appendChild(played);

        const won = document.createElement('td');
        won.textContent = row.all?.win ?? '';
        tr.appendChild(won);

        const draw = document.createElement('td');
        draw.textContent = row.all?.draw ?? '';
        tr.appendChild(draw);

        const lost = document.createElement('td');
        lost.textContent = row.all?.lose ?? '';
        tr.appendChild(lost);

        const goalsFor = document.createElement('td');
        goalsFor.textContent = row.all?.goals?.for ?? '';
        tr.appendChild(goalsFor);

        const goalsAgainst = document.createElement('td');
        goalsAgainst.textContent = row.all?.goals?.against ?? '';
        tr.appendChild(goalsAgainst);

        const goalDifference = document.createElement('td');
        goalDifference.textContent = row.goalsDiff ?? '';
        tr.appendChild(goalDifference);

        tbody.appendChild(tr);
    });
}

// Renderiza uma lista de jogos (cards) dentro de um container.
function renderGamesList(matches, container, emptyMessage) {
    container.innerHTML = '';

    if (!matches || matches.length === 0) {
        container.innerHTML = `<div class="status-box status-box--inline">${
            emptyMessage || 'Nenhum jogo encontrado.'
        }</div>`;
        return;
    }

    matches.forEach((match) => {
        const card = document.createElement('div');
        card.className = 'game-card';

        const homeTeam = document.createElement('div');
        homeTeam.className = 'team';
        homeTeam.innerHTML = `<img src="${match.home.logo}" alt="${match.home.name}" class="team-crest"> ${match.home.name}`;

        const score = document.createElement('div');
        score.className = 'score';
        const hasScore = match.goals && match.goals.home !== null && match.goals.away !== null;
        score.textContent = hasScore
            ? `${match.goals.home} - ${match.goals.away}`
            : formatDateTime(match.date) || 'A definir';

        const awayTeam = document.createElement('div');
        awayTeam.className = 'team';
        awayTeam.innerHTML = `<img src="${match.away.logo}" alt="${match.away.name}" class="team-crest"> ${match.away.name}`;

        card.appendChild(homeTeam);
        card.appendChild(score);
        card.appendChild(awayTeam);

        container.appendChild(card);
    });
}


// Renderiza o chaveamento (mata-mata) como colunas por rodada.
// rounds: lista ordenada de nomes de rodada (ex.: ["Quarter-finals", "Semi-finals", "Final"])
// fixturesByRound: { [nomeDaRodada]: [fixtures no formato mapFixture] }
function renderBracket(rounds, fixturesByRound, container) {
    container.innerHTML = '';

    (rounds || []).forEach((roundName) => {
        const matches = fixturesByRound?.[roundName] || [];
        if (matches.length === 0) return;

        const column = document.createElement('div');
        column.className = 'bracket-round';

        const title = document.createElement('h3');
        title.className = 'bracket-round-title';
        title.textContent = roundName;
        column.appendChild(title);

        matches.forEach((match) => {
            const card = document.createElement('div');
            card.className = 'bracket-match';

            const hasScore = match.goals && match.goals.home !== null && match.goals.away !== null;

            const home = document.createElement('div');
            home.className = `bracket-team${match.home.winner ? ' bracket-team--winner' : ''}`;
            home.innerHTML = `<img src="${match.home.logo}" alt="${match.home.name}" class="team-crest"> <span>${match.home.name}</span> <strong>${hasScore ? match.goals.home : ''}</strong>`;

            const away = document.createElement('div');
            away.className = `bracket-team${match.away.winner ? ' bracket-team--winner' : ''}`;
            away.innerHTML = `<img src="${match.away.logo}" alt="${match.away.name}" class="team-crest"> <span>${match.away.name}</span> <strong>${hasScore ? match.goals.away : ''}</strong>`;

            const date = document.createElement('div');
            date.className = 'bracket-date';
            date.textContent = hasScore ? 'Encerrado' : formatDateTime(match.date);

            card.appendChild(home);
            card.appendChild(away);
            card.appendChild(date);
            column.appendChild(card);
        });

        container.appendChild(column);
    });

    if (!container.innerHTML) {
        container.innerHTML = '<div class="status-box status-box--inline">Nenhum confronto encontrado ainda para essa competição.</div>';
    }
}
