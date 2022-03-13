build:
	docker-compose -f docker-compose.development.yml build

stop:
	docker-compose -f docker-compose.development.yml down

dev:
	docker-compose -f docker-compose.development.yml up -d
