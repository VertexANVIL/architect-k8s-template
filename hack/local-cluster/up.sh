#!/usr/bin/env bash
set -euo pipefail

# Brings up a local Kubernetes cluster from the `dev-test1` target
function cleanup() {
  kill "$(jobs -p)"
  rm -rf -- "$KUBECONFIG"
}

function set_assets_live() {
  echo "Rendering assets..."
  node -r ts-node/register ../../src/index.ts
  mc mirror --overwrite --remove ../../build/dev-test1 docker-desktop/cluster
}

trap cleanup EXIT

# copy kubeconfig and select docker desktop
export KUBECONFIG
KUBECONFIG=$(mktemp)

cp "$HOME/.kube/config" "$KUBECONFIG"
yq -i '.current-context = "docker-desktop"' "$KUBECONFIG"

# install flux to the cluster
echo "Setting up MinIO"
kubectl minio init > /dev/null 2>&1

# check kubectl for whether tenant state exists
if ! kubectl get tenant state -n minio-operator > /dev/null 2>&1; then
  kubectl minio tenant create state \
    --servers 1 --volumes 1 --capacity 1Gi --disable-tls \
    --namespace minio-operator --storage-class hostpath
  # todo: we need to wait for the tenant to become available
fi

kubectl -n minio-operator port-forward service/minio 9000:80 > /dev/null 2>&1 &
MINIO_SECRET_DATA=$(kubectl get secret -n minio-operator state-user-1 -o json | jq '.data')
MINIO_ACCESS_KEY="$(echo "$MINIO_SECRET_DATA" | jq -r '.CONSOLE_ACCESS_KEY' | base64 -d)"
MINIO_SECRET_KEY="$(echo "$MINIO_SECRET_DATA" | jq -r '.CONSOLE_SECRET_KEY' | base64 -d)"
mc alias remove docker-desktop || true
mc alias set --insecure docker-desktop http://127.0.0.1:9000 "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"
mc mb docker-desktop/cluster -p

echo "Installing flux components"
flux install > /dev/null 2>&1

echo "Running initial sync and creating bucket source"
set_assets_live
flux create source bucket cluster \
  --bucket-name=cluster --endpoint=minio.minio-operator.svc.cluster.local:80 --insecure=true \
  --access-key="$MINIO_ACCESS_KEY" --secret-key="$MINIO_SECRET_KEY"
flux create kustomization cluster \
  --source=Bucket/cluster --path="./cluster" --prune=true --interval=1h --wait=false

while true; do
  printf "Server running, press any key to set changes live\n"
  read -n1 -r -s

  set_assets_live || true
  flux reconcile kustomization cluster --with-source || true
done
