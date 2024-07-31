import fetch from 'node-fetch';

const apiKey = '0375969d79f74b60a0a9d73904aa1ee1';

export default async function (req, res) {
    // Função para formatar a data no formato YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Obter a data atual
    const today = new Date();

    // Obter as datas dos próximos 3 dias
    const day1 = new Date(today);
    day1.setDate(today.getDate() + 1);
    const day3 = new Date(today);
    day3.setDate(today.getDate() + 3);

    const day1Formatted = formatDate(day1);
    const day3Formatted = formatDate(day3);

    // Construir a URL da API com as datas dos últimos 3 dias
    const apiUrl = `https://api.football-data.org/v4/competitions/BSA/matches?dateFrom=${day1Formatted}&dateTo=${day3Formatted}&season=2024&status=TIMED,SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED`;

    try {
        console.log(`Fetching data from URL: ${apiUrl}`); // Log para verificar a URL

        const response = await fetch(apiUrl, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching matches of the next 3 days:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
