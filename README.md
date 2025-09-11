# Database Design Tool

An AI-powered database design and visualization tool built with Next.js and Tambo AI. Create, visualize, and optimize database schemas through natural language conversations.

## Features

- 🗃️ Interactive database schema design
- 🎨 Visual ERD (Entity Relationship Diagram) generation
- 🤖 AI-powered schema optimization suggestions
- 📊 Database performance insights
- 🔄 Schema migration planning
- 📝 Automatic documentation generation

## Get Started

1. Clone this repository
2. `npm install`
3. `npx tambo init`
   - or rename `example.env.local` to `.env.local` and add your tambo API key you can get for free [here](https://tambo.co/dashboard).
4. Run `npm run dev` and go to `localhost:3200` to start designing databases!

## How It Works

### Database Design Components

The tool provides specialized components for database design:

```tsx
const components: TamboComponent[] = [
  {
    name: 'ERDiagram',
    description:
      'A component that renders database entity relationship diagrams with tables, relationships, and constraints visualization.',
    component: ERDiagram,
    propsSchema: z.object({
      tables: z.array(
        z.object({
          name: z.string(),
          columns: z.array(
            z.object({
              name: z.string(),
              type: z.string(),
              nullable: z.boolean().optional(),
              primaryKey: z.boolean().optional(),
              foreignKey: z.string().optional(),
            }),
          ),
        }),
      ),
      relationships: z.array(
        z.object({
          from: z.string(),
          to: z.string(),
          type: z.enum(['one-to-one', 'one-to-many', 'many-to-many']),
        }),
      ),
    }),
  },
  // Add more database design components here!
];
```

### Database Design Tools

```tsx
export const tools: TamboTool[] = [
  {
    name: 'analyzeSchema',
    description:
      'Analyze database schema for performance bottlenecks, normalization issues, and optimization opportunities',
    tool: analyzeSchema,
    toolSchema: z.function().args(
      z.object({
        schema: z.object({
          tables: z.array(z.any()),
          relationships: z.array(z.any()),
        }),
      }),
    ),
  },
  {
    name: 'generateMigration',
    description: 'Generate SQL migration scripts for schema changes',
    tool: generateMigration,
    toolSchema: z.function().args(
      z.object({
        oldSchema: z.any(),
        newSchema: z.any(),
        dbType: z.enum(['postgresql', 'mysql', 'sqlite']),
      }),
    ),
  },
];
```

### Setting Up the Database Design Tool

Make sure the TamboProvider is configured for database design in your app:

```tsx
...
<TamboProvider
  apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
  components={components} // Database design components
  tools={tools} // Schema analysis and generation tools
>
  {children}
</TamboProvider>
```

In this example we do this in the `Layout.tsx` file, but you can do it anywhere in your app that is a client component.

### Displaying Database Designs

The database components are shown alongside the AI response, but you can display schemas wherever you like by accessing the latest thread message's `renderedComponent` field:

```tsx
const { thread } = useTambo();
const latestComponent =
  thread?.messages[thread.messages.length - 1]?.renderedComponent;

return (
  <div>
    {latestComponent && (
      <div className='database-schema-container'>{latestComponent}</div>
    )}
  </div>
);
```

## Example Prompts

Try these prompts to get started with database design:

- "Design a database schema for an e-commerce platform"
- "Create an ERD for a blog system with users, posts, and comments"
- "Analyze this schema for performance issues: [paste your schema]"
- "Generate a migration script to add user roles to my existing user table"
- "Design a many-to-many relationship between products and categories"

For more detailed documentation, visit [Tambo's official docs](https://docs.tambo.co).
