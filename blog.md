DB Thing is a chat-based developer tool for designing and visualizing databases in natural language.

## How I built it and key decisions:

This uses a combination of the Gemini 2.5 Flash LLM and Tambo, a UI orchestration framework (more on this in a bit), along with some clever ✨prompt engineering✨.

I chose Gemini 2.5 Flash because of four main reasons; it’s fast, free (kind of), ACTUALLY good and has a nice SDK. Since this is a tool that requires generating a structured response, data consistency is not negotiable and the SDK has just the right feature for that - ✨structured output.✨

First, I tell it what to do:

```
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
```

Then tell it how to output it:

```tsx
const schema = {
  type: "object",
  properties: {
    tables: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          columns: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: { type: "string" },
                nullable: { type: "boolean" },
                defaultValue: { type: "string" },
                isPrimaryKey: { type: "boolean" },
                isUnique: { type: "boolean" },
                foreignKey: {
                  type: "object",
                  properties: {
                    table: { type: "string" },
                    column: { type: "string" },
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
```

This ensures data consistency every, single, time. So nothing is messed up in the UI due to lack of the right parameters.

Speaking of UI…enter Tambo - a UI orchestration framework.

It provides a chat interface that makes sure my chat app calls the correct tool for different tasks (only database schema generation in this case) and renders the right UI elements for the right datasets.

Using this was a no-brainer because it eliminates a lot of manual work and repition, ✨reinventing the wheel✨ as they call it. Chat, streaming response, data validation, UI rendering and tool calls, all in once nice Tambo SDK. This saved me hours of manual work.
