# AWS Deployment Guide

This project should be deployed on AWS as a normal full-stack SaaS app. PySpark can be added as a separate analytics pipeline, but it should not replace the React frontend or Express backend.

## Recommended AWS Architecture

- Frontend: AWS Amplify Hosting
- Backend API: AWS App Runner
- Database: Amazon RDS for PostgreSQL
- File uploads: Amazon S3
- Secrets: AWS Secrets Manager or App Runner environment variables
- Optional analytics: AWS Glue PySpark jobs

## 1. Deploy PostgreSQL On Amazon RDS

Create an Amazon RDS PostgreSQL database.

Save these values:

- Host
- Port
- Database name
- Username
- Password

Your backend `DATABASE_URL` should look like:

```env
postgresql://USERNAME:PASSWORD@RDS_HOST:5432/DATABASE_NAME?schema=public
```

## 2. Deploy Backend On AWS App Runner

Use App Runner for the Express API.

Recommended source:

- Repository: GitHub repo
- Branch: `main`
- Source directory: `server`

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run start
```

Environment variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://USERNAME:PASSWORD@RDS_HOST:5432/DATABASE_NAME?schema=public
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://YOUR_AMPLIFY_DOMAIN
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=250
INVITATION_FROM_EMAIL=no-reply@projectpilot.dev
```

After deployment, test:

```txt
https://YOUR_APP_RUNNER_DOMAIN/api/health
```

## 3. Seed Demo Data

Run the seed command from a one-off shell, CI job, or local machine pointed at the RDS database:

```bash
npm run seed --workspace server
```

## 4. Deploy Frontend On AWS Amplify

Use Amplify Hosting.

Recommended source:

- Repository: GitHub repo
- Branch: `main`
- App root: `client`

Amplify can use `client/amplify.yml`.

Environment variables:

```env
VITE_API_URL=https://YOUR_APP_RUNNER_DOMAIN/api
VITE_SOCKET_URL=https://YOUR_APP_RUNNER_DOMAIN
```

After deployment, update the backend `CLIENT_URL` to your Amplify domain and redeploy the backend.

## 5. Optional PySpark Analytics On AWS Glue

Use AWS Glue for PySpark jobs if you want big-data analytics over project/task activity.

The sample job lives at:

```txt
analytics/pyspark/projectpilot_metrics_job.py
```

This is integrated with the production web app through the `analytics_snapshots` table:

1. AWS Glue reads `Project` and `Task` data from PostgreSQL.
2. The PySpark job writes aggregate rows into `analytics_snapshots`.
3. The backend exposes them at:

```txt
GET /api/analytics/snapshots
```

4. The dashboard displays the latest snapshots in the PySpark analytics section.

Glue job environment variables:

```env
PROJECTPILOT_JDBC_URL=jdbc:postgresql://RDS_HOST:5432/DATABASE_NAME
PROJECTPILOT_DB_USER=USERNAME
PROJECTPILOT_DB_PASSWORD=PASSWORD
```

Glue job dependency:

```txt
org.postgresql:postgresql:42.7.4
```

## Official AWS References

- AWS App Runner: https://docs.aws.amazon.com/apprunner/
- App Runner source code services: https://docs.aws.amazon.com/apprunner/latest/dg/service-source-code.html
- Amazon RDS PostgreSQL: https://aws.amazon.com/rds/postgresql/
- AWS Glue PySpark: https://docs.aws.amazon.com/glue/latest/dg/spark_and_pyspark.html
