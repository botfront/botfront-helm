#! /bin/bash
helm package botfront-project
helm package botfront
helm repo index --url https://botfront.github.io/botfront-helm .
