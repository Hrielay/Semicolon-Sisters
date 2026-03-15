#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# ── 1. Ensure uv is available ──────────────────────────────────────────────────
if ! command -v uv &>/dev/null; then
  echo "Installing uv..."
  curl -LsSf https://astral.sh/uv/install.sh | sh
  # Add uv to PATH for the rest of this script
  export PATH="$HOME/.local/bin:$PATH"
fi

# ── 2. Ensure Python 3.11+ is available via uv ────────────────────────────────
if ! uv python find ">=3.11" &>/dev/null; then
  echo "Installing Python 3.11..."
  uv python install 3.11
fi

# ── 3. Create virtual environment ─────────────────────────────────────────────
uv venv .venv --python 3.11

# ── 4. Install dependencies ───────────────────────────────────────────────────
uv pip install -r requirements.txt

# ── 5. Copy env template if .env doesn't exist ────────────────────────────────
if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "Created .env from template — add your OPENAI_API_KEY before running."
fi

echo ""
echo "Done. Activate with:"
echo "  source agents/.venv/bin/activate"
