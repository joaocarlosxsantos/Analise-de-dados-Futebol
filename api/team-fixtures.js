// Últimos 2 resultados e próximos 2 jogos de um time.

import { getTeamMatches, setCache } from '../lib/footballData.js';

export default async function handler(req, res) {
    const { team } = req.query;

    if (!team) {
        return res.status(400).json({ error: 'Parâmetro "team" é obrigatório.' });
    }

    try {
        const [finished, scheduled] = await Promise.all([
            getTeamMatches(team, 'FINISHED', 5),
            getTeamMatches(team, 'SCHEDULED', 5)
        ]);

        const last = finished
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 2)
            .reverse();
        const next = scheduled.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 2);

        setCache(res, 600, 1200);
        res.status(200).json({ last, next });
    } catch (error) {
        console.error('Erro ao buscar jogos do time:', error);
        res.status(500).json({ error: 'Erro ao buscar os jogos do time.' });
    }
}
