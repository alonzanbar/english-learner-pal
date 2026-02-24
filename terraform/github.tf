# Optional: sync Cloud Run backend URL to GitHub Actions variables so the web deploy
# (Firebase) builds with VITE_API_URL set. Run: GITHUB_TOKEN=xxx terraform apply -var="github_repository=owner/repo"

resource "github_actions_variable" "backend_url" {
  count = var.github_repository != "" ? 1 : 0

  repository    = var.github_repository
  variable_name = "BACKEND_URL_${upper(var.environment)}"
  value         = google_cloud_run_v2_service.backend.uri
}
