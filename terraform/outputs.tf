output "backend_url" {
  description = "Cloud Run service URL for the word-list API"
  value       = google_cloud_run_v2_service.backend.uri
}

output "artifact_registry_repository" {
  description = "Artifact Registry repo for backend Docker images"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.backend.repository_id}"
}

output "gcs_bucket_wordlists" {
  description = "GCS bucket name for uploaded word-list CSV files"
  value       = google_storage_bucket.wordlists.name
}

output "firestore_database_id" {
  description = "Firestore database ID for wordlist metadata (wordlist_files collection)"
  value       = google_firestore_database.wordlist.name
}
