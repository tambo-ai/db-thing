# Database Design Tool

An AI-powered database design and visualization tool built with Next.js and Tambo AI. Create, visualize, and optimize database schemas through natural language conversations.

## Features

- **Natural Language Schema Design** - Describe your database requirements in plain English and get a complete schema
- **Interactive ERD Visualization** - Visual entity relationship diagrams with drag-and-drop support using ReactFlow
- **Multi-Format Code Generation** - Export schemas as SQL, Prisma, or Drizzle ORM code
- **Schema Sharing** - Generate shareable URLs to share your database designs with others
- **AI-Powered Analysis** - Get optimization suggestions, validation, and migration planning
- **MCP Support** - Model Context Protocol integration for extended AI capabilities
- **Resizable Chat Interface** - Adjustable sidebar width for comfortable workflow

## Get Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then add your API keys:
   - `NEXT_PUBLIC_TAMBO_API_KEY` - Get from [tambo.co/dashboard](https://tambo.co/dashboard)
   - `GEMINI_API_KEY` - Get from [Google AI Studio](https://aistudio.google.com/apikey)
   - `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` - Get from [Turso](https://turso.tech/app) (for schema sharing)

4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [localhost:3200](http://localhost:3200) and start designing!

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tambo AI SDK** for AI-powered interactions
- **ReactFlow** for interactive ERD diagrams
- **Gemini AI** for schema generation
- **Turso** (LibSQL) for schema persistence
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations

## AI Tools

The application provides several AI-powered tools for database design:

| Tool | Description |
|------|-------------|
| `getDatabaseSchema` | Generate a complete schema from a natural language description |
| `analyzeSchema` | Analyze existing schemas for issues and optimization opportunities |
| `generateMigration` | Create migration scripts based on schema change requirements |
| `validateSchema` | Check schemas for consistency and referential integrity |
| `optimizeSchema` | Improve schemas for performance and maintainability |

## Code Generation

Export your schema in multiple formats:

- **SQL** - Standard DDL statements with CREATE TABLE, constraints, and foreign keys
- **Prisma** - Complete Prisma schema file with models and relations
- **Drizzle** - TypeScript Drizzle ORM schema with proper types and references

## Example Prompts

Try these prompts to get started:

- "Create a blog database with users, posts, and comments"
- "Design an e-commerce schema with products, orders, and customers"
- "Add a ratings table that references users and products"
- "Optimize my schema for better query performance"
- "Add soft delete support to all tables"

## Project Structure

```
src/
├── app/
│   ├── chat/           # Main chat interface
│   ├── schema/[code]/  # Shared schema viewer
│   └── api/            # API routes for schema generation
├── components/
│   ├── tambo/          # Chat and message components
│   ├── schema-viewer   # Schema visualization and code tabs
│   └── ui/             # Reusable UI components
├── lib/
│   ├── tambo.ts        # Component and tool registration
│   ├── generators/     # SQL, Prisma, Drizzle code generators
│   ├── schema-tools.ts # AI tool implementations
│   └── types.ts        # TypeScript type definitions
└── services/           # Business logic services
```

## Development

```bash
npm run dev       # Start development server on port 3200
npm run build     # Build for production
npm run lint      # Run ESLint
npm run lint:fix  # Fix linting issues
```

## License

MIT

---

For more information about Tambo AI, visit [docs.tambo.co](https://docs.tambo.co).
