dev:
	docker-compose -f docker-compose.development.yml up

dev-build:
	docker-compose -f docker-compose.development.yml build

dev-stop:
	docker-compose -f docker-compose.development.yml down

prod:
	docker-compose -f docker-compose.production.yml up -d

prod-build:
	docker-compose -f docker-compose.production.yml build

prod-stop:
	docker-compose -f docker-compose.production.yml down
