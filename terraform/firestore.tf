# Firestore database for word-list file metadata (wordlist_files collection).
# The backend uses this database when GCS_BUCKET and FIRESTORE_DATABASE_ID are set.
resource "google_firestore_database" "wordlist" {
  project     = var.project_id
  name        = "wordlist-${var.environment}"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.firestore]
}
