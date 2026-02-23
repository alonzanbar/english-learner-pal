resource "google_artifact_registry_repository" "backend" {
  location      = var.region
  repository_id = "wordlist-backend"
  description   = "Docker images for word-list API backend"
  format        = "DOCKER"

  depends_on = [google_project_service.artifactregistry]
}
