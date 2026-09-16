# Architecture

## Domain Model

`Page` is the only entity, keyed by `slug`. There is no separate create step: a page is implicitly created on its first save (`onConflictDoNothing` insert), and a save on an unknown slug with no prior `updatedAt` is that first write. `updatedAt` doubles as the optimistic-concurrency token described below.

```mermaid
classDiagram
    class Page {
        +string Slug
        +string Content
        +DateTime UpdatedAt
    }
```

## Save Flow

Every keystroke debounces into a `savePageFn` call (800ms, via `useAsyncDebouncer`) carrying the `updatedAt` the client last saw. The server only writes if that value still matches the row, so a save that lost a race never silently overwrites a concurrent edit.

```mermaid
sequenceDiagram
    participant Client
    participant Route as "/$" route
    participant Fn as savePageFn
    participant DB as D1 (pages)

    Client->>Route: debounced edit (800ms)
    Route->>Fn: savePageFn(slug, content, expectedUpdatedAt)
    Fn->>DB: UPDATE ... WHERE slug = ? AND updatedAt = expectedUpdatedAt
    alt row matched
        DB-->>Fn: updated row
        Fn-->>Route: ok, new updatedAt
    else no row matched (conflict)
        DB-->>Fn: no row
        Fn->>DB: SELECT current page
        DB-->>Fn: current row
        Fn-->>Route: conflict, current content
        Route->>Client: confirm(): keep mine or reload?
        alt keep mine
            Route->>Fn: savePageFn(..., force: true)
            Fn->>DB: UPSERT (onConflictDoUpdate)
            DB-->>Fn: updated row
            Fn-->>Route: ok, new updatedAt
        else reload
            Route->>Route: replace editor content with current
        end
    end
```

`force: true` bypasses the `updatedAt` check entirely (used for the first write, and for an explicit overwrite after a conflict) via an upsert instead of a conditional update.
