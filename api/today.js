import fetch from 'node-fetch';

const apiUrl = 'https://api.football-data.org/v4/competitions/BSA/matches';
const apiKey = '0375969d79f74b60a0a9d73904aa1ee1';

export async function getTodayMatches(req, res) {
    const dateFrom = '2024-07-24';
    const dateTo = '2024-07-24';

    try {
        const response = await fetch(`${apiUrl}?dateFrom=${dateFrom}&dateTo=${dateTo}&season=2024&status=TIMED,SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED`, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching todays matches:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
