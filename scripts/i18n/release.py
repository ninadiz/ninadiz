"""Review bilingual Markdown before deployment. No external services required."""
import argparse
from datetime import datetime, timezone
import difflib
import hashlib
import json
from pathlib import Path
import subprocess

STATE = Path("scripts/i18n/state.json")
PATTERNS = ["content/home/home.md", "content/timeline/timeline.md", "content/cases/*/index.md"]


def read(path):
    return path.read_text() if path.exists() else None


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True).encode()).hexdigest()


def snapshot():
    state = json.loads(STATE.read_text())
    paths = set(state)
    for pattern in PATTERNS:
        paths.update(str(p) for p in Path().glob(pattern))
    pairs = {p: {"en": read(Path(p)), "ru": read(Path(p).with_suffix(".ru.md"))} for p in sorted(paths)}
    return state, pairs


def diff(path, before, after):
    return "\n".join(difflib.unified_diff((before or "").splitlines(), (after or "").splitlines(),
                                        fromfile="accepted/" + path, tofile="current/" + path, lineterm=""))


def release_date(paths):
    # A local edit has no reproducible release date until Git records it.
    changes = subprocess.check_output(
        ["git", "status", "--porcelain", "--untracked-files=all", "--", *paths], text=True
    )
    if changes:
        return "черновик (до коммита)"
    timestamp = subprocess.check_output(
        ["git", "log", "-1", "--format=%ct", "--", *paths], text=True
    ).strip()
    if not timestamp:
        return "нет зафиксированной версии"
    return datetime.fromtimestamp(int(timestamp), timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")


def report(state, pairs):
    pending = []
    for path, pair in pairs.items():
        base = state.get(path, {})
        if base.get("en") != pair["en"]:
            pending.append(path)
            print(f"\n{path}  review={digest(pair['en'])}")
            print(diff(path, base.get("en"), pair["en"]) or "Изменилось наличие файла.")
            if pair["ru"] is None:
                print("Русский файл отсутствует.")
        if base.get("ru") != pair["ru"]:
            ru = str(Path(path).with_suffix(".ru.md"))
            print(diff(ru, base.get("ru"), pair["ru"]) or f"Изменилось наличие {ru}.")
    ru_paths = [p[:-3] + ".ru.md" for p in PATTERNS]
    if pending:
        en_version = release_date(PATTERNS)
        ru_version = release_date([*ru_paths, str(STATE)])
        print(f"Версии контента: EN {en_version}, RU {ru_version}")
    else:
        print(f"Общая версия контента EN/RU: {release_date([*PATTERNS, *ru_paths, str(STATE)])}")
    return pending


def main():
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("status")
    commands.add_parser("deploy-report")
    history = commands.add_parser("log")
    history.add_argument("revision", nargs="?")
    accept = commands.add_parser("accept")
    accept.add_argument("decision", choices=["ignore", "translated"])
    accept.add_argument("path")
    accept.add_argument("review", help="English content hash printed by status")
    args = parser.parse_args()
    if args.command == "log":
        patterns = [p for en in PATTERNS for p in (en, en[:-3] + ".ru.md")]
        subprocess.run(["git", "log", "--reverse", "-p", *([args.revision] if args.revision else []),
                        "--", *patterns], check=True)
        subprocess.run(["git", "diff", "HEAD", "--", *patterns], check=True)
        for path in subprocess.check_output(["git", "ls-files", "--others", "--exclude-standard",
                                             "--", *patterns], text=True).splitlines():
            print(diff(path, None, read(Path(path))))
        return
    state, pairs = snapshot()
    if args.command == "accept":
        pair = pairs.get(args.path)
        if pair is None or digest(pair["en"]) != args.review:
            parser.error("Оригинал изменился. Сначала повторите status.")
        if args.decision == "translated" and pair["en"] is not None and not pair["ru"]:
            parser.error("Сначала сохраните согласованный перевод.")
        state[args.path] = {**pair, "decision": args.decision}
        temporary = STATE.with_suffix(".tmp")
        temporary.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")
        temporary.replace(STATE)
        return
    pending = report(state, pairs)
    if pending:
        if args.command == "deploy-report":
            print("Пока не переводить. Отложенные изменения включены в отчёт.")
        else:
            print("Игнорировать / обновить русскую версию / пока не переводить?")



if __name__ == "__main__":
    main()
