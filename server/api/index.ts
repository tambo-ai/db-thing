import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { generateDatabaseSchema } from '../lib/gemini';

export const config = {
  runtime: 'edge',
};

const app = new Hono({}).basePath('/api');

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' });
});

app.post('/generate-schema', async (c) => {
  try {
    const { description, currentSchema } = await c.req.json();

    if (!description) {
      return c.json({ error: 'Description is required' }, 400);
    }

    const result = await generateDatabaseSchema(description, currentSchema);

    return c.json({
      schema: result,
    });
  } catch (error) {
    console.error('Error generating schema:', error);
    return c.json({ error: 'Failed to generate schema' }, 500);
  }
});

export default handle(app);
