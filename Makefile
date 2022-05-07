start:
	docker-compose -f docker-compose.development.yml up --build

stop:
	docker-compose -f docker-compose.development.yml down
