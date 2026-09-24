/**
 * Cross-entity foreign key types (D24). Kept in their own leaf module —
 * `Project`, `Finish` and `ServiceArea` all need `ProjectId`, and putting it
 * on any one of them would create a circular import between their schema
 * files.
 */

/**
 * A cross-entity foreign key: the stable `es` slug a project was authored
 * under (`Project.slug.es`), never locale-resolved. Every FK array that
 * points at a project (`Finish.projects`, `ServiceArea.projects`) is typed
 * `ProjectId[]`, not `string[]`, so a reader can tell "this is an
 * identifier, look it up" from "this is display text" at the type level.
 * Resolving one to the CURRENT locale's slug (for a link href) means
 * looking the project up by this id and reading `getProject(id,
 * locale).slug` — the id itself always stays pinned to `es`.
 */
export type ProjectId = string
