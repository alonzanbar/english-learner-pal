# Backend infrastructure (Terraform)

Creates GCP resources for the word-list API backend (all infra in Terraform, no manual console steps):

- **Artifact Registry** repository for backend Docker images
- **Cloud Run** service (wordlist-backend-staging / wordlist-backend-prod) with env `GCS_BUCKET` and `FIRESTORE_DATABASE_ID`
- **GCS bucket** for uploaded CSV files (`{project_id}-wordlists-{environment}`); Cloud Run SA has objectAdmin
- **Firestore database** (native) for file metadata (`wordlist_files` collection); Cloud Run SA has datastore.user
- **IAM** for deployer SA (optional) and for Cloud Run to use Storage + Firestore

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

Optional: set region, environment, or deployer SA (for CI):

```bash
# Deployer SA: so GitHub Actions can run gcloud run deploy (act as default compute SA)
terraform apply -var="project_id=lexicon-learner-pal" \
  -var="deployer_sa_email=github-actions-backend@lexicon-learner-pal.iam.gserviceaccount.com"

# Or region/environment
terraform apply -var="project_id=lexicon-learner-pal" -var="region=europe-west1" -var="environment=staging"
```

After apply, build and push the backend image, then deploy to Cloud Run (CI or manually):

```bash
# From repo root
docker build -f apps/backend/Dockerfile -t $(terraform -chdir=terraform output -raw artifact_registry_repository):latest .
docker push $(terraform -chdir=terraform output -raw artifact_registry_repository):latest
gcloud run deploy wordlist-backend-staging --image=$(terraform -chdir=terraform output -raw artifact_registry_repository):latest --region=us-central1
```

Or use the GitHub Actions workflow to build and deploy on push.

### GitHub Actions: allow deploy SA to act as compute SA

Terraform can manage this binding: set `deployer_sa_email` to your CI service account (e.g. `github-actions-backend@PROJECT_ID.iam.gserviceaccount.com`).

Set the variable when applying (or in a `.tfvars` file):

```bash
terraform apply -var="project_id=YOUR_PROJECT_ID" -var="deployer_sa_email=github-actions-backend@YOUR_PROJECT_ID.iam.gserviceaccount.com"
```

Terraform will grant that service account `roles/iam.serviceAccountUser` on the project’s default compute service account so `gcloud run deploy` can succeed in CI.

## Outputs

- `backend_url` – Cloud Run service URL (use as `VITE_API_URL` in the frontend for that environment)
- `artifact_registry_repository` – Full image repo path for pushing the backend image

## Remote state (optional)

To use GCS backend for state, create a bucket and uncomment the `backend "gcs"` block in `main.tf`, then run `terraform init -migrate-state`.
