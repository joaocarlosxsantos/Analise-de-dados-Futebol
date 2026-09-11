// Tabela de classificação do Brasileirão Série A da temporada ATUAL.
// A football-data.org já devolve a temporada corrente sozinha (sem
// precisar fixar/calcular o ano), então o site atualiza a cada virada
// de ano sem nenhum código extra.

import { getBsaStandings, setCache } from '../lib/footballData.js';

export default async function handler(req, res) {
    try {
        const table = await getBsaStandings();

        if (!table || table.length === 0) {
            setCache(res, 3600);
            return res.status(200).json({
                started: false,
                message: 'A temporada atual do Brasileirão ainda não começou.'
            });
        }

        setCache(res, 1800, 3600);
        res.status(200).json({ started: true, season: new Date().getFullYear(), table });
    } catch (error) {
        console.error('Erro ao buscar tabela do Brasileirão:', error);
        res.status(500).json({ error: 'Erro ao buscar a tabela do Brasileirão.' });
    }
}
