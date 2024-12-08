#!/usr/bin/env -S just --justfile

image_base := "ghcr.io/verseghy"
image_tag := "v1"

_default:
  @just --list --unsorted

build-image:
  podman build -t {{image_base}}/matverseny-frontend:{{image_tag}} -f ./Containerfile .

push-image:
  podman push {{image_base}}/matverseny-frontend:{{image_tag}}
