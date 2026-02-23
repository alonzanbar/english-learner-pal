resource "google_cloud_run_v2_service" "backend" {
  name     = "wordlist-backend-${var.environment}"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = var.backend_image
      ports {
        container_port = 8080
      }
      env {
        name  = "GCS_BUCKET"
        value = google_storage_bucket.wordlists.name
      }
      env {
        name  = "FIRESTORE_DATABASE_ID"
        value = google_firestore_database.wordlist.name
      }
    }
    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }
  }

  depends_on = [
    google_project_service.run,
    google_storage_bucket.wordlists,
    google_firestore_database.wordlist,
  ]
}

# Allow unauthenticated invocations (public API for dummy)
resource "google_cloud_run_v2_service_iam_member" "backend_public" {
  location = google_cloud_run_v2_service.backend.location
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
