
helm install -n botfront --namespace botfront ...

## General Botfront parameters

| Parameter                        | Description                                                                                   | Default                 |
|----------------------------------|-----------------------------------------------------------------------------------------------|-------------------------|
| `botfront.version`               | Botfront API Docker image                                                                     | `latest`                |
| `botfront.app.image.name`        | Botfront Docker image                                                                         | `botfront/botfront`     |
| `botfront.app.host`              | Botfront host (e.g botfront.your-domain.com)                                                  | `nil`                   |
| `botfront.api.image.name`        | Botfront API Docker image                                                                     | `botfront/botfront-api` |
| `botfront.ingress.enabled`       | Enable Ingress                                                                                | `true`                  |
| `botfront.ingress.nginx.enabled` | Enable if the `nginx-ingress` controller is installed (and used) on the cluster               | `true`                  |
| `botfront.ingress.tlsSecretName` | Optional. Name of the secret containing the TLS certificate. If not set, SSL will be disabled | `nil`                   |
| `botfront.ingress.tlsHost`       | Optional. Host associated with the TLS certificate (may contain a wildcard)                   | `nil`                   |

## MongoDB configuration

### Enabling a MongoDB deployment

Botfront stores its data in a MongoDB database. A MongoDB deployment (`stable/mongodb` chart) is included in this chart and can be optionally installed.
If you're using Botfront in a production environment, consider adding your own deployment, or using a managed service. And configure automated backups :)

| Parameter         | Description                                  | Default |
|-------------------|----------------------------------------------|---------|
| `mongodb.enabled` | Set to `true` to enable a MongoDB deployment | `false` |


### Configure MongoDB

Those values must be set whether or not you enabled a MongoDB deployment.

| Parameter                      | Description                                                                   | Default                             |
|--------------------------------|-------------------------------------------------------------------------------|-------------------------------------|
| `mongodb.mongodbUsername`      | The name of the user accessing the Botfront database (must not be `root`)     | `bfrw`                              |
| `mongodb.mongodbPassword`      | The password of the user accessing the Botfront database (must not be `root`) | `nil`                               |
| `mongodb.mongodbRootPassword`  | MongoDB `root` password                                                       | `nil`                               |
| `mongodb.mongodbOplogUsername` | Optional. Considerable database performance gains                             | `nil`                               |
| `mongodb.mongodbOplogPassword` | Optional. Considerable database performance gains                             | `nil`                               |
| `mongodb.mongodbHost`          | MongoDB server                                                                | `botfront-mongodb-service.botfront` |

> **Important**
> If the release name OR the namespace are not `botfront` you must set `mongodb.mongodbHost` to `<release-name>-mongodb-service.<namespace>`

### Enabling a Mongo Express deployment

Mongo Express is a web-based client for MongoDB.

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

> **Important**
> If the release name OR the namespace are not `botfront` you must set `mongo-express.mongodbServer` to `<release-name>-mongodb-service.<namespace>`

