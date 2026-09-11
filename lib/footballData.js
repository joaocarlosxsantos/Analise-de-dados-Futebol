// Camada de acesso à football-data.org v4 — a fonte original do projeto,
// oficial e documentada. Cobertura limitada no plano grátis (12
// competições; do Brasil, só o Brasileirão Série A), mas com dados da
// temporada ATUAL de verdade e sem os problemas das outras fontes que
// testamos (API-Football não libera a temporada atual no grátis; a API
// não-oficial do ESPN não é confiável o bastante pra depender dela).

const BASE_URL = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_DATA_KEY;

export const BSA_CODE = 'BSA'; // Campeonato Brasileiro Série A

const cache = new Map();
const inflight = new Map();

async function footballDataFetch(path, ttlSeconds = 300) {
    if (!API_KEY) {
        throw new Error(
            'FOOTBALL_DATA_KEY não configurada. Defina a variável de ambiente com sua chave da football-data.org.'
        );
    }

    const cached = cache.get(path);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.data;
    }
    if (inflight.has(path)) {
        return inflight.get(path);
    }

    const promise = (async () => {
        const response = await fetch(BASE_URL + path, {
            headers: { 'X-Auth-Token': API_KEY }
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`football-data.org respondeu ${response.status} para ${path}: ${text}`);
        }

        const data = await response.json();
        cache.set(path, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
        return data;
    })();

    inflight.set(path, promise);
    try {
        return await promise;
    } finally {
        inflight.delete(path);
    }
}

export const TTL = {
    MATCHDAY_LOOKUP: 6 * 60 * 60,
    STANDINGS: 30 * 60,
    MATCHES: 10 * 60,
    TEAMS: 12 * 60 * 60
};

function mapStandingsRow(row) {
    return {
        rank: row.position,
        team: { id: row.team.id, name: row.team.name, logo: row.team.crest },
        points: row.points,
        goalsDiff: row.goalDifference,
        form: row.form,
        all: {
            played: row.playedGames,
            win: row.won,
            draw: row.draw,
            lose: row.lost,
            goals: { for: row.goalsFor, against: row.goalsAgainst }
        }
    };
}

// Tabela de classificação atual do Brasileirão Série A. Sem parâmetro de
// "season": a API já devolve a temporada corrente sozinha.
export async function getBsaStandings() {
    const data = await footballDataFetch(`/competitions/${BSA_CODE}/standings`, TTL.STANDINGS);
    const table = data.standings?.find((s) => s.type === 'TOTAL')?.table || data.standings?.[0]?.table || [];
    return table.map(mapStandingsRow);
}

export async function getBsaCurrentMatchday() {
    const data = await footballDataFetch(`/competitions/${BSA_CODE}`, TTL.MATCHDAY_LOOKUP);
    return data.currentSeason?.currentMatchday ?? null;
}

function mapMatch(match) {
    const winner = match.score?.winner;
    return {
        id: match.id,
        date: match.utcDate,
        status: match.status,
        round: match.matchday ? `Rodada ${match.matchday}` : null,
        home: {
            id: match.homeTeam?.id,
            name: match.homeTeam?.name,
            logo: match.homeTeam?.crest,
            winner: winner === 'HOME_TEAM'
        },
        away: {
            id: match.awayTeam?.id,
            name: match.awayTeam?.name,
            logo: match.awayTeam?.crest,
            winner: winner === 'AWAY_TEAM'
        },
        goals: {
            home: match.score?.fullTime?.home ?? null,
            away: match.score?.fullTime?.away ?? null
        }
    };
}

export async function getBsaMatchesByMatchday(matchday) {
    if (!matchday) return [];
    const data = await footballDataFetch(
        `/competitions/${BSA_CODE}/matches?matchday=${matchday}`,
        TTL.MATCHES
    );
    return (data.matches || []).map(mapMatch);
}

export async function getBsaTeams() {
    const data = await footballDataFetch(`/competitions/${BSA_CODE}/teams`, TTL.TEAMS);
    return (data.teams || []).map((t) => ({ id: t.id, name: t.name, logo: t.crest, country: 'Brasil' }));
}

export async function getTeamMatches(teamId, status, limit = 5) {
    const data = await footballDataFetch(
        `/teams/${teamId}/matches?status=${status}&limit=${limit}`,
        TTL.MATCHES
    );
    return (data.matches || []).map(mapMatch);
}

export function setCache(res, seconds, staleSeconds) {
    const stale = staleSeconds ?? seconds * 2;
    res.setHeader('Cache-Control', `public, s-maxage=${seconds}, stale-while-revalidate=${stale}`);
}
