# DeLight

A cannabis-dispensary e-commerce storefront (Angular) with a back-office for the team. Built as a rebuild
prototype; not affiliated with any other brand. Product, store and article data lives in
`mock-server/data/*.json`.

## Running this project

Two servers, in separate terminals:

```bash
npm run mock-api   # zero-dependency Node API on :3001, reads mock-server/data/*.json on every request
ng serve           # the Angular app on :4200 (proxies /api to :3001)
```

The mock API writes changes made in the back-office straight back to `mock-server/data/` (and uploaded
photos to `public/assets/img/uploads/`). Those files are tracked in git.

Run `npm run watch:public` alongside `ng serve` so newly uploaded photos are served without a restart.

## Back-office

Open `/admin` (sign-in at `/admin/login`). It covers:

- **Orders**: review payment proof, approve or reject it (with a note), dispatch with tracking, complete or cancel.
- **Products**: add and edit products, all fields, category filter attributes, photos (upload and reorder).
- **Payment methods**: add, edit, show or hide, reorder, remove. Instructions appear only for the method a customer selects.
- **Stores**: details, services, opening hours, partner brands, and outside, inside and panorama photos.

**Security:** the sign-in is a client-side gate using `environment.adminPasscode`. The mock API has no
authentication, so this is not safe for live data. Add server-side accounts before going live.

## Order flow

Checkout creates an order with status `awaiting-payment`. The customer uploads proof of payment on the
confirmation page (or from their account). Statuses: `awaiting-payment` → `proof-submitted` →
`approved` → `dispatched` → `completed`, with `proof-rejected` (customer re-uploads) and `cancelled`.
The allowed moves are defined in `mock-server/server.mjs` (`TRANSITIONS`).

## Connecting the real backend later

Every HTTP call in this app goes through `core/services/*.service.ts`, and every one of those reads its base
URL from `environment.apiBaseUrl` (`src/environments/environment.ts` for prod builds,
`environment.development.ts` for `ng serve`) — nothing else hardcodes a URL. To point the app at a real
backend instead of the mock: implement the endpoints `mock-server/server.mjs` serves
(`/products`, `/stores`, `/articles`, `/pages`, `/core-pages`, `/payment-methods`, `/orders`, `/uploads`, and friends) and change `apiBaseUrl`. `AuthService`/`CartService`/
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
