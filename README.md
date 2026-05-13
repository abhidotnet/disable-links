# Disable All Links

A Chrome extension (Manifest V3) that **turns off every normal hyperlink on the page you are viewing** so clicks do not navigate away. You can turn links back on when you are done. Useful for presentations, reading without accidents, or checking layouts without leaving the tab.

## Features

- **Disable all links** on the current tab: removes `href`, blocks clicks in the capture phase, and optionally applies clear visual feedback (muted look, not-allowed cursor, small indicator).
- **Enable all links** restores saved `href`, inline `onclick`, and original `style` where the extension changed them.
- **Dynamic pages**: a `MutationObserver` disables new `<a href>` elements added after load (for example infinite scroll or SPA updates).
- **Optional visual effects**: checkbox in the popup; preference is stored with `chrome.storage.local`.
- **Toggle visual mode** adds an extra dashed outline highlight on links (while they stay disabled) for demos or debugging layout.
- **Click feedback**: if someone still tries to click a disabled link, a short “Link disabled!” toast appears.

## How to use

1. Load the extension in Chrome: `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select this folder.
2. Open any normal web page (see limitations below).
3. Click the extension icon → **Disable All Links** (optionally uncheck **Show visual effects** for a subtler look).
4. Use **Enable All Links** to restore navigation.

## Use cases

These are practical scenarios people use “link freeze” tools for:

1. **Presentations and screen sharing**  
   You walk through a live site or dashboard on a call. Disabling links stops an accidental click from opening a new page, logging you out, or jumping into production settings while everyone is watching.

2. **Focused reading or research**  
   You are reading a long article or documentation and want to scroll and select text without mis-clicking ads, related posts, or in-body links. Disable links for that session, then re-enable when you want to navigate again.

3. **QA and visual design checks**  
   Designers or developers verify typography, spacing, or responsive layout without the page changing under them. **Toggle visual mode** makes it obvious which elements were links while you compare before/after screenshots.

4. **Accessibility or training demos**  
   Trainers show “what this page looks like” without students clicking through to unrelated destinations. Combined with visual effects, it is clear that links are intentionally inactive.

5. **Accident-prone browsing contexts**  
   Temporary situations (tired hands, touchpad sensitivity, kids nearby) where you want one tab to stay put until you explicitly turn links back on.

## Project structure

| File | Role |
|------|------|
| `manifest.json` | Extension metadata, permissions, content script registration |
| `content.js` | In-page logic: disable/enable links, observer, notifications |
| `popup.html` / `popup.js` | Toolbar UI and messages to the active tab |
| `background.js` | Service worker: default settings on install |
| `icon16.png`, `icon48.png`, `icon128.png` | Toolbar and store icons (required for packaging) |

## Permissions

| Permission | Why |
|------------|-----|
| `activeTab` | Lets the popup send messages to the tab you are using |
| `scripting` | Listed in `manifest.json` but **not used** by the current code (links run via registered `content_scripts`). You can remove it before publishing if you want the smallest permission set, unless you plan to use `chrome.scripting` later |
| `storage` | Saves the “Show visual effects” checkbox (and install defaults) locally |

No remote servers: state stays on the device in `chrome.storage.local`.

## Limitations

- Affects **`<a href="...">` links** the content script can reach. It does not rewrite buttons, `div` click handlers, or JavaScript navigation that does not go through a normal anchor.
- **Restricted pages** (for example `chrome://`, the Chrome Web Store, PDF viewer, and some `chrome-extension://` contexts) do not run arbitrary extension content scripts; the popup may not be able to control those tabs.
- **Per tab, per load**: behavior applies to the open page until you enable links again or leave the page (full navigation replaces the document).

## Publishing to the Chrome Web Store

1. **Assets**  
   Ensure `icon16.png`, `icon48.png`, and `icon128.png` exist and look sharp at small sizes. Prepare at least one **screenshot** (1280×800 or 640×400) and a short **promo tile** if you use featured placement.

2. **Zip**  
   Zip the extension root **without** parent folder junk: `manifest.json` at the root of the zip, same as this repo layout. Do not include `.git`, `README.md`, or `.gitignore` if you prefer a minimal package (the store accepts docs; omitting is optional).

3. **Privacy practices**  
   In the developer dashboard, state that the extension does **not** collect personal data, does not use remote code, and only uses storage for local UI preferences—matching this codebase.

4. **Single purpose**  
   The store expects one clear purpose: “disable hyperlinks on the active page.” Keep the short description aligned with that.

5. **Versioning**  
   Bump `"version"` in `manifest.json` for each upload (semantic versioning is fine, for example `1.0.1`).

## Development

- Edit `content.js` for page behavior, `popup.js` / `popup.html` for the UI.
- After changes, go to `chrome://extensions` and click **Reload** on the extension card.

## License

Add a `LICENSE` file when you choose a license for distribution (the Web Store listing can link to it).
