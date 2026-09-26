# Widget Service

A simple REST API for managing widgets.

## Requirements

- Node.js >= 16
- npm

## Installation

```bash
npm install
```

## Usage

Start the development server:

```bash
npm run serve
```

Run tests:

```bash
npm test
```

## Environment Variables

- `PORT` -- default is 3000
- `DEBUG` defaults to false
- `DATABASE_URL` is required. PostgreSQL connection string.
- `JWT_SECRET` -- required. Token signing key.

## API

### GET /health
Returns service health status.

### GET /widgets
Returns list of all widgets.

### POST /widgets/create
Creates a new widget.

### DELETE /widgets/:id
Deletes a widget by ID.
