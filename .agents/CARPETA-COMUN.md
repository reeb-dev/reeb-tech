# Una carpeta para todos los proyectos

Los repos no van adentro de `reeb-tech`. Van **al lado**, en una carpeta del Mac:

```text
~/proyectos/
  reeb-tech/                      ← este sitio (hub + /cv/)
  reeb-dev/                       ← README del perfil
  inmobiliaria-sierra-angular/
  clavos-band/
  tu-ingles-online/
  mariana-echeverria-angular/
  gymapp-landing/
  daily-reflex-tap/
  cosmos-simulation/
  AntiGastosBoludos/
  lectorbarras/
  monocontrol-app/
  indie-ads-portfolio/
  wonderminds/
  focusmate-privacy/
  antigastos-legal/
  monocontrol-privacy/
  indie-apps-privacy/
  java-linux-ops-lab/
  _local/
    inmobiliaria-crm/             ← no está en GitHub público; moverlo desde el Mac
```

## Qué entra y qué no

| Origen | Cómo llega |
| --- | --- |
| Repos públicos de `reeb-dev` | `scripts/clonar-proyectos.sh` (GitHub) |
| Hechos en Cursor / otro modelo **y ya subidos** | El mismo script, si el remoto es de `reeb-dev` |
| Solo en el Mac (sin GitHub) | Los movés vos a `~/proyectos/_local/` |
| CRM inmobiliario | Copiar o mover `/Users/manuelreeb/Downloads/inmobiliaria-crm` → `~/proyectos/_local/inmobiliaria-crm` |
| Herramientas internas de BP4 | No. No son portfolio público |

Cursor y OpenCode no “descubren” solos todo el disco. Abrís **una carpeta de repo** (o el workspace que genera el script) y trabajás ahí.

## En el Mac

```bash
# 1) Clonar los de GitHub (la carpeta se crea si no existe)
cd /ruta/a/reeb-tech
bash scripts/clonar-proyectos.sh

# otra ubicación:
PROYECTOS_DIR="$HOME/Documents/proyectos" bash scripts/clonar-proyectos.sh
```

```bash
# 2) Lo que solo está en el Mac
mkdir -p ~/proyectos/_local
# ejemplo del CRM:
mv /Users/manuelreeb/Downloads/inmobiliaria-crm ~/proyectos/_local/inmobiliaria-crm
```

```bash
# 3) Abrir
# Cursor: File → Open Folder → ~/proyectos   (o el .code-workspace que deja el script)
# Un repo: cd ~/proyectos/clavos-band && opencode
```

La lista con descripciones sigue en `.agents/PROYECTOS.md`. Si aparece un repo nuevo, actualizá ese archivo y volvé a correr el script.
