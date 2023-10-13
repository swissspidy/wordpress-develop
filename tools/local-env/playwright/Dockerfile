FROM mcr.microsoft.com/playwright:v1.32.0-jammy

RUN apt-get update

WORKDIR /ms-playwright

RUN npm install -y playwright@1.32.0 && npx playwright install-deps

CMD ["./node_modules/.bin/playwright", "run-server", "--port","3000"]
