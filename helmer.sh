#! /bin/bash
helm package botfront-project --destination charts
helm package botfront --destination charts
helm repo index --url https://botfront.github.io/botfront-helm .
