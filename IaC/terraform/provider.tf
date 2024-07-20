provider "google" {
  credentials = file("sdp-dialog-d6487484276d.json")
  project = var.project_id
  region  = var.region
  zone    = var.zone

}
