
# Botfront Helm Charts

This repo contains 2 charts:

- `botfront`: the Botfront platform
- `botfront-project`: The Rasa project connected to Botfront,

Both charts need to be installed.

## Prerequisites

- Kubernetes 1.18+
- Helm 3.4+
- Persistent volume provisioner support in the underlying infrastructure

## Add the repository

```bash
helm repo add botfront https://botfront.github.io/botfront-helm
```

## Installation

#### Botfront

Given that there's quite a few parameters to set, we recommend using a config file. This is a minimal `config.yaml` you could start with:

```yaml
botfront:
  app:
    # The complete external host of the Botfront application (eg. botfront.yoursite.com). It must be set even if running on a private or local DNS (it populates the ROOT_URL).
    host: botfront.yoursite.com

mongodb:
  enabled: true # disable to use an external mongoDB host
  # Username of the MongoDB user that will have read-write access to the Botfront database. This is not the root user
  mongodbUsername: username
  # Password of the MongoDB user that will have read-write access to the Botfront database. This is not the root user
  mongodbPassword: password
  # MongoDB root password
  mongodbRootPassword: rootpassword
```



```bash
helm install botfront -f config.yaml  --namespace botfront botfront/botfront --create-namespace
```

Upgrading:
```
helm upgrade -f config.yaml botfront --namespace botfront-project botfront botfront/botfront
```
#### Rasa


```bash
helm install -n my_project --namespace botfront botfront/botfront-project \
 --set ingress.host=http://your.public.rasa-host.com
```

When the chart is installed you will get further instructions to finalize the setup of your project. Here is an example:

```
NOTES:
The Helm chart was succesfully installed on your cluster.
Please execute the following instructions to complete your project's setup.

1. Your Rasa instance is available at the following URL:
http://rasa.botfront.local

2. Set the following in your Settings > Endpoints:

nlg:
  type: 'rasa_addons.core.nlg.GraphQLNaturalLanguageGenerator'
  url: 'http://botfront-app-service.botfront/graphql'
action_endpoint:
  url: 'http://your.actions.server/webhook' # Change that if you have actions
tracker_store:
  store_type: rasa_addons.core.tracker_stores.AnalyticsTrackerStore
  # The URL below might be different if you installed Botfront in another namespace.
  url: 'http://botfront-webhooks-service.botfront'
  project_id: 'bf'

3a. If using Rasa Webchat Open Source, set the following credentials:

rasa_addons.core.channels.webchat.WebchatInput:
  session_persistence: true
  base_url: http://rasa.botfront.local

3b. If using Rasa Webchat Pro, set the following credentials:

rasa_addons.core.channels.webchat_plus.WebchatPlusInput:
  session_persistence: true
  base_url: http://rasa.botfront.local

4. Set the Rasa instance internal URL in Settings > Instance:
http://botfront-project-rasa-service.botfront-project
```

**Enterprise customers:** you must repeat this step for each Botfront project (change the release name)

To upgrade a Rasa project

```
helm upgrade -f values-project.yaml my-project --namespace botfront-project botfront/botfront-project
```

## Parameters reference

### Botfront

| Parameter                        | Description                                                                                   | Default                 |
|----------------------------------|-----------------------------------------------------------------------------------------------|-------------------------|
| **`botfront.version`**           | Botfront API Docker image                                                                     | `v1.0.3`               |
| **`botfront.app.image.name`**    | Botfront Docker image                                                                         | `botfront/botfront`     |
| **`botfront.app.host`**          | Botfront host (e.g botfront.your-domain.com)                                                  | `nil`                   |
| **`botfront.app.graphQLKey`**    | Key to protect the GraphQL API                                                                | `nil`                   |
| **`botfront.api.image.name`**    | Botfront API Docker image                                                                     | `botfront/botfront-api` |
| `botfront.ingress.enabled`       | Enable Ingress                                                                                | `true`                  |
| `botfront.ingress.nginx.enabled` | Enable if the `nginx-ingress` controller is installed (and used) on the cluster               | `true`                  |
| `botfront.ingress.tlsSecretName` | Optional. Name of the secret containing the TLS certificate. If not set, SSL will be disabled | `nil`                   |
| `botfront.ingress.tlsHost`       | Optional. Host associated with the TLS certificate (may contain a wildcard)                   | `nil`                   |
| `botfront.imagePullSecret`       | Name of the secret containing the credentials to pull images from a private Docker repo       | `nil`                   |


## Botfront project (Rasa) parameters

