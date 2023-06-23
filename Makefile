run-server:
	docker compose up -d

stop-server:
	docker compose down

run-backup-devel-mongo-db:
	echo "test"

run-test:
	docker compose exec server npm run test
