.PHONY: *
build: install
	pnpm exec tsc
	pnpm exec vite build

install: package.json
	pnpm install

dev: install
	pnpm exec vite

preview: install
	pnpm exec vite preview

lint: install
	pnpm exec eslint .