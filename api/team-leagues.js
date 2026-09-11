// Lista os campeonatos que um clube está disputando atualmente.
// No plano grátis da football-data.org, só o Brasileirão Série A está
// disponível — então, pra qualquer time encontrado na busca (que já é
// scoped à Série A), a resposta é sempre essa única competição.

import { getBsaTeams, setCache, BSA_CODE } from '../lib/footballData.js';

export default async function handler(req, res) {
    const teamId = req.query.team;

    if (!teamId) {
        return res.status(400).json({ error: 'Parâmetro "team" é obrigatório.' });
    }

    try {
        const teams = await getBsaTeams();
        const pertence = teams.some((t) => String(t.id) === String(teamId));

        const leagues = pertence
            ? [
                  {
                      id: BSA_CODE,
                      name: 'Brasileirão Série A',
                      type: 'League',
                      season: new Date().getFullYear()
                  }
              ]
            : [];

        setCache(res, 3600, 7200);
        res.status(200).json({ leagues });
    } catch (error) {
        console.error('Erro ao buscar campeonatos do time:', error);
        res.status(500).json({ error: 'Erro ao buscar campeonatos do time.' });
    }
}
