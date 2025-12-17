const tileSize = 0.577;

function hexPosition(q, r, y = 0) {
    const x = tileSize * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
    const z = tileSize * (1.5 * r);
    return [x, y, z];
}

function getRotation(dir) {
    const map = {
        N: 0,                        // 북쪽: +Z 방향 (기본 방향)
        S: Math.PI,                 // 남쪽: -Z 방향 (뒤로 보게 회전)
        E: -Math.PI / 2,            // 동쪽: -X 방향 (오른쪽 방향)
        W: Math.PI / 2,             // 서쪽: +X 방향 (왼쪽 방향)

        NE: -Math.PI / 3,           // 북동: ↗ 대각선 방향 (Z+ & X-)
        NW: Math.PI / 3,            // 북서: ↖ 대각선 방향 (Z+ & X+)
        SE: -Math.PI * 2 / 3,       // 남동: ↘ 대각선 방향 (Z- & X-)
        SW: Math.PI * 2 / 3,        // 남서: ↙ 대각선 방향 (Z- & X+)
    };
    return map[dir] ?? 0;
}

export {hexPosition, getRotation};