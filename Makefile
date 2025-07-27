server = root@lfwebinnovations.com.br
project_path = $(shell basename $(shell pwd))

rsync:
	rsync -azv ./dist $(server):$(project_path)
	rsync -azv ./public $(server):$(project_path)
	rsync -azv ./docker-compose.yml $(server):$(project_path)
	rsync -azv ./Dockerfile $(server):$(project_path)
	rsync -azv ./nginx.conf $(server):$(project_path)

deploy: rsync
	ssh $(server) "cd $(project_path) && docker compose down && docker compose up --build -d"