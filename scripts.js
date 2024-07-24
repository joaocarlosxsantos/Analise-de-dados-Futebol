document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.football-data.org/v4/competitions/BSA/standings?season=2024';
    const apiKey = '0375969d79f74b60a0a9d73904aa1ee1';

    fetch(apiUrl, {
        headers: {
            'X-Auth-Token': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const standings = data.standings[0].table;
        const tbody = document.querySelector('#standings-table tbody');

        standings.forEach(team => {
            const row = document.createElement('tr');

            const position = document.createElement('td');
            position.textContent = team.position;
            row.appendChild(position);

            const name = document.createElement('td');
            name.textContent = team.team.name;
            row.appendChild(name);

            const playedGames = document.createElement('td');
            playedGames.textContent = team.playedGames;
            row.appendChild(playedGames);

            const won = document.createElement('td');
            won.textContent = team.won;
            row.appendChild(won);

            const draw = document.createElement('td');
            draw.textContent = team.draw;
            row.appendChild(draw);

            const lost = document.createElement('td');
            lost.textContent = team.lost;
            row.appendChild(lost);

            const points = document.createElement('td');
            points.textContent = team.points;
            row.appendChild(points);

            const goalsFor = document.createElement('td');
            goalsFor.textContent = team.goalsFor;
            row.appendChild(goalsFor);

            const goalsAgainst = document.createElement('td');
            goalsAgainst.textContent = team.goalsAgainst;
            row.appendChild(goalsAgainst);

            const goalDifference = document.createElement('td');
            goalDifference.textContent = team.goalDifference;
            row.appendChild(goalDifference);

            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});
