data "google_client_config" "default" {}

provider "kubectl" {
  host                   = "https://${google_container_cluster.default.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.default.master_auth[0].cluster_ca_certificate)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "gke-gcloud-auth-plugin"
  }
}

resource "kubectl_manifest" "front-end-config" {
  yaml_body = file("./kubernetes/frontend-config.yaml")
  depends_on = [kubectl_manifest.grid-namespace]
}

resource "kubectl_manifest" "managed-certificate" {
  yaml_body = file("./kubernetes/icon-portal-certificate.yaml")
  depends_on = [kubectl_manifest.client-service]
}

resource "kubectl_manifest" "ingress" {
  yaml_body = file("./kubernetes/ingress.yaml")
  depends_on = [kubectl_manifest.client-service, kubectl_manifest.front-end-config, kubectl_manifest.managed-certificate]
}

resource "kubectl_manifest" "client-deployment" {
  yaml_body = file("./kubernetes/deployments/normal-grid-client.yaml")
  depends_on = [kubectl_manifest.client-service]
}

resource "kubectl_manifest" "layout-deployment" {
  yaml_body = file("./kubernetes/deployments/grid-layout.yaml")
  depends_on = [kubectl_manifest.k8s_secret, kubectl_manifest.layout-service]
}

resource "kubectl_manifest" "themes-deployment" {
  yaml_body = file("./kubernetes/deployments/grid-themes.yaml")
  depends_on = [kubectl_manifest.k8s_secret, kubectl_manifest.themes-service]
}

resource "kubectl_manifest" "widget-deployment" {
  yaml_body = file("./kubernetes/deployments/grid-media.yaml")
  depends_on = [kubectl_manifest.k8s_secret, kubectl_manifest.widget-service]
}

resource "kubectl_manifest" "icon-proxy-deployment" {
  yaml_body = file("./kubernetes/deployments/icon-proxy-server.yaml")
  depends_on = [kubectl_manifest.icon-proxy-service]
}

resource "kubectl_manifest" "client-service" {
  yaml_body = file("./kubernetes/services/grid-client.yaml")
  depends_on = [kubectl_manifest.grid-namespace]
}

resource "kubectl_manifest" "layout-service" {
  yaml_body = file("./kubernetes/services/grid-layout.yaml")
  depends_on = [kubectl_manifest.grid-namespace]
}

resource "kubectl_manifest" "themes-service" {
  yaml_body = file("./kubernetes/services/grid-themes.yaml")
  depends_on = [kubectl_manifest.grid-namespace]
}

resource "kubectl_manifest" "widget-service" {
  yaml_body = file("./kubernetes/services/grid-media.yaml")
  depends_on = [kubectl_manifest.grid-namespace]
}

resource "kubectl_manifest" "icon-proxy-service" {
  yaml_body = file("./kubernetes/services/icon-proxy-server.yaml")
  depends_on = [kubectl_manifest.grid-namespace]
}

resource "kubectl_manifest" "k8s_secret" {
  yaml_body = file("./kubernetes/grid-secret.yaml")
  depends_on = [kubectl_manifest.grid-namespace]
}

resource "kubectl_manifest" "grid-namespace" {
  yaml_body = file("./kubernetes/grid-namespace.yaml")
  depends_on = [time_sleep.wait_service_cleanup]
}

# Provide time for Service cleanup
resource "time_sleep" "wait_service_cleanup" {
  depends_on = [google_container_cluster.default]

  destroy_duration = "180s"
}