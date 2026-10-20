#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
for prog in kitty openbox gtk-launch python3 wmctrl xprop; do
  command -v "$prog" >/dev/null 2>&1 || { echo "Missing $prog: install dependencies." >&2; exit 1; }
done
python3 -c "import gi; gi.require_version('Gtk', '3.0'); from gi.repository import Gtk" || { echo "Missing python3-gi / GTK3 gir bindings." >&2; exit 1; }
mkdir -p "$HOME/.local/bin" "$HOME/.config/brack-terminal" /tmp
install -m 755 bin/-rr "$HOME/.local/bin/-rr"
install -m 755 bin/u "$HOME/.local/bin/u"
install -m 755 bin/brack-update "$HOME/.local/bin/brack-update"
install -m 644 VERSION "$HOME/.config/brack-terminal/version"
install -m 755 bin/brack-color "$HOME/.local/bin/brack-color"
install -m 755 bin/brack-windows "$HOME/.local/bin/brack-windows"
install -m 755 bin/brack-minibar "$HOME/.local/bin/brack-minibar"
if [ ! -f "$HOME/.config/brack-terminal/kitty.conf" ]; then
  "$HOME/.local/bin/brack-color" royal
fi
if [ ! -e "$HOME/.config/brack-terminal/bashrc" ]; then
  install -m 644 config/bashrc "$HOME/.config/brack-terminal/bashrc"
else
  echo 'Preserving the existing legacy shell configuration for compatibility.'
fi
sudo install -m 755 bin/brack-terminal-session /usr/local/bin/brack-terminal-session
printf '[Desktop Entry]\nName=AppendHub Desktop (Public Beta)\nComment=Terminal-first desktop session for Debian 13\nExec=/usr/local/bin/brack-terminal-session\nType=Application\nDesktopNames=APPENDHUB;BRACK;\n' | sudo tee /usr/share/xsessions/brack-terminal.desktop >/dev/null
echo 'AppendHub Desktop v0.6.0 (Public Beta) installed.'
if [ -f "$HOME/.config/brack-terminal/updater.json" ]; then
  echo 'Checking configured GitHub release for newer updates (no automatic installation)...'
  "$HOME/.local/bin/brack-update" --check || true
else
  echo 'To enable GitHub updates, configure: brack-update --repo OWNER/REPOSITORY'
fi
