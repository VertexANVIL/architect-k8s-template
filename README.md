# Kubernetes Project Template

This is a barebones template for starting a project with [architect-k8s](https://github.com/ArctarusLimited/architect-k8s).

To run the project, run `npx projen build` (or start `npx projen watch`), and run `node lib/index.js`. The `build` folder should appear, and inside it, `dev-test1` containing your cluster resources. Point Flux to the `cluster` folder. An easy way to bring up a test cluster is with Docker Desktop - the `up.sh` script inside the `hack` folder accomplishes thi.

The first build will take a while, but all subsequent builds should be near-instant, unless inputs to Helm charts or Kustomizations are modified, as Architect caches background transform operations.
