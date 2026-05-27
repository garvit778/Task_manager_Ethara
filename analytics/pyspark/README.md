# ProjectPilot PySpark Analytics

The main ProjectPilot SaaS application should not be converted entirely to PySpark. PySpark is best used as a separate data-processing layer for large-scale analytics, exports, or reporting.

Recommended AWS use:

- Keep the web app on React + Express.
- Keep operational data in Amazon RDS for PostgreSQL.
- Run PySpark analytics with AWS Glue.
- Export aggregated results to PostgreSQL `analytics_snapshots`, S3, or Redshift.

This integration writes project metrics into the application database:

```txt
analytics_snapshots
```

Required job environment variables:

```env
PROJECTPILOT_JDBC_URL=jdbc:postgresql://HOST:5432/DATABASE
PROJECTPILOT_DB_USER=USERNAME
PROJECTPILOT_DB_PASSWORD=PASSWORD
```

Run locally with PySpark:

```bash
spark-submit --packages org.postgresql:postgresql:42.7.4 analytics/pyspark/projectpilot_metrics_job.py
```

Example use cases:

- Team productivity snapshots
- Overdue task trend analysis
- Project completion forecasting
- Weekly executive reporting datasets
- Historical activity log aggregation
