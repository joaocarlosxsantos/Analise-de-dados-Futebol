import fetch from 'node-fetch';

const apiUrl = 'https://api.football-data.org/v4/competitions/BSA/matches?dateFrom=2024-07-24&dateTo=2024-07-24&season=2024&status=TIMED,SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED';
const apiKey = '0375969d79f74b60a0a9d73904aa1ee1';

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

