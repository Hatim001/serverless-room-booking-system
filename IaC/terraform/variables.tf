variable "project_id" {
  default = "sdp-dialog"
  type    = string
}

variable "region" {
  default = "global"
  type    = string
}

variable "zone" {
  default = "global"
  type    = string
}
variable "quota_project_id" {
  description = "The Google Cloud project ID to be used for quota and billing"
  type        = string
  default     = "sdp-dialog"
}

