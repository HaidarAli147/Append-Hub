# AppendHub Desktop (Public Beta)

- Website page: `/desktop/`
- Download: `downloads/brack-terminal-desktop-v0.6.0.zip`
- SHA-256: `downloads/brack-terminal-desktop-v0.6.0.zip.sha256`
- Source: `source/`
- Target described by upstream documentation: Debian 13, X11
- Source provenance: `HaidarAli147/brack-tdx` `main` at `0e8b59c11111f2f36a3cbb22a227f8759aa5e118`

The ZIP is an editable source archive with the install script, not a prebuilt disk image. Its SHA-256 is generated locally and verified against the published checksum file. The upstream repository has no `LICENSE` file. Compatibility identifiers used by existing installations are documented in `source/README.md`.

## Latest Append TDX website content

The website's /desktop/ page now describes the current upstream GitHub main code: dedicated GTK/VTE desktop terminal surface, X11/Openbox session, optional purple tint2 taskbar, session-bound volume/brightness and screenshot shortcuts, and terminal-based controls such as `/settings`, `/wifi`, and `update tdx`.

**Important release separation:** `downloads/brack-terminal-desktop-v0.6.0.zip` is the archived v0.6.0 beta. Its checksum and existing archive must not be presented as the latest desktop build. The page links to GitHub source for the new code. Automated syntax checks passed upstream; full on-device visual and hardware testing remains outstanding.
