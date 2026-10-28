const ExcelJS = require('exceljs');
const crypto = require('crypto');

const OWNER = 'Ogre3Dofficial';
const REPO = 'tippmix';
const BRANCH = 'main';
const FILE = 'tippmix.xlsx';

function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ''), 'utf8');
  const bb = Buffer.from(String(b || ''), 'utf8');
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

async function github(path, token, options = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `GitHub API hiba (${res.status})`);
  return data;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Csak POST kérés engedélyezett.' });
  }

  const expectedPassword = process.env.SAVE_PASSWORD;
  const token = process.env.GITHUB_TOKEN;
  if (!expectedPassword || !token) {
    return res.status(500).json({ error: 'A háttérszolgáltatás nincs teljesen beállítva. Ellenőrizd a Vercel GITHUB_TOKEN és SAVE_PASSWORD környezeti változóit.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  if (!safeEqual(body?.password, expectedPassword)) {
    return res.status(401).json({ error: 'Hibás mentési jelszó.' });
  }
  if (!Array.isArray(body?.bets) || body.bets.length > 5000) {
    return res.status(400).json({ error: 'Érvénytelen fogadáslista.' });
  }

  try {
    const path = `/repos/${OWNER}/${REPO}/contents/${FILE}?ref=${BRANCH}`;
    const remote = await github(path, token);
    const bytes = Buffer.from((remote.content || '').replace(/\n/g, ''), 'base64');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(bytes);
    const ws = workbook.getWorksheet('Tippmix napló');
    if (!ws) return res.status(500).json({ error: 'A munkafüzetből hiányzik a Tippmix napló munkalap.' });

    ws.getCell('J6').value = ws.getCell('J6').value || 'Meccs / esemény';
    ws.getCell('K6').value = ws.getCell('K6').value || 'Tipp / megjegyzés';
    const bets = body.bets.map(b => ({
      date: String(b.date || ''), stake: Number(b.stake), odds: Number(b.odds),
      result: ['Nyert', 'Veszített', 'Függőben', 'Void'].includes(b.result) ? b.result : 'Függőben',
      event: String(b.event || '').slice(0, 500), tip: String(b.tip || '').slice(0, 500)
    })).filter(b => /^\d{4}-\d{2}-\d{2}$/.test(b.date) && Number.isFinite(b.stake) && b.stake >= 0 && Number.isFinite(b.odds) && b.odds > 0)
      .sort((a, b) => a.date.localeCompare(b.date));

    const endRow = Math.max(ws.rowCount, 133, bets.length + 6);
    for (let r = 7; r <= endRow; r++) {
      for (let c = 3; c <= 11; c++) ws.getRow(r).getCell(c).value = null;
    }
    for (let i = 0; i < bets.length; i++) {
      const b = bets[i];
      const r = i + 7;
      const row = ws.getRow(r);
      if (r > 133) {
        const template = ws.getRow(7);
        template.eachCell({ includeEmpty: true }, (cell, col) => {
          row.getCell(col).style = JSON.parse(JSON.stringify(cell.style || {}));
          row.getCell(col).numFmt = cell.numFmt;
        });
      }
      const [year, month, day] = b.date.split('-').map(Number);
      row.getCell(3).value = new Date(Date.UTC(year, month - 1, day, 12));
      row.getCell(3).numFmt = 'yyyy.mm.dd';
      row.getCell(4).value = b.stake;
      row.getCell(5).value = b.odds;
      row.getCell(6).value = { formula: `IF(OR(E${r}="",D${r}=""),"",E${r}*D${r})` };
      row.getCell(7).value = b.result;
      row.getCell(8).value = { formula: `IF(G${r}="Nyert",F${r},0)` };
      row.getCell(9).value = { formula: `IF(G${r}="Nyert",H${r}-D${r},IF(G${r}="Veszített",-D${r},0))` };
      row.getCell(10).value = b.event;
      row.getCell(11).value = b.tip;
    }
    workbook.calcProperties = { ...(workbook.calcProperties || {}), fullCalcOnLoad: true, forceFullCalc: true, calcMode: 'auto' };
    const out = Buffer.from(await workbook.xlsx.writeBuffer());
    const updated = await github(`/repos/${OWNER}/${REPO}/contents/${FILE}`, token, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update Tippmix data from web app',
        content: out.toString('base64'),
        sha: remote.sha,
        branch: BRANCH
      })
    });
    return res.status(200).json({ ok: true, commit: updated.commit?.sha || null, count: bets.length });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Ismeretlen mentési hiba.' });
  }
};
