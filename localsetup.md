# Minikube setup

```bash
# Start
minikube start  --kubernetes-version v1.16.0
minikube addons enable ingress
# install helm - 2.16 required
brew install helm@2
echo 'export PATH="/usr/local/opt/helm@2/bin:$PATH"' >> ~/.zshrc
helm init
# local DNS
echo "$(minikube ip) botfront.local app.botfront.local rasa.botfront.local db.botfront.local" | sudo tee -a /etc/hosts
# Launch k8S dashboard
minikube dashboard