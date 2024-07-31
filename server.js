import express from 'express';
import { getLast3DaysMatches } from './api/last.js';
import { getTodayMatches } from './api/today.js';
import { getNext3DaysMatches } from './api/next.js';

const app = express();
const port = process.env.PORT || 3000;  // Vercel irá definir automaticamente a porta

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// API routes
app.get('/api/standings', async (req, res) => {
    try {
        const response = await fetch('https://api.football-data.org/v4/competitions/BSA/standings?season=2024', {
            headers: {
                'X-Auth-Token': '0375969d79f74b60a0a9d73904aa1ee1'
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching standings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/last', async (req, res) => {
    try {
        getLast3DaysMatches
    } catch (error) {
        console.error('Error fetching last 3 days matches:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/today', async (req, res) => {
    try {
        const response = await fetch('https://api.football-data.org/v4/competitions/BSA/matches?dateFrom=2024-07-24&dateTo=2024-07-24&season=2024&status=TIMED,SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED', {
            headers: {
                'X-Auth-Token': '0375969d79f74b60a0a9d73904aa1ee1'
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching today\'s matches:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/next', async (req, res) => {
    try {
        const response = await fetch('https://api.football-data.org/v4/competitions/BSA/matches?dateFrom=2024-07-25&dateTo=2024-07-27&season=2024&status=TIMED,SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED', {
            headers: {
                'X-Auth-Token': '0375969d79f74b60a0a9d73904aa1ee1'
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching next 3 days matches:', error);
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
