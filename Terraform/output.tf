output "k8s_host" {
  value = "https://${google_container_cluster.default.endpoint}"
  sensitive = true
}

output "k8s_token" {
  value = data.google_client_config.default.access_token
  sensitive = true
}

output "k8s_ca_cert" {
  value = base64decode(google_container_cluster.default.master_auth[0].cluster_ca_certificate)
  sensitive = true
}