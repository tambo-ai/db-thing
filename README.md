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
   - `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` - Get from [Turso](https://turso.tech/app) (for schema sharing)

4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [localhost:3200](http://localhost:3200) and start designing!

## Tech Stack

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tambo AI SDK** for AI-powered schema streaming
- **ReactFlow** for interactive ERD diagrams
- **Turso** (LibSQL) for schema persistence
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations

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
│   └── api/            # API routes (schema sharing)
├── components/
│   ├── tambo/          # SchemaCanvas, SchemaDiagram, TableNode, chat components
│   ├── schema-viewer   # Schema visualization and code tabs
│   └── ui/             # Reusable UI components
├── lib/
│   ├── tambo.ts        # Component registration
│   ├── schema-context  # Shared schema state provider
│   ├── generators/     # SQL, Prisma, Drizzle code generators
│   └── types.ts        # TypeScript type definitions
```

## Development

```bash
npm run dev       # Start development server on port 3200
npm run build     # Build for production
npm run lint      # Run ESLint
npm run lint:fix  # Fix linting issues
```

## Credits

Created by [Akinkunmi](https://akinkunmi.dev/) ([@akinkunmi](https://x.com/akinkunmi) · [GitHub](https://github.com/akinloluwami))

## License

MIT

---

For more information about Tambo AI, visit [docs.tambo.co](https://docs.tambo.co).
