import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { generateDatabaseSchema } from '../lib/gemini';
import { cors } from 'hono/cors';

export const config = {
  runtime: 'edge',
};

const app = new Hono({}).basePath('/api');
app.use('*', cors());

app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' });
});

app.post('/generate-schema', async (c) => {
  try {
    const body = await c.req.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));

    const { description, currentSchema } = body;

    console.log('Extracted description:', typeof description, description);
    console.log(
      'Extracted currentSchema:',
      typeof currentSchema,
      currentSchema,
    );

    if (!description) {
      return c.json({ error: 'Description is required' }, 400);
    }

    // Ensure description is a string
    const descriptionStr =
      typeof description === 'string' ? description : String(description);

    console.log('Final description to Gemini:', descriptionStr);

    const result = await generateDatabaseSchema(descriptionStr, currentSchema);

    return c.json({
      schema: result,
    });
  } catch (error) {
    console.error('Error generating schema:', error);
    return c.json({ error: 'Failed to generate schema' }, 500);
  }
});

export default handle(app);
