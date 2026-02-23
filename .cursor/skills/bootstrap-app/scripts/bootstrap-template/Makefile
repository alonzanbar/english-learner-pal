# Development and deployment (monorepo: apps/web, future apps/backend)

.PHONY: dev deploy-staging deploy-prod

dev:
	cd apps/web && npm run dev

deploy-staging:
	./scripts/deploy-all.sh staging

deploy-prod:
	./scripts/deploy-all.sh prod
