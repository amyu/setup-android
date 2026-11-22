# Repository guidance

## Language

- Use English for all repository-facing content, including commit messages,
  pull request titles and descriptions, review comments, issue content, release
  names and notes, documentation, source comments, and user-facing messages.
- Conversation with the repository owner may remain in Japanese.
- Do not rewrite published Git history solely to translate historical commit
  messages.

## Validation

- Run `pnpm run check` to check linting, formatting, and types.
- If the formatter flags a file, run `pnpm exec oxfmt --write <file>`.
- After changing the action source, run `pnpm run package` to rebuild the
  committed `dist/` bundles.
