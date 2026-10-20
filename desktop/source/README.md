# AppendHub Desktop (Public Beta)

AppendHub Desktop is an experimental, terminal-first desktop session for **Debian 13**. It uses Bash, Kitty, Openbox, GTK 3, and X11 utilities. This is a desktop session installed alongside the system's existing desktop, not a standalone Linux distribution.

## Public beta notice

This software is under development. Bugs, unexpected behavior, and compatibility issues may occur. Debian 13 is the documented target; other distributions and hardware have not been verified. Back up important files before installing, review the requirements, and keep an existing desktop session available as a fallback.

## Included features

- Run ordinary shell commands and launch installed graphical applications from the session.
- List and focus application windows; minimized windows appear in a small GTK bar.
- Preview application removal and explicitly confirm before invoking `apt remove`.
- Select a Kitty color theme.
- Check a configured public GitHub Release and verify ZIP SHA-256 before an explicitly confirmed update.
- Preserve other desktop sessions so they remain selectable from the display manager.

## Requirements

The source project documents Debian 13 on an X11 session as its target; a full installation was not independently verified as part of this integration. Required commands and Python GTK bindings are checked by the installer. Install the listed packages before running the installer:

```sh
sudo apt update
sudo apt install --no-install-recommends git kitty openbox libgtk-3-bin python3 python3-gi gir1.2-gtk-3.0 wmctrl x11-utils unzip
```

The installer also requires `sudo` to register the display-manager session under `/usr/share/xsessions` and install a launcher in `/usr/local/bin`. Review `install.sh` before running it. It does not remove the existing desktop. On upgrades, the existing shell configuration at `~/.config/brack-terminal/bashrc` is preserved; manually review any changes to default configuration.

## Install

Extract the archive and run:

```sh
cd brack-terminal-desktop
bash install.sh
```

Log out and select **AppendHub Desktop (Public Beta)** from the display manager. To return to the prior desktop, log out and select its existing session. There is currently no uninstaller.

## Commands

- `ls -rr` lists installed graphical applications.
- `-rr APP NAME` starts an application without blocking the shell.
- `u -rr APP NAME` previews and confirms an application removal.
- `brack-tabs` and `brack-switch NUMBER` list and focus windows.
- `brack-color royal` selects the royal-purple theme.
- `brack-update --check` checks a configured public GitHub Release.
- `exit` ends the current session.

## Version and update source

Version: `0.6.0` (Public Beta). The upstream GitHub repository remains `HaidarAli147/brack-tdx`; the updater command and release asset format are retained for compatibility. No AppendHub Desktop release has been published from this website repository. Do not configure an update source until its release assets are available.

## Compatibility identifiers

The existing `brack-*` commands, `brack-terminal-session` executable, `brack-terminal.desktop` session ID, `XDG_SESSION_DESKTOP=brack-terminal`, and `~/.config/brack-terminal` settings directory are retained so upgrades do not orphan existing settings or updater configuration. The user-facing session name and application window title use AppendHub Desktop.

## Source provenance and licensing

Copied from `https://github.com/HaidarAli147/brack-tdx`, branch `main`, commit `0e8b59c11111f2f36a3cbb22a227f8759aa5e118` (2026-10-20). The upstream checkout did not contain a license file; this beta package does not add or imply a license. Confirm licensing and third-party notices before redistribution as a stable release.
