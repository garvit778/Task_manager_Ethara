CREATE TABLE "analytics_snapshots" (
  "id" TEXT NOT NULL,
  "project_id" TEXT NOT NULL,
  "project_title" TEXT NOT NULL,
  "total_tasks" INTEGER NOT NULL,
  "completed_tasks" INTEGER NOT NULL,
  "pending_tasks" INTEGER NOT NULL,
  "overdue_tasks" INTEGER NOT NULL,
  "completion_rate" DOUBLE PRECISION NOT NULL,
  "snapshot_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "analytics_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "analytics_snapshots_project_id_snapshot_at_idx" ON "analytics_snapshots"("project_id", "snapshot_at");

ALTER TABLE "analytics_snapshots" ADD CONSTRAINT "analytics_snapshots_project_id_fkey"
FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
