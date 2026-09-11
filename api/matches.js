// Jogos da rodada anterior, atual e seguinte do Brasileirão Série A.

import { getBsaCurrentMatchday, getBsaMatchesByMatchday, setCache } from '../lib/footballData.js';

export default async function handler(req, res) {
    try {
        const currentMatchday = await getBsaCurrentMatchday();

        if (!currentMatchday) {
            setCache(res, 3600);
            return res.status(200).json({
                started: false,
                message: 'Nenhuma rodada disponível: a temporada ainda não começou.'
            });
        }

        const [last, today, next] = await Promise.all([
            getBsaMatchesByMatchday(currentMatchday - 1),
            getBsaMatchesByMatchday(currentMatchday),
            getBsaMatchesByMatchday(currentMatchday + 1)
        ]);

        setCache(res, 600, 1200);
        res.status(200).json({ started: true, season: new Date().getFullYear(), last, today, next });
    } catch (error) {
        console.error('Erro ao buscar jogos do Brasileirão:', error);
        res.status(500).json({ error: 'Erro ao buscar os jogos do Brasileirão.' });
    }
}
