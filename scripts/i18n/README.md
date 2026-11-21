# Reviewing Russian translations before deployment

English is the source language. The home page, timeline, and case studies live in `content/home/home.md`, `content/timeline/timeline.md`, and `content/cases/<slug>/index.md`. Each Russian translation is a sibling file with the suffix `.ru.md`. The author can edit the Russian wording independently.

## Review in chat

Before deploying from chat, run `python3 scripts/i18n/release.py status` from the repository root. For each English file with pending changes, show the old and new wording alongside the corresponding Russian paragraphs. Ask the author to choose one of the following actions for each file and wait for their answer.

| Choice in chat | Action |
| --- | --- |
| **«Игнорировать»** (Ignore) | Keep the current Russian wording and record the decision with `python3 scripts/i18n/release.py accept ignore <english-path> <review>`. Revisit the accepted difference only if the author asks. |
| **«Обновить русскую версию»** (Update the Russian version) | Offer translations for each changed paragraph or text field. The author can pick a suggestion or supply their own wording. Apply the approved text, preserve other manual edits, then run `python3 scripts/i18n/release.py accept translated <english-path> <review>`. |
| **«Пока не переводить»** (Defer translation) | Deploy the current files and keep the difference open for the next review. |

Use the `review` hash printed by `status` for the English file under review. After recording the decisions, run `status` again. Commit the updated `state.json` together with any approved translations. Once all English changes are accounted for, a push to `main` deploys both languages with a shared content version.

## Release versions

`state.json` stores the accepted English source and the Russian wording at the time of each decision. The next review compares the current files with that snapshot.

Release versions use Git commit timestamps in UTC, to the nearest second. Local edits appear as drafts until committed.

- **All English changes reviewed.** Both languages share the timestamp of the latest commit that changed either language’s Markdown or the review state.
- **Translation deferred.** The English version uses the latest English Markdown commit. The Russian version uses the latest commit that changed Russian Markdown or the review state.

The script compares the text itself to detect pending changes, even when two timestamps match. Rebuilding the same commit produces the same version.

## Change history and deployment reports

Run `python3 scripts/i18n/release.py log` to see committed changes in both languages and the current working-tree diff. To select a commit range, use `python3 scripts/i18n/release.py log <old-sha>..<new-sha>`. Multiple saves between commits appear as a single diff.

GitHub Actions attaches the Markdown change log and translation report to each Deploy run. A push to `main` or a manual run from GitHub deploys the current English and Russian files. Pending translations are automatically deferred and appear in subsequent reports until the author reviews them.
