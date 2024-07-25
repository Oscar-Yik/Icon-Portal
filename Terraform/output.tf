output "external-ip-address" {
    value = google_compute_global_address.external_static_ip.address
    description = "external ip for ingress controller"
}

