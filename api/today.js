import fetch from 'node-fetch';

const apiKey = '0375969d79f74b60a0a9d73904aa1ee1';
// Função para formatar a data no formato YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Obter a data atual
const today = new Date();
const todayFormatted = formatDate(today);

// Construir a URL da API com a data atual
const apiUrl = `https://api.football-data.org/v4/competitions/BSA/matches?dateFrom=${todayFormatted}&dateTo=${todayFormatted}&season=2024&status=TIMED,SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED`;


export default async function (req, res) {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching matchs of today:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

