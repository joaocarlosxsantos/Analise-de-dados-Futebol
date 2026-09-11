// Servidor para rodar o site localmente (npm start).
// Em produção (Vercel) esse arquivo não é usado — a Vercel serve
// cada arquivo de api/*.js como função serverless e public/ como
// estático automaticamente (zero-config).

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import standingsHandler from './api/standings.js';
import matchesHandler from './api/matches.js';
import teamSearchHandler from './api/team-search.js';
import teamLeaguesHandler from './api/team-leagues.js';
import leagueTableHandler from './api/league-table.js';
import teamFixturesHandler from './api/team-fixtures.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/api/standings', standingsHandler);
app.get('/api/matches', matchesHandler);
app.get('/api/team-search', teamSearchHandler);
app.get('/api/team-leagues', teamLeaguesHandler);
app.get('/api/league-table', leagueTableHandler);
app.get('/api/team-fixtures', teamFixturesHandler);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
