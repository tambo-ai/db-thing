import { NextRequest, NextResponse } from 'next/server';
import { generateDatabaseSchema } from '../genai/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, currentSchema } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 },
      );
    }

    const descriptionStr =
      typeof description === 'string' ? description : String(description);
    const result = await generateDatabaseSchema(descriptionStr, currentSchema);

    return NextResponse.json({ schema: result });
  } catch (error) {
    console.error('Error generating schema:', error);
    return NextResponse.json(
      { error: 'Failed to generate schema' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Hello Next.js API!' });
}
