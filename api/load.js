const ExcelJS = require('exceljs');
const OWNER = 'Ogre3Dofficial';
const REPO = 'tippmix';
const BRANCH = 'main';
const FILE = 'tippmix.xlsx';
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Csak GET kérés engedélyezett.' }); }
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: 'Hiányzik a Vercel GITHUB_TOKEN környezeti változó.' });
  try {
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}?ref=${BRANCH}`, {
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'Cache-Control': 'no-cache' }
    });
    const remote = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(response.status).json({ error: remote.message || `GitHub API hiba (${response.status})` });
    const bytes = Buffer.from(String(remote.content || '').replace(/\n/g, ''), 'base64');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(bytes);
    const ws = workbook.getWorksheet('Tippmix napló');
    if (!ws) return res.status(500).json({ error: 'Hiányzik a Tippmix napló munkalap.' });
    const bets = [];
    for (let r = 7; r <= ws.rowCount; r++) {
      const dv = ws.getCell(r, 3).value;
      const stake = Number(ws.getCell(r, 4).value);
      const odds = Number(ws.getCell(r, 5).value);
      const rv = ws.getCell(r, 7).value;
      const result = String(rv && typeof rv === 'object' && 'result' in rv ? rv.result : rv || '').trim();
      if (!dv || !Number.isFinite(stake) || !Number.isFinite(odds) || odds <= 0) continue;
      let date = '';
      if (dv instanceof Date) date = `${dv.getUTCFullYear()}-${String(dv.getUTCMonth()+1).padStart(2,'0')}-${String(dv.getUTCDate()).padStart(2,'0')}`;
      else if (typeof dv === 'number') {
        const d = new Date(Date.UTC(1899, 11, 30) + Math.round(dv) * 86400000);
        date = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
      } else { const raw = String(dv).trim(); const m = raw.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})/); if (m) date = `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`; }
      if (!date) continue;
      const cellText = c => { const v = ws.getCell(r,c).value; return v == null ? '' : (typeof v === 'object' && 'text' in v ? v.text : String(v)); };
      bets.push({ id: `excel-${r}`, sourceRow: r, date, stake, odds, result: ['Nyert','Veszített','Függőben','Void'].includes(result) ? result : 'Függőben', event: cellText(10), tip: cellText(11) });
    }
    return res.status(200).json({ ok: true, bets, count: bets.length, sha: remote.sha });
  } catch (err) { return res.status(500).json({ error: err.message || 'Nem sikerült betölteni az Excelt.' }); }
};
