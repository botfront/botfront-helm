
# Helm charts for Botfront

THIS REPO IS WORK IN PROGRESS

## Prerequisites
Kubernetes 1.12+
Helm 2.11+
PV provisioner support in the underlying infrastructure

## Add the repository

```bash
helm add repo https://botfront.github.io/botfront-helm
```

## Install Botfront

```bash
helm install -n botfront --namespace botfront ...
```

| Parameter                        | Description                                                                                   | Default                 |
|----------------------------------|-----------------------------------------------------------------------------------------------|-------------------------|
| **`botfront.version`**           | Botfront API Docker image                                                                     | `latest`                |
| **`botfront.app.image.name`**    | Botfront Docker image                                                                         | `botfront/botfront`     |
| **`botfront.app.host`**          | Botfront host (e.g botfront.your-domain.com)                                                  | `nil`                   |
| **`botfront.api.image.name`**    | Botfront API Docker image                                                                     | `botfront/botfront-api` |
| `botfront.ingress.enabled`       | Enable Ingress                                                                                | `true`                  |
| `botfront.ingress.nginx.enabled` | Enable if the `nginx-ingress` controller is installed (and used) on the cluster               | `true`                  |
| `botfront.ingress.tlsSecretName` | Optional. Name of the secret containing the TLS certificate. If not set, SSL will be disabled | `nil`                   |
| `botfront.ingress.tlsHost`       | Optional. Host associated with the TLS certificate (may contain a wildcard)                   | `nil`                   |
| `botfront.imagePullSecret`       | Name of the secret containing the credentials to pull images from a private Docker repo       | `nil`                   |


### Configure MongoDB

Botfront stores its data in a MongoDB database. A MongoDB deployment (`stable/mongodb` chart) is included in this chart and can be optionally installed.
If you're using Botfront in a production environment, consider adding your own deployment, or using a managed service. And configure automated backups :)


| Parameter                      | Description                                                                   | Default                             |
|--------------------------------|-------------------------------------------------------------------------------|-------------------------------------|
| **`mongodb.mongodbUsername`**  | The name of the user accessing the Botfront database (must not be `root`)     | `bfrw`                              |
| **`mongodb.mongodbPassword`**  | The password of the user accessing the Botfront database (must not be `root`) | `nil`                               |
| `mongodb.mongodbHost`          | MongoDB server                                                                | `botfront-mongodb-service.botfront` |
| `mongodb.mongodbPort`          | MongoDB server                                                                | `27017`                             |
| `mongodb.mongodbQueryString`   | MongoDB connection query string                                               | `&retryWrites=true`                 |
| `mongodb.mongodbRootPassword`  | MongoDB `root` password (only required if `mongodb.enabled` is set            | `nil`                               |
| `mongodb.mongodbOplogUsername` | Optional. Considerable database performance gains                             | `nil`                               |
| `mongodb.mongodbOplogPassword` | Optional. Considerable database performance gains                             | `nil`                               |
| `mongodb.enabled`              | Set to `true` to add MongoDB to this deployment                               | `false`                             |


**Important**
If you are using the provided MongoDB deployment, `mongodb.mongodbHost` must follow the following pattern: `<release-name>-mongodb-service.<namespace>`

### Optional: enable and configure Mongo Express

Mongo Express is a web-based client for MongoDB. You can optionally add Mongo Express to your deployment

| Parameter                            | Description                                                   | Default                             |
|--------------------------------------|---------------------------------------------------------------|-------------------------------------|
| `mongo-express.enabled`              | Set to `true` to enable a Mongo Express deployment            | `false`                             |
| `mongo-express.basicAuthUsername`    | The Basic Auth username to access the Mongo Express interface | `nil`                               |
| `mongo-express.basicAuthPassword`    | The Basic Auth password to access the Mongo Express interface | `nil`                               |
| `mongo-express.mongodbAdminPassword` | MongoDB `root` password                                       | `nil`                               |
| `mongo-express.mongodbServer`        | MongoDB server                                                | `nil`                               |
| `mongo-express.hosts[0].host`        | Mongo Express host                                            | `botfront-mongodb-service.botfront` |
| `mongo-express.hosts[0].paths[0]`    | Mongo Express host path. **You must set it to `/`**           | `nil`                               |
| `mongo-express.tls[0].hosts[0]`      | Optional. The host associated to your certificate             | `nil`                               |
| `mongo-express.tls[0].secretName`    | Optional. Secret containing your certificate                  | `nil`                               |


**Important**
If you are using the provided MongoDB deployment, `mongodb.mongodbHost` must follow the following pattern: `<release-name>-mongodb-service.<namespace>`

## Install Rasa

```bash
helm install -n botfront --namespace botfront ...
```
| Parameter   | Description | Default |
|-------------|-------------|---------|
| `projectId` | ProjectId   | `bf`    |
| `graphQLEndpoint`              | Should have the form `http://<botfront-service>.<namespace>/graphql            | `nil`                             |
| `rasa.image`              | Rasa image            | `botfront/rasa-for-botfront:latest`                             |


## Setup credentials for private Docker repo

Once you obtain your `key.json` file (from GCR for example):

1. Create a `docker-registry` secret in your cluster
```bash
kubectl create secret docker-registry gcr-json-key \
  --docker-server=gcr.io \
  --docker-username=_json_key \
  --docker-password="$(cat key.json)" \
  --docker-email=your@email.com
```

2. Patch the `default` service account (or the service account pulling images in your pods)
```
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}'
```

3. Set `botfront.imagePullSecret` to `gcr-json-key`

