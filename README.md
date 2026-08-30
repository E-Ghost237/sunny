# Sunnyside App

A personal/learning-project Angular rebuild of a cannabis-dispensary e-commerce site. Not affiliated with the
real Sunnyside/Cresco Labs; private, unpublished. Product/store/article data was extracted from a local
prototype and crawl corpus (see `sunny/extract/*.py`) — see `sunny/har_reference/README.md` for how the real
site's backend contract shaped a few pieces of this build (the login flow, store data, and the learn/page
content-block schema).

## Running this project

Two servers, in separate terminals:

```bash
npm run mock-api   # builds mock-server/db.json from mock-server/data/*.json, serves it on :3001
ng serve           # the Angular app on :4200
```

`npm run mock-api` rebuilds the mock database every time it starts — if you edit anything under
`mock-server/data/` (or re-run one of the `sunny/extract/*.py` scripts), just restart it.

## Connecting the real backend later

Every HTTP call in this app goes through `core/services/*.service.ts`, and every one of those reads its base
URL from `environment.apiBaseUrl` (`src/environments/environment.ts` for prod builds,
`environment.development.ts` for `ng serve`) — nothing else hardcodes a URL. To point the app at a real
backend instead of the mock: implement the same endpoints json-server is currently serving
(`GET /products`, `GET /stores`, `GET /articles`, `GET /pages`, `GET /core-pages`, each supporting the query
params the services use — see `core/services/`) and change `apiBaseUrl`. `AuthService`/`CartService`/
`OrderService` currently simulate a backend via `localStorage` (see the comments in each) since no real
cart/checkout/auth traffic was ever captured to model against — those are the services to rewrite first.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
