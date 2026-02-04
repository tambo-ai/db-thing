import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;

function getAI() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return ai;
}

export const generateDatabaseSchema = async (
  description: string,
  currentSchema?: string,
) => {
  const prompt = `
Generate a comprehensive database schema for the following description:

${description}

${
  currentSchema
    ? `
Current existing schema (modify/extend this if provided):
${currentSchema}
`
    : ''
}

Please provide:
1. Table definitions with appropriate data types (including UUID, VARCHAR, INTEGER, BOOLEAN, TIMESTAMP, TEXT, etc.)
2. Primary and foreign key relationships
3. Any constraints or validations needed

Return as JSON with the following structure:
- tables: array of table objects
- Each table should have:
  - name: string (table name)
  - columns: array of column objects
- Each column should have:
  - name: string (column name)
  - type: string (data type like 'UUID', 'VARCHAR(255)', 'INTEGER', 'BOOLEAN', 'TIMESTAMP', 'TEXT', etc.)
  - nullable: boolean (can be null)
  - defaultValue: string (optional default value)
  - isPrimaryKey: boolean (is primary key)
  - isUnique: boolean (has unique constraint)
  - foreignKey: object with table and column properties (if it's a foreign key)

Make sure to use these exact property names: isPrimaryKey (not primaryKey), isUnique, defaultValue, etc.
`;

  const schema = {
    type: 'object',
    properties: {
      tables: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            columns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  nullable: { type: 'boolean' },
                  defaultValue: { type: 'string' },
                  isPrimaryKey: { type: 'boolean' },
                  isUnique: { type: 'boolean' },
                  foreignKey: {
                    type: 'object',
                    properties: {
                      table: { type: 'string' },
                      column: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  try {
    console.log('Generating database schema with Gemini AI...');
    const response = await getAI().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseSchema: schema,
      },
    });

    const responseText = response.text;
    console.log('Raw response:', responseText);

    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    // Clean up the response text to extract just the JSON
    let cleanedJson = responseText;

    // Remove markdown code blocks if present
    cleanedJson = cleanedJson.replace(/```json\s*/, '').replace(/```\s*$/, '');

    // Remove any extra whitespace
    cleanedJson = cleanedJson.trim();

    // Parse and return as JSON object
    try {
      const parsedSchema = JSON.parse(cleanedJson);
      console.log('Successfully parsed schema:', parsedSchema);
      return parsedSchema;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Cleaned response text:', cleanedJson);
      throw new Error('Failed to parse generated schema as JSON');
    }
  } catch (error) {
    console.error('Error generating database schema:', error);
    throw new Error('Failed to generate database schema');
  }
};