| Parameter                             | Description                                                                                                         | Default                                 |
|---------------------------------------|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| `projectId`                           | ProjectId                                                                                                           | `bf`                                    |
| `botfront.graphQLEndpoint`            | Should have the form `http://<botfront-service>.<botfront-namespace>/graphql`                                       | `nil`                                   |
| `botfront.graphQLKey`                 | Botfront GraphQL API key                                                                                            | `nil`                                   |
| `rasa.image`                          | Rasa image                                                                                                          | `botfront/rasa-for-botfront:2.2.5-bf.5` |
| `rasa.authToken`                      | Rasa [authentication token](https://rasa.com/docs/rasa/http-api/#token-based-auth)                                  | `nil`                                   |
| `ingress.host`                        | Rasa instance host                                                                                                  | `nil`                                   |
| `ingress.tlsSecretName`               | Name of the secret containing the certificate                                                                       | `nil`                                   |
| `ingress.nginx.enableSessionAffinity` | enable sticky session see [Working with multiple rasa instances](#working-with-multiple-rasa-instances) for details | `true`                                  |
| `ingress.nginx.enableSockets`         | enable use of sockets for conversations channels with rasa                                                          | `true`                                  |
| `duckling.url`                        | If set, the URL will be set as the `RASA_DUCKLING_HTTP_URL` environment variable to the Rasa deployment             | `nil`                                   |

## Duckling parameters

| Parameter              | Description                   | Default                    |
|------------------------|-------------------------------|----------------------------|
| **`duckling.enabled`** | Enable Duckling in this chart | `true`                     |
| **`botfront.image`**   | Duckling image                | `botfront/duckling:latest` |


## MongoDB parameters

Botfront stores its data in a MongoDB database. A MongoDB deployment (`stable/mongodb` chart) is included in this chart and can be optionally installed.
If you're using Botfront in a production environment, consider adding your own deployment, or using a managed service. And configure automated backups :)


| Parameter                      | Description                                                                   | Default                                   |
|--------------------------------|-------------------------------------------------------------------------------|-------------------------------------------|
| **`mongodb.mongodbUsername`**  | The name of the user accessing the Botfront database (must not be `root`)     | `bfrw`                                    |
| **`mongodb.mongodbPassword`**  | The password of the user accessing the Botfront database (must not be `root`) | `nil`                                     |
| `mongodb.mongodbHostsAndPorts` | MongoDB server                                                                | `botfront-mongodb-service.botfront:27017` |
| `mongodb.mongodbQueryString`   | MongoDB connection query string                                               | `&retryWrites=true`                       |
| `mongodb.mongodbRootPassword`  | MongoDB `root` password (only required if `mongodb.enabled` is set            | `nil`                                     |
| `mongodb.mongodbOplogUsername` | Optional. Considerable database performance gains                             | `nil`                                     |
| `mongodb.mongodbOplogPassword` | Optional. Considerable database performance gains                             | `nil`                                     |
| `mongodb.enabled`              | Set to `true` to add MongoDB to this deployment                               | `false`                                   |


**Important**
If you are using the provided MongoDB deployment, `mongodb.mongodbHost` must follow the following pattern: `<release-name>-mongodb-service.<namespace>`

### Mongo Express parameters

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


## Scaling Rasa instances

Two mechanisms can ensure tracker consistency when scaling horizontally:
- A **sticky session** ties a conversation to a single Rasa instance. So the load balancer cannot change the Rasa instance dynamically during the conversation.
- A **lock store** centralizes the conversation state and makes sure no race condition occurs if the load balancer spreads the conversation across several instances.

**Important :**
- 1. Sockets need to stick with the same instance. **The [Rasa Webchat](https://github.com/botfront/rasa-webchat) requires session affinity**
Rasa chart enables sticky sessions by default.
- 2. Botfront does not provide a model server. Trained models are persisted on persistent volume that is shared across instances. However, if you have more than one instance, you need to [rollout restart](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-em-restart-em-) your Rasa deployment to make sure each instance loads the latest model.



### Model server

TO-DO once a model server is setup

### Lockstore
#### Enable and configure redis

Redis is a data structure store, used by rasa as a lockstore it ensure that incoming messages are processed in the right order.

| Parameter               | Description                                               | Default |
|-------------------------|-----------------------------------------------------------|---------|
| `redis.enabled`         | Set to `true` to enable redis                             | `false` |
| `redis.usePassword`     | Enable password authentication for connecting to redis    | `true`  |
| `redis.global.password` | The password value, if not set will be randomly generated | `nil`   |

#### Lockstore configuration

Once redis is enabled you will need to update the endpoints in botfront so rasa is able to use it.
here is an example of what you should add to the configuration :
```yaml
lock_store:
  type: "redis"
  url: botfront-redis-master.<your namespace>
  port: 6379
  password: <your password>
  db: 0 #
```

### Sticky Session

This is enabled by default.
If you are using a lockstore, you will need to disable it or the lockstore serve it purpose.
in your rasa values set `ingress.nginx.enableSessionAffinity to `false`

### Pulling from a CGP private registry

Obtain your `key.json` file:

1. Create a `docker-registry` secret in your cluster
```bash
kubectl create secret docker-registry gcr-json-key \
  --docker-server=https://gcr.io \
  --docker-username=_json_key \
  --docker-password="$(cat key.json)" \
  --namespace botfront
```

2. Patch the `default` service account (or the service account pulling images in your pods) **in the namespace Botfront is deployed in**.
```
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "gcr-json-key"}]}' --namespace botfront
```

3. Set `botfront.imagePullSecret` to `gcr-json-key`
