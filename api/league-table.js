// Tabela de classificação do campeonato. Hoje só existe o formato
// "League" (Brasileirão Série A) nessa fonte de dados — sem mata-mata
// coberto no plano grátis —, mas a resposta mantém o mesmo formato
// {format, ...} usado no front-end pra facilitar adicionar mais
// competições no futuro.

import { getBsaStandings, setCache } from '../lib/footballData.js';

export default async function handler(req, res) {
    const { league } = req.query;

    if (!league) {
        return res.status(400).json({ error: 'Parâmetro "league" é obrigatório.' });
    }

    try {
        const table = await getBsaStandings();
        setCache(res, 1800, 3600);
        res.status(200).json({ format: 'table', groups: [table] });
    } catch (error) {
        console.error('Erro ao buscar tabela do campeonato:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do campeonato.' });
    }
}
