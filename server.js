import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;  // Vercel irá definir automaticamente a porta

const apiUrl = 'https://api.football-data.org/v4/competitions/BSA/standings?season=2024';
const apiKey = '0375969d79f74b60a0a9d73904aa1ee1';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/standings', async (req, res) => {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/games.html', (req, res) => {
    res.sendFile(__dirname + '/public/games.html');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
