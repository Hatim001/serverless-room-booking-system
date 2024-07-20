resource "google_dialogflow_cx_agent" "agent" {
  display_name          = "DalVacationHome"
  location              = "global"
  default_language_code = "en"
  time_zone             = "America/Chicago"
}