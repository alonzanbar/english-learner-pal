variable "project_id" {
  description = "GCP project ID (e.g. from .firebaserc)"
  type        = string
}

variable "region" {
  description = "GCP region for Cloud Run and Artifact Registry"
  type        = string
  default     = "us-central1"
}

variable "backend_image" {
  description = "Container image for the word-list backend (placeholder used until first deploy)"
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "environment" {
  description = "Environment name (staging, prod) for resource naming"
  type        = string
  default     = "staging"
}

variable "deployer_sa_email" {
  description = "Service account email used by CI to deploy (e.g. github-actions-backend@PROJECT_ID.iam.gserviceaccount.com). When set, grants this SA roles/iam.serviceAccountUser on the default compute SA so gcloud run deploy can act as it."
  type        = string
  default     = ""
}
