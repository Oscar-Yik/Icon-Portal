data "google_client_config" "default" {}

provider "kubernetes" {
  host                   = "https://${google_container_cluster.default.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.default.master_auth[0].cluster_ca_certificate)

  ignore_annotations = [
    "^autopilot\\.gke\\.io\\/.*",
    "^cloud\\.google\\.com\\/.*"
  ]
}

resource "kubernetes_manifest" "front-end-config" {
  manifest = yamldecode(file("./../kubernetes/frontend-config.yaml"))
  depends_on = [kubernetes_manifest.grid-namespace]
}

resource "kubernetes_manifest" "managed-certificate" {
  manifest = yamldecode(file("./../kubernetes/icon-portal-certificate.yaml"))
  depends_on = [kubernetes_manifest.client-service]
}

resource "kubernetes_manifest" "ingress" {
  manifest = yamldecode(file("./../kubernetes/ingress.yaml"))
  depends_on = [kubernetes_manifest.client-service, kubernetes_manifest.front-end-config, kubernetes_manifest.managed-certificate]
}

resource "kubernetes_manifest" "client-deployment" {
  manifest = yamldecode(file("./../kubernetes/deployments/normal-grid-client.yaml"))
  depends_on = [kubernetes_manifest.client-service]
}

resource "kubernetes_manifest" "layout-deployment" {
  manifest = yamldecode(file("./../kubernetes/deployments/grid-layout.yaml"))
  depends_on = [kubernetes_manifest.k8s_secret, kubernetes_manifest.layout-service]
}

resource "kubernetes_manifest" "themes-deployment" {
  manifest = yamldecode(file("./../kubernetes/deployments/grid-themes.yaml"))
  depends_on = [kubernetes_manifest.k8s_secret, kubernetes_manifest.themes-service]
}

resource "kubernetes_manifest" "widget-deployment" {
  manifest = yamldecode(file("./../kubernetes/deployments/grid-media.yaml"))
  depends_on = [kubernetes_manifest.k8s_secret, kubernetes_manifest.widget-service]
}

resource "kubernetes_manifest" "icon-proxy-deployment" {
  manifest = yamldecode(file("./../kubernetes/deployments/icon-proxy-server.yaml"))
  depends_on = [kubernetes_manifest.icon-proxy-service]
}

resource "kubernetes_manifest" "client-service" {
  manifest = yamldecode(file("./../kubernetes/services/grid-client.yaml"))
  depends_on = [kubernetes_manifest.grid-namespace]
}

resource "kubernetes_manifest" "layout-service" {
  manifest = yamldecode(file("./../kubernetes/services/grid-layout.yaml"))
  depends_on = [kubernetes_manifest.grid-namespace]
}

resource "kubernetes_manifest" "themes-service" {
  manifest = yamldecode(file("./../kubernetes/services/grid-themes.yaml"))
  depends_on = [kubernetes_manifest.grid-namespace]
}

resource "kubernetes_manifest" "widget-service" {
  manifest = yamldecode(file("./../kubernetes/services/grid-media.yaml"))
  depends_on = [kubernetes_manifest.grid-namespace]
}

resource "kubernetes_manifest" "icon-proxy-service" {
  manifest = yamldecode(file("./../kubernetes/services/icon-proxy-server.yaml"))
  depends_on = [kubernetes_manifest.grid-namespace]
}

resource "kubernetes_manifest" "k8s_secret" {
  manifest = yamldecode(file("./../kubernetes/grid-secret.yaml"))
  depends_on = [kubernetes_manifest.grid-namespace]
}

resource "kubernetes_manifest" "grid-namespace" {
  manifest = yamldecode(file("./../kubernetes/grid-namespace.yaml"))
  depends_on = [time_sleep.wait_service_cleanup]
}

# Provide time for Service cleanup
resource "time_sleep" "wait_service_cleanup" {
  depends_on = [google_container_cluster.default]

  destroy_duration = "180s"
}