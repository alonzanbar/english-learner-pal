terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  # Optional: remote state in GCS for team/CI
  # backend "gcs" {
  #   bucket = "YOUR_TERRAFORM_STATE_BUCKET"
  #   prefix = "wordlist-backend"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# APIs required for Artifact Registry and Cloud Run
resource "google_project_service" "artifactregistry" {
  project            = var.project_id
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "run" {
  project            = var.project_id
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

# Project number needed to reference the default compute service account
data "google_project" "current" {
  project_id = var.project_id
}
