import fetch from 'node-fetch';

const apiKey = '0375969d79f74b60a0a9d73904aa1ee1';

export default async function (req, res) {
    try {
        // Obter matchday a partir dos parâmetros de consulta na URL
        const matchday = req.query.matchday || 20; // Default para 20 se não fornecido

        // Construir a URL dinamicamente com o matchday
        const apiUrl = `https://api.football-data.org/v4/competitions/BSA/matches?matchday=${matchday}&season=2024&status=TIMED,SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED`;

        // Fazer a requisição
        const response = await fetch(apiUrl, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Error para obter jogos da rodada atual:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
