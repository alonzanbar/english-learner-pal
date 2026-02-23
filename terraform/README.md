# Backend infrastructure (Terraform)

Creates GCP resources for the word-list API backend:

- **Artifact Registry** repository for backend Docker images
- **Cloud Run** service (wordlist-backend-staging / wordlist-backend-prod) with a placeholder image until the first deploy

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.0
- [gcloud](https://cloud.google.com/sdk/docs/install) authenticated: `gcloud auth application-default login`
- Project ID (e.g. from `.firebaserc`: `lexicon-learner-pal`)

## Apply (create/update infra)

```bash
cd terraform
terraform init
terraform plan -var="project_id=lexicon-learner-pal"
terraform apply -var="project_id=lexicon-learner-pal"
```

Optional: set region or environment:

```bash
terraform apply -var="project_id=lexicon-learner-pal" -var="region=europe-west1" -var="environment=staging"
```

After apply, build and push the backend image, then deploy to Cloud Run (CI or manually):

```bash
# From repo root
docker build -f apps/backend/Dockerfile -t $(terraform -chdir=terraform output -raw artifact_registry_repository):latest .
docker push $(terraform -chdir=terraform output -raw artifact_registry_repository):latest
gcloud run deploy wordlist-backend-staging --image=$(terraform -chdir=terraform output -raw artifact_registry_repository):latest --region=us-central1
```

Or use the GitHub Actions workflow (when added) to build and deploy on push.

## Outputs

- `backend_url` – Cloud Run service URL (use as `VITE_API_URL` in the frontend for that environment)
- `artifact_registry_repository` – Full image repo path for pushing the backend image

## Remote state (optional)

To use GCS backend for state, create a bucket and uncomment the `backend "gcs"` block in `main.tf`, then run `terraform init -migrate-state`.
