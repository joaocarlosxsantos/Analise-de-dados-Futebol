// Busca de clubes por nome, pro autocomplete da tela "Meu Clube".
// A football-data.org não tem endpoint de busca por nome no plano
// grátis, então mantemos em cache a lista de times do Brasileirão Série
// A (o único campeonato brasileiro coberto) e filtramos aqui.

import { getBsaTeams, setCache } from '../lib/footballData.js';

export default async function handler(req, res) {
    const q = (req.query.q || '').toString().trim().toLowerCase();

    if (q.length < 3) {
        return res.status(200).json({ teams: [], message: 'Digite ao menos 3 letras para buscar.' });
    }

    try {
        const teams = await getBsaTeams();
        const encontrados = teams.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 12);

        setCache(res, 3600, 7200);
        res.status(200).json({ teams: encontrados });
    } catch (error) {
        console.error('Erro ao buscar times:', error);
        res.status(500).json({ error: 'Erro ao buscar times.' });
    }
}
