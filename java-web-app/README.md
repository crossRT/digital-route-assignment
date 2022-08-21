# Part 2: Task

## Requirement
- Assuming you have a working kubernetes cluster, installed with cert-manager.
- You must at least have `kubectl` & `kustomize` installed on local machine.

## Build manifest
This project using `kustomize` to form the complete manifest.
To build the complete manifest locally, please run following command in root of the project:
```shell
kustomize build overlays/production
```

## Deploy to cluster
In order to deploy it into cluster, please run the following command:
```shell
kubectl apply  -k ./overlays/production
```

## Testing
In order to access into the web app, you can do port-forward to the service by running following command:
```shell
# forward local port 9001 to the java-webapp-service 8080
kubectl -n production port-forward service/java-webapp-service 9001:8080

# HTTP request to the webapp
curl localhost:9001
```
