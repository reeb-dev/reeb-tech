#!/usr/bin/env bash
# Clona los repos públicos de reeb-dev en una carpeta hermana (por defecto ~/proyectos).
# No mete clones dentro de reeb-tech. Lo que solo está en el Mac va a _local/.
set -euo pipefail

DEST="${PROYECTOS_DIR:-$HOME/proyectos}"
ORG="https://github.com/reeb-dev"

# Mismos slugs que .agents/PROYECTOS.md (19 públicos). No inventar.
REPOS=(
  reeb-tech
  reeb-dev
  inmobiliaria-sierra-angular
  clavos-band
  tu-ingles-online
  mariana-echeverria-angular
  gymapp-landing
  daily-reflex-tap
  cosmos-simulation
  AntiGastosBoludos
  lectorbarras
  monocontrol-app
  indie-ads-portfolio
  wonderminds
  focusmate-privacy
  antigastos-legal
  monocontrol-privacy
  indie-apps-privacy
  java-linux-ops-lab
)

mkdir -p "$DEST/_local"

echo "Carpeta común: $DEST"
echo

for repo in "${REPOS[@]}"; do
  target="$DEST/$repo"
  if [[ -d "$target/.git" ]]; then
    echo "Ya está: $repo"
    continue
  fi
  if [[ -e "$target" ]]; then
    echo "Salteo $repo: existe una carpeta sin .git"
    continue
  fi
  echo "Clono $repo"
  git clone --depth 1 "$ORG/$repo.git" "$target"
done

workspace="$DEST/proyectos.code-workspace"
{
  echo '{'
  echo '  "folders": ['
  first=1
  for repo in "${REPOS[@]}"; do
    if [[ -d "$DEST/$repo" ]]; then
      if [[ $first -eq 0 ]]; then
        echo ','
      fi
      printf '    { "name": "%s", "path": "%s" }' "$repo" "$DEST/$repo"
      first=0
    fi
  done
  if [[ -d "$DEST/_local/inmobiliaria-crm" ]]; then
    if [[ $first -eq 0 ]]; then
      echo ','
    fi
    printf '    { "name": "inmobiliaria-crm", "path": "%s/_local/inmobiliaria-crm" }' "$DEST"
  fi
  echo
  echo '  ]'
  echo '}'
} > "$workspace"

echo
echo "Listo. Abrí $workspace en Cursor,"
echo "o entrá a un repo y corré: opencode"
echo
echo "Si el CRM solo está en el Mac:"
echo "  mv /Users/manuelreeb/Downloads/inmobiliaria-crm $DEST/_local/inmobiliaria-crm"
echo "Otros proyectos sin GitHub: movelos a $DEST/_local/"
