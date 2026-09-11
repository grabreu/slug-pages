# slug-pages

Anonymous, no-login scratchpad — navigate to any URL and start typing.

## Language

**Page**:
A public, anonymous note identified by its `slug`. Visiting an unused slug shows an empty, editable Page; the row is only created implicitly on the first save.
_Avoid_: Document, Note, Post

**Slug**:
The URL-safe identifier for a Page. Immutable, unique, and doubles as both the Page's identity and its address.
_Avoid_: ID, path, key

**Content**:
The raw Markdown text of a Page.

**Updated At**:
The timestamp of a Page's last write. Used as the optimistic-concurrency token — see `README.md` for how it resolves conflicts.
