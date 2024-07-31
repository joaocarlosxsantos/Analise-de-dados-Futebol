import fetch from 'node-fetch';

// Função para obter o currentMatchday
async function getLastMatchday() {
    const apiUrl = 'https://api.football-data.org/v4/competitions?areas=2032';
    const apiKey = '0375969d79f74b60a0a9d73904aa1ee1';

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch current matchday');
        }

        const data = await response.json();
        const currentMatchday = data.competitions[0].currentSeason.currentMatchday;
        const lastMatchday = currentMatchday-1
        return lastMatchday;
    } catch (error) {
        console.error('Error fetching current matchday:', error);
        throw error;
    }
}

// Função principal para obter os jogos
export default async function (req, res) {
    try {
        // Obter o getLastMatchday
        const matchday = await getLastMatchday();

        // Construir a URL com o matchday obtido
        const apiUrl = `https://api.football-data.org/v4/competitions/BSA/matches?matchday=${matchday}&season=2024&status=TIMED,SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED`;
        const apiKey = '0375969d79f74b60a0a9d73904aa1ee1';

        // Fazer a requisição para obter os jogos
        const response = await fetch(apiUrl, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Error obtaining matches:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
