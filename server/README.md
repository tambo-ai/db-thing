# Database Design Server

This server provides AI-powered database schema generation using Google's Gemini API.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up your Gemini API key:

```bash
export GEMINI_API_KEY=your_api_key_here
```

3. Start development server:

```bash
npm run start
```

## API Endpoints

### POST /api/generate-schema

Generate a database schema from a description.

**Request:**

```json
{
  "description": "A blog system with users, posts, and comments",
  "format": "sql" // or "json"
}
```

**Response:**

```json
{
  "schema": "CREATE TABLE users (...)",
  "format": "sql"
}
```

### POST /api/generate-custom

Generate custom database content with a specific prompt.

**Request:**

```json
{
  "prompt": "Create a migration script to add an index on the email column"
}
```

**Response:**

```json
{
  "result": "ALTER TABLE users ADD INDEX idx_email (email);"
}
```

## Gemini Functions

The server exports several utility functions:

- `generateDatabaseSchema(prompt)` - Basic schema generation
- `generateDatabaseSchemaFromDescription(description)` - SQL DDL from description
- `generateSchemaAsJSON(description)` - JSON schema output
- `generateWithStructuredOutput(prompt, schema)` - Structured responses

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)
