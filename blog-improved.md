DB Thing is a chat-based developer tool for designing and visualizing databases in natural language.

## How I built it and key decisions:

This uses a combination of the Gemini 2.5 Flash LLM and Tambo, a UI orchestration framework (more on this in a bit), along with some clever ✨prompt engineering✨.

### Why Gemini 2.5 Flash?

I chose Gemini 2.5 Flash because of four main reasons: it's fast, free (kind of), ACTUALLY good and has a nice SDK. Since this is a tool that requires generating a structured response, data consistency is not negotiable and the SDK has just the right feature for that - ✨structured output.✨

First, I tell it what to do in a detailed prompt:

```typescript
const prompt = `
Generate a comprehensive database schema for the following description:

${description}

${currentSchema ? `
Current existing schema (modify/extend this if provided):
${currentSchema}` : ''}

Please provide:
1. Table definitions with appropriate data types
2. Primary and foreign key relationships
3. Any constraints or validations needed
`;
```

Then tell it EXACTLY how to output it using a JSON schema:

```typescript
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

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: {
    responseSchema: schema,  // Magic happens here ✨
  },
});
```

This structured output feature is a lifesaver. It ensures data consistency every. single. time. No more dealing with malformed JSON or missing fields that break your UI. The LLM literally cannot respond in any other format.

### Enter Tambo: The UI Orchestrator

Speaking of UI…enter Tambo - a UI orchestration framework that handles the entire chat experience.

Here's what Tambo does for me:

**1. Tool Registration & Execution**

I register database design tools (like `getDatabaseSchema`, `analyzeSchema`, `generateMigration`) with their Zod schemas, and Tambo handles calling them at the right time:

```typescript
export const tools: TamboTool[] = [
  {
    name: 'getDatabaseSchema',
    description: 'Generate a database schema from natural language...',
    tool: getDatabaseSchemaForTool,
    toolSchema: z.function()
      .args(z.object({
        description: z.string(),
        currentSchema: z.string().optional(),
      }))
      .returns(z.array(...)), // Full schema structure
  },
  // + 4 more tools for analysis, migration, validation, optimization
];
```

The AI decides which tool to use based on what the user asks for. Want to "analyze my schema for issues"? Tambo calls `analyzeSchema`. Want to "add a comments table"? It calls `generateMigration` with your current schema. All automatic.

**2. Context Management**

I wrap the app in Tambo providers that maintain conversation state and schema data:

```typescript
<TamboProvider
  apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
  components={components}
  tools={tools}
>
  <MessageThreadFull contextKey='database-design-tool' />
</TamboProvider>
```

That `contextKey` keeps each conversation thread separate with its own history and context. Schema updates are synchronized across the chat and visualization components through a callback system.

**3. Component Rendering**

I also register visual components that Tambo can render dynamically based on the conversation:

```typescript
export const components: TamboComponent[] = [
  {
    name: 'Graph',
    description: 'Renders charts for database metrics and stats',
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: 'DataCard',
    description: 'Displays database objects as clickable cards',
    component: DataCard,
    propsSchema: dataCardSchema,
  },
];
```

The AI can decide to show a graph of table relationships or display schema details as cards, all without me writing conditional rendering logic.

### The Diagram Magic

Now for the coolest part - the interactive ER diagrams. I use ReactFlow to turn the schema JSON into a visual graph.

Here's how it works:

**1. Node Generation**

Each table becomes a custom node with all its columns displayed:

```typescript
const tableNodes = tables.map((table, index) => ({
  id: table.name,
  type: 'tableNode',
  position: calculateSmartPosition(table, index, totalTables),
  data: {
    label: table.name,
    columns: table.columns,
  },
}));
```

The position calculation uses a grid layout that spreads tables evenly across the canvas - no overlapping mess.

**2. Relationship Edges**

Foreign keys become animated edges connecting the tables:

```typescript
tables.forEach((table) => {
  table.columns.forEach((column) => {
    if (column.foreignKey) {
      relationEdges.push({
        id: `${table.name}-${column.name}-${column.foreignKey.table}`,
        source: table.name,
        target: column.foreignKey.table,
        sourceHandle: `${table.name}-${column.name}-source`,
        targetHandle: `${column.foreignKey.table}-${column.foreignKey.column}-target`,
        animated: true,  // Animated dashed lines ✨
        label: `${column.name} → ${column.foreignKey.column}`,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    }
  });
});
```

Each foreign key column gets a handle (connection point), and edges automatically connect from foreign key to primary key with labeled arrows showing the relationship.

**3. Visual Indicators**

Primary keys get 🔑, foreign keys get 🔗, and nullable fields get marked with `*`. The diagram updates in real-time as you modify the schema through chat.

### The Result

Using Tambo was a no-brainer because it eliminates a lot of manual work and repetition, ✨reinventing the wheel✨ as they call it. Chat interface, streaming responses, tool orchestration, data validation, UI rendering, and context management - all in one nice Tambo SDK. This saved me hours (probably days) of building chat infrastructure from scratch.

The combination of Gemini's structured output guaranteeing perfect data + Tambo's tool orchestration + ReactFlow's interactive diagrams = a smooth database design experience where you just chat naturally and watch your schema come to life.

### BONUS: Code Generation for Your Favorite ORMs

Here's the cherry on top - once you have your schema designed, why make you write all the boilerplate code yourself? I built generators that convert the schema JSON into ready-to-use code for three popular database tools:

**Prisma Schema**

The Prisma generator converts tables into models with proper type mappings, relations, and decorators:

```typescript
const prismaTypeMap = {
  SERIAL: 'Int',
  INTEGER: 'Int',
  VARCHAR: 'String',
  UUID: 'String',
  TIMESTAMP: 'DateTime',
};

// Generates something like:
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  createdAt DateTime @default(now())
  posts     Post[]
}
```

It handles relations, composite keys, field mappings, and even converts snake_case to camelCase automatically.

**Drizzle ORM**

For Drizzle fans, it generates type-safe schema definitions with the chainable API:

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

Foreign keys become `.references()`, composite keys get handled with `primaryKey()`, and all imports are automatically collected.

**Raw SQL**

Need pure SQL for migrations or direct database setup? It generates clean CREATE TABLE statements:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);
```

Complete with foreign key constraints, defaults, and all the proper syntax.

All three generators work from the same schema data structure that Gemini produces. No manual translation needed - design your database in chat, pick your ORM, copy the generated code, and you're ready to go. ✨
