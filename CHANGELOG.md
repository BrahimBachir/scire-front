# [2.2.0](https://github.com/BrahimBachir/scire-front/compare/v2.1.8...v2.2.0) (2026-08-15)


### Features

* **course-header:** resume course at last studied topic/article ([e8674af](https://github.com/BrahimBachir/scire-front/commit/e8674af11b82321c100ac9baee3fc1a33e91b13c))

## [2.1.8](https://github.com/BrahimBachir/scire-front/compare/v2.1.7...v2.1.8) (2026-08-15)


### Bug Fixes

* **build:** wire up fileReplacements for the production environment file ([ba9931f](https://github.com/BrahimBachir/scire-front/commit/ba9931f6e4c744aa872808ab1434a3b08c313dfb))
* **config:** point api_base_url at opos-api's actual port, use kaptya.com in prod ([73d15c6](https://github.com/BrahimBachir/scire-front/commit/73d15c6aef1029ea907cd5c298d407b776cdfa67))
* **notes:** scope notes to their course and fix article selection not saving ([358c907](https://github.com/BrahimBachir/scire-front/commit/358c907fae8f0b38e650c689273fbbba4b7c08c6))

## [2.1.7](https://github.com/BrahimBachir/scire-front/compare/v2.1.6...v2.1.7) (2026-08-10)


### Bug Fixes

* **build:** wire up fileReplacements for the production environment file ([148c741](https://github.com/BrahimBachir/scire-front/commit/148c741b028b0d49626bbc3544605c8c9c492602))

## [2.1.6](https://github.com/BrahimBachir/scire-front/compare/v2.1.5...v2.1.6) (2026-08-10)


### Bug Fixes

* **deps:** pin Angular monorepo packages to one exact version ([1e1a234](https://github.com/BrahimBachir/scire-front/commit/1e1a2347571f141878aaa83f9f10b3567920f41b))
* **docker:** bump build stage from Node 19 to Node 22 ([ebea6cc](https://github.com/BrahimBachir/scire-front/commit/ebea6cc5775bd76fed648cb1303d439d5ce6baaf))
* **docker:** copy the built app from dist/front/browser, not dist/front ([4d35027](https://github.com/BrahimBachir/scire-front/commit/4d3502790272550d463c6816c23a78c126ad056d))
* **registration:** delete default data ([95e3e21](https://github.com/BrahimBachir/scire-front/commit/95e3e2158fd728a0a9627f1ad9aea95426e011df))

## [2.1.5](https://github.com/BrahimBachir/scire-front/compare/v2.1.4...v2.1.5) (2026-08-10)


### Bug Fixes

* **docker:** copy the built app from dist/front/browser, not dist/front ([9a90b07](https://github.com/BrahimBachir/scire-front/commit/9a90b0767d434b5c48b001d67522ada2293aeaf6))

## [2.1.4](https://github.com/BrahimBachir/scire-front/compare/v2.1.3...v2.1.4) (2026-08-10)


### Bug Fixes

* **docker:** bump build stage from Node 19 to Node 22 ([ed84db5](https://github.com/BrahimBachir/scire-front/commit/ed84db5ae30b2ef18f510e73930a680b91491737))

## [2.1.3](https://github.com/BrahimBachir/scire-front/compare/v2.1.2...v2.1.3) (2026-08-10)


### Bug Fixes

* **deps:** pin Angular monorepo packages to one exact version ([93bf9fa](https://github.com/BrahimBachir/scire-front/commit/93bf9fae78e308efdbaf2cc0b0dd010bad7ad723))

## [2.1.2](https://github.com/BrahimBachir/scire-front/compare/v2.1.1...v2.1.2) (2026-08-10)


### Bug Fixes

* **deps:** regenerate package-lock.json to resolve Angular peer conflict ([56d2b1e](https://github.com/BrahimBachir/scire-front/commit/56d2b1ee99f07c32421466214338c90c2bfd169f))

## [2.1.1](https://github.com/BrahimBachir/scire-front/compare/v2.1.0...v2.1.1) (2026-08-10)


### Bug Fixes

* **deps:** regenerate package-lock.json to resolve Angular peer conflict ([f571af2](https://github.com/BrahimBachir/scire-front/commit/f571af26591d3e5d6e7a88fda236026834f8b621))

# [2.1.0](https://github.com/BrahimBachir/scire-front/compare/v2.0.1...v2.1.0) (2026-08-10)


### Bug Fixes

* **payments:** route paid-plan changes through Stripe Checkout from account settings ([31c58e1](https://github.com/BrahimBachir/scire-front/commit/31c58e1047decdfe7c6dde46e31db922872c58ee))


### Features

* **payments:** wire pricing page to Stripe Checkout for paid plans ([21ce324](https://github.com/BrahimBachir/scire-front/commit/21ce3247c33f0984c9123aa0908890a8a72ea25c))

## [2.0.1](https://github.com/BrahimBachir/scire-front/compare/v2.0.0...v2.0.1) (2026-08-09)


### Bug Fixes

* **theme,dashboard:** persist theme preference; bind readiness/countdown card ([2ffcd76](https://github.com/BrahimBachir/scire-front/commit/2ffcd76140c3606ef786eca5a1451d7e7659668f))

# [2.0.0](https://github.com/BrahimBachir/scire-front/compare/v1.1.0...v2.0.0) (2026-08-09)


* feat(rules)!: rework rule/article authoring into modular form + HTML article content ([5720616](https://github.com/BrahimBachir/scire-front/commit/572061665742b6faf0675a536b6ee306faa977f7))
* feat(test)!: rework test/exercise/question data model, add simulator + results UI ([993de37](https://github.com/BrahimBachir/scire-front/commit/993de37a6daaa4cb06b9c699f0be51141b06c137))


### Bug Fixes

* **courses:** support query params on getMyCourses ([6ef5304](https://github.com/BrahimBachir/scire-front/commit/6ef530478460a36328d59db8507ead7a6a09e2b5))


### Features

* **auth:** switch to httpOnly-cookie rotating refresh tokens ([da35aa1](https://github.com/BrahimBachir/scire-front/commit/da35aa1c483cf180cf5ac46a886d88e3fead4ef5))
* **calendar:** generate a study schedule and sync it to the calendar ([7606733](https://github.com/BrahimBachir/scire-front/commit/7606733126dff494f662566e3f0299b560eac1c0))
* **courses:** my-courses filtering, announcements, course-list/detail cleanup ([ff1c256](https://github.com/BrahimBachir/scire-front/commit/ff1c25672c60dd5d7b1b2e4b176115299faf3c3d))
* **courses:** update content forms for exercise/diagram/question field renames ([e0293c8](https://github.com/BrahimBachir/scire-front/commit/e0293c89d17a3f60d9acb30bec69b1ecf570afba))
* **dashboard:** replace stats module with basic/advanced metrics dashboards ([95e59f0](https://github.com/BrahimBachir/scire-front/commit/95e59f066a48f2f73fe29f9dba8026042b032337))
* **filters:** add reusable multi-select directive and topic/test-type filters ([b7059aa](https://github.com/BrahimBachir/scire-front/commit/b7059aa3f3cd6c9e2b0efde569bf9550ccec7217))
* **illustrations:** add themeable SVG illustration system ([664182e](https://github.com/BrahimBachir/scire-front/commit/664182e442535d57c1f94de394fea74175cbed6e))
* **kanban:** replace mock Kanban with real Epic/Task board ([2b9dca3](https://github.com/BrahimBachir/scire-front/commit/2b9dca3c280293ebbb34514914ef63e9f940ce3c))
* **plan:** add multi-active-plan support (guards, store, UI) ([7cbb52b](https://github.com/BrahimBachir/scire-front/commit/7cbb52bdeffac1eb4045d8e4c73316a57617db6f))


### BREAKING CHANGES

* depends on opos-api's reworked rule/article CRUD
(HTML article content instead of raw BOE paragraph data, PATCH/DELETE
scoped to the rule's creator).

- Replace the single create-edit-rule component with RuleWrapper +
  a modular RuleForm (articles table + per-article dialog for
  UI-authored rules, alongside the existing from-BOE flow).
- Article content now renders as HTML (article-content, article-tabs,
  article-stepper, topic-content) instead of raw paragraph arrays.
- multi-select reusable component and article-progress.facade.ts
  updated to match.
* depends on opos-api's TestsTopics many-to-many model,
TestTypeCode.SYLLABUS (was REVIEW), and the exercises_number/penalty
field renames.

- New TestStrategy/ExerciseStrategy/TopicStrategy/AiStrategy
  (replacing the misspelled *.startegy.ts files) build reactive forms
  against the new field names.
- test-dialog replaces the old add-test/test-dialog-content flow,
  branching per test type (definitions/deadlines/mock/syllabus
  review) via TestTypeCode.
- Add a test simulator (with a countdown timer) and a test-results
  module (score, percentage/difference breakdowns, basic numbers/pie,
  time-per-question) - both entirely new.
- create-generic-element dialog now also supports creating ITest
  entities.
* **dashboard:** the old /learning/stats endpoint is gone. Depends
on opos-api's basic-metrics/advanced-metrics endpoints.

- Basic dashboard: overview, activity, next-up, readiness/countdown,
  topics-progress, and an upgrade-cta card for lower-tier plans.
- Advanced dashboard: hero, activity chart, skills radar, study plan,
  topic performance, weak spots.
- Breadcrumb now shows an exam-readiness widget via
  BasicMetricsService.
* **plan:** assumes the backend's User.user_plans[] shape
(multiple concurrently-active plans) rather than a single plan.

- PlanGuard/PlanRedirectGuard/RoleRedirectGuard gate routes and
  redirect based on the user's active plan/role.
- Add changePlan/resetPlan actions+effects+service calls for
  self-service plan changes from account settings.
- Fix plan-filter.pipe.ts: it previously subscribed and returned
  before the async result resolved, so it always produced a stale
  value - now returns an Observable properly.
- Sidebar/nav items and pricing page reflect plan-gated navigation.

# [1.1.0](https://github.com/BrahimBachir/scire-front/compare/v1.0.0...v1.1.0) (2026-02-13)


### Features

* **features:** refactor course features to be scalable ([3c141ba](https://github.com/BrahimBachir/scire-front/commit/3c141ba0d73e4e1e1044a461c931243a1a516c9f))
* **login:** adding attempts control ([70d6e74](https://github.com/BrahimBachir/scire-front/commit/70d6e74419c4cc63a12e9f5a4f8829e0efda1ded))

# 1.0.0 (2025-12-24)


### Features

* initial release ([3acd173](https://github.com/BrahimBachir/opos-front/commit/3acd173581f0b15d74994ae0481f48d33dd440b7))
