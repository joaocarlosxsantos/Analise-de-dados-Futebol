import fetch from 'node-fetch';

const apiUrl = 'https://api.football-data.org/v4/competitions?areas=2032';
const apiKey = '0375969d79f74b60a0a9d73904aa1ee1';

export default async function(req, res) {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Extrair o valor de currentMatchday
        const currentMatchday = data.competitions[0]?.currentSeason?.currentMatchday;

        if (currentMatchday !== undefined) {
            res.status(200).json({ currentMatchday });
        } else {
            res.status(404).json({ error: 'currentMatchday not found' });
        }

    } catch (error) {
        console.error('Error fetching currentMatchday:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
