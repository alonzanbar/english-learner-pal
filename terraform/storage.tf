# GCS bucket for uploaded word-list CSV files.
# Cloud Run (default compute SA) gets objectAdmin on this bucket via IAM below.
resource "google_storage_bucket" "wordlists" {
  name     = "${var.project_id}-wordlists-${var.environment}"
  location = var.region
  project  = var.project_id

  depends_on = [google_project_service.storage]
}

# Allow the Cloud Run service (default compute SA) to read/write objects.
resource "google_storage_bucket_iam_member" "backend_admin" {
  bucket = google_storage_bucket.wordlists.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${data.google_project.current.number}-compute@developer.gserviceaccount.com"
}
