# Makefile to run Caelum Secretary locally
# Comments in English only

SHELL := /bin/bash
PORT ?= 3000
HOST ?= 0.0.0.0
ENV  ?= development

.PHONY: run start install help

help:
	@echo "Available targets:"
	@echo "  make run      - Install deps (if needed) and run server in watch mode"
	@echo "                 Vars: PORT=$(PORT) HOST=$(HOST) ENV=$(ENV)"
	@echo "  make start    - Run server in production mode"
	@echo "  make install  - Install server dependencies"

node_modules:
	@npm install

install: node_modules ## Install server dependencies

run: node_modules ## Run in development (watch)
	@echo "Starting server on $(HOST):$(PORT) (ENV=$(ENV))..."
	@PORT=$(PORT) HOST=$(HOST) NODE_ENV=$(ENV) npm run dev

start: node_modules ## Run in production
	@echo "Starting server (production) on $(HOST):$(PORT) ..."
	@PORT=$(PORT) HOST=$(HOST) NODE_ENV=production npm start
