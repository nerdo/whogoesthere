# Who Goes There?

A simple, sample app using SurrealDB as a backend.

## Prerequisites

* [pnpm](https://pnpm.io)
* [SurrealDB](https://surrealdb.com )
* [ngrok](https://ngrok.io) (optional)

## Quick Start

1. Run `pnpm install` to install dependencies.
2. Start the dev server with `pnpm dev`. This should concurrently start SurrealDB and the dev server.

## ngrok dev mode

To make the server publicly available in dev mode.

1. Run `pnpm install` to install dependencies.
3. Copy `.env.example` to `.env`. Edit...
   * `NGROK_AUTHTOKEN` - Your ngrok authentication token.
   * `NGROK_SUBDOMAIN` - A unique ngrok subdomain for your app to run on.
4. Start the dev server with `pnpm dev:ngrok`. This should start SurrealDB, ngrok, and the dev server concurrently.
5. Point your web browser to `https://NGROK_SUBDOMAIN.ngrok.io` where `NGROK_SUBDOMAIN` is the value you set in the `.env` file.
