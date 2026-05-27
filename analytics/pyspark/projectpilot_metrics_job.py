import os
from uuid import uuid4

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, current_timestamp, lit, round, when


def main():
    spark = SparkSession.builder.appName("projectpilot-metrics").getOrCreate()

    jdbc_url = os.environ["PROJECTPILOT_JDBC_URL"]
    connection_properties = {
        "user": os.environ["PROJECTPILOT_DB_USER"],
        "password": os.environ["PROJECTPILOT_DB_PASSWORD"],
        "driver": "org.postgresql.Driver",
    }

    tasks = spark.read.jdbc(jdbc_url, '"Task"', properties=connection_properties)
    projects = spark.read.jdbc(jdbc_url, '"Project"', properties=connection_properties)

    snapshot_at = current_timestamp()

    metrics = (
        tasks.groupBy("projectId")
        .agg(
            count("*").alias("totalTasks"),
            count(when(col("status") == "COMPLETED", True)).alias("completedTasks"),
            count(when(col("status") != "COMPLETED", True)).alias("pendingTasks"),
            count(when((col("status") != "COMPLETED") & (col("dueDate") < current_timestamp()), True)).alias("overdueTasks"),
        )
        .join(projects.select(col("id").alias("projectId"), col("title")), "projectId")
        .withColumn("completionRate", round((col("completedTasks") / col("totalTasks")) * 100, 2))
        .withColumn("snapshotAt", snapshot_at)
    )

    rows = metrics.collect()
    output = spark.createDataFrame(
        [
            (
                str(uuid4()),
                row["projectId"],
                row["title"],
                int(row["totalTasks"]),
                int(row["completedTasks"]),
                int(row["pendingTasks"]),
                int(row["overdueTasks"]),
                float(row["completionRate"]),
                row["snapshotAt"],
            )
            for row in rows
        ],
        [
            "id",
            "project_id",
            "project_title",
            "total_tasks",
            "completed_tasks",
            "pending_tasks",
            "overdue_tasks",
            "completion_rate",
            "snapshot_at",
        ],
    )

    output.write.jdbc(
        jdbc_url,
        "analytics_snapshots",
        mode="append",
        properties=connection_properties,
    )

    output.show(truncate=False)
    spark.stop()


if __name__ == "__main__":
    main()
