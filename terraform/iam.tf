# Allow the CI deployer SA to act as the default compute SA when running gcloud run deploy.
# Without this, deploy fails with: Permission 'iam.serviceaccounts.actAs' denied on ...-compute@developer.gserviceaccount.com
resource "google_service_account_iam_member" "deployer_act_as_compute" {
  count = var.deployer_sa_email != "" ? 1 : 0

  service_account_id = "projects/${var.project_id}/serviceAccounts/${data.google_project.current.number}-compute@developer.gserviceaccount.com"
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${var.deployer_sa_email}"
}
