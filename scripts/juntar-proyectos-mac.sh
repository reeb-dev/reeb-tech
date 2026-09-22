#!/usr/bin/env bash
# Junta proyectos en ~/Documents/Proyectos_REEB (mover, no copiar).
# Uso en el Mac:
#   bash scripts/juntar-proyectos-mac.sh          # solo muestra
#   bash scripts/juntar-proyectos-mac.sh --aplicar
set -euo pipefail

DEST="${PROYECTOS_DIR:-$HOME/Documents/Proyectos_REEB}"
APLICAR=0
if [[ "${1:-}" == "--aplicar" ]]; then
  APLICAR=1
fi

mover() {
  local src="$1"
  local name="$2"
  local target="$DEST/$name"

  if [[ ! -e "$src" ]]; then
    return 0
  fi
  if [[ "$src" -ef "$target" ]] 2>/dev/null; then
    echo "Ya está en destino: $name"
    return 0
  fi
  if [[ -e "$target" ]]; then
    echo "NO muevo (ya existe en Proyectos_REEB): $name"
    echo "  origen: $src"
    return 0
  fi
  echo "Mover: $src -> $target"
  if [[ "$APLICAR" -eq 1 ]]; then
    mkdir -p "$DEST"
    mv "$src" "$target"
  fi
}

echo "Destino: $DEST"
if [[ "$APLICAR" -eq 0 ]]; then
  echo "Modo ensayo (no cambia nada). Para ejecutar: bash scripts/juntar-proyectos-mac.sh --aplicar"
  echo
fi

mkdir -p "$DEST/_local"

# ~/Projects → raíz de Proyectos_REEB
mover "$HOME/Projects/doomlike" "doomlike"
mover "$HOME/Projects/escueladeingles" "escueladeingles"
mover "$HOME/Projects/freelance-assistant" "freelance-assistant"
mover "$HOME/Projects/iorio-platform" "iorio-platform"
mover "$HOME/Projects/reeb-dev" "reeb-dev"

# Ya movidos / destino
if [[ -d "$DEST/reeb-tech" ]]; then
  echo "Ya está: reeb-tech"
else
  mover "$HOME/Downloads/reeb-tech" "reeb-tech"
fi
if [[ -d "$DEST/_local/inmobiliaria-crm" ]]; then
  echo "Ya está: _local/inmobiliaria-crm"
else
  mover "$HOME/Downloads/inmobiliaria-crm" "_local/inmobiliaria-crm"
fi

# Descargas: productos / labs (no demos sueltas del hub)
mover "$HOME/Downloads/automotores-crm" "_local/automotores-crm"
mover "$HOME/Downloads/agent_organico_repo" "_local/agent_organico_repo"
mover "$HOME/Downloads/analizador_mercado_android_y_generador_ideas_apps_v1_crewai-project" "_local/analizador-mercado-android"
mover "$HOME/Downloads/java-linux-ops-lab" "java-linux-ops-lab"
mover "$HOME/Downloads/cosmos-simulation" "cosmos-simulation"
mover "$HOME/Downloads/daily-reflex-tap" "daily-reflex-tap"
mover "$HOME/Downloads/demos-rubros" "_local/demos-rubros"

# Spring en Downloads si no está ya en Proyectos_REEB
if [[ ! -d "$DEST/spring-backend-training" ]]; then
  mover "$HOME/Downloads/spring-backend-training" "spring-backend-training"
fi

echo
echo "No se toca: INGRESO-BP4, facturas, CVs, películas, .dmg, fotos, WhatsApp."
echo "No se mueven demos sueltas de Downloads (taller, kiosco, peluqueria…): viven en reeb-tech/public/demos/."
echo
if [[ "$APLICAR" -eq 0 ]]; then
  echo "Si la lista está bien, corré de nuevo con --aplicar."
else
  echo "Listo. Revisá: ls $DEST"
  echo "Si ~/Projects quedó vacío, podés borrar esa carpeta a mano."
fi
