# Redis Storage Migration POC - Setup Guide

## Prerequisites

Install the following before running the project:

* Node.js (v18 or later)
* Docker Desktop
* Git

---

## Clone the repository

```bash
git clone https://github.com/rijul-chaudhary/redis-storage-migration-poc
cd redis-migration-poc
```

---

## Install dependencies

```bash
npm install
```

---

## Create the environment file

Create a `.env` file in the project root using the contents of `.env.example`.

---

## Start Redis containers

```bash
docker compose up -d
```

Verify containers are running:

```bash
docker ps
```

You should see:

* redis-a
* redis-b
* redis-conflict

---

## Start the application

```bash
npm start
```

The server should start on:

```
http://localhost:3000
```

---

## Open the UI

Open your browser:

```
http://localhost:3000
```

The dashboard allows you to:

* Create, update and delete users in Redis A
* Create, update and delete users in Redis B
* Run Redis A → Redis B migration
* View migration conflicts
* View CDC conflicts
* Resolve detected conflicts
* View the current contents of both Redis instances

---

## Health Check

```
GET /health
```

Expected response:

```json
{
  "status": "UP",
  "redisA": "connected",
  "redisB": "connected",
  "redisConflict": "connected"
}
```

---

## If Redis is unavailable

Restart Docker Desktop if necessary, then run:

```bash
docker compose up -d
```

If containers already exist:

```bash
docker compose start
```

If required, restart the Node server:

```bash
npm start
```
