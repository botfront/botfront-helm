# Changelog

## 0.5

New `environments` section containing `resources`, `debug`, `host`, `tlsSecretName`, `path`

## 0.4

### Added
- Deployments rollouts when configmaps or secrets change
- GraphQL API protected with key

### Fixed
- `OPLOG_URL` is now only added as an environment variable if corresponding username and passwords are set in the db

### Changed
- `mongodb.mongodbHost` and `mongodb.mongodbPort` have been replaced with `mongodb.mongodbHostsAndPorts`. `mongodb.mongodbHostsAndPorts` supports a comma separated list for clusters
- `ducklingUrl` is replaced with `duckling.url`