import { getTurso } from '@/lib/turso';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/schema { code, data }
export async function POST(req: NextRequest) {
  try {
    const { code, data } = await req.json();
    if (!code || !data) {
      return NextResponse.json(
        { error: 'Missing code or data' },
        { status: 400 },
      );
    }
    await getTurso().execute(
      'INSERT OR REPLACE INTO schemas (code, data, created_at) VALUES (?, ?, datetime("now"))',
      [code, JSON.stringify(data)],
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving schema:', error);
    return NextResponse.json(
      { error: 'Failed to save schema' },
      { status: 500 },
    );
  }
}

// GET /api/schema?code=XXXXXX
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }
    const result = await getTurso().execute(
      'SELECT data FROM schemas WHERE code = ?',
      [code],
    );
    if (result.rows.length === 0 || !result.rows[0].data) {
      return NextResponse.json({ error: 'Schema not found' }, { status: 404 });
    }
    const row = result.rows[0];
    let parsed = null;
    try {
      const dataStr =
        typeof row.data === 'string' ? row.data : String(row.data ?? '{}');
      parsed = JSON.parse(dataStr);
    } catch {
      parsed = null;
    }
    return NextResponse.json({ data: parsed });
  } catch (error) {
    console.error('Error retrieving schema:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve schema' },
      { status: 500 },
    );
  }
}
