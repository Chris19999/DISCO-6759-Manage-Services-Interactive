# Manage Services — Developer Spec

**Ticket:** DISCO-6759
**Figma:** [Design File](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal)

**Interactive Mockups:**
- [TV](./tv/manage-services.html) (1920x1080, remote control)
- [Web](./web/manage-services.html) (1250x1080, mouse/keyboard)
- [Mobile](./mobile/manage-services.html) (393x854, touch)

---

## Chroma Components

| Component | Usage |
|-----------|-------|
| Sheet / Panel | Side panel (TV), modal (web/mobile) |
| ListItem / Service List | Service rows on all platforms |
| Switch | Toggle on/off per service |
| Button | Sort chip, back button, close button |
| Badge | My Services count indicator |
| Inputs/Checkbox | Channel selection in More Options |
| JumpBar | A-Z scrubber (TV only, alphabetical sort) |
| _ListActionButton | Three-dot menu (TV only, focused rows with options) |
| Ultrablur | Background effect (web/mobile) |
| Stack | Layout container |
| ResponsiveIcon | Icons throughout |

---

## Cross-Platform Behaviors

### Service Row Interaction

| State | Click/tap left side | Switch |
|-------|-------------------|--------|
| **OFF** (no options) | Toggles ON | Toggles ON |
| **ON** (no options) | Toggles OFF | Toggles OFF |
| **ON** (has options) | Opens More Options | Toggles OFF |
| **OFF** (has options) | Toggles ON | Toggles ON |

### Deselect Animation
1. Service row in My Services fades to 30% opacity over **1 second**
2. After fade, row collapses out (height → 0, 0.3s)
3. **During the 1s fade window**, user can re-select (click left side, tap switch, or press Enter on TV) to cancel the removal
4. Re-selecting cancels the timeout, removes fade animation classes, and re-renders the service as enabled

### Scroll Stability
When a service is toggled on/off, the currently focused/visible row must stay at the **same screen Y position**. The "All Services" header is used as the anchor point — its `getBoundingClientRect().top` is measured before and after render, and `scrollTop` is adjusted by the drift.

When My Services becomes empty (blank state), scroll resets to top.

### Search Results
[View in Figma — Web](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=287-36793) · [View in Figma — Mobile](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=209-29078)

- Direct service matches appear first
- "Channel available through:" section groups sub-channels under parent services
- **Parent services** render at 70% opacity with disabled (non-interactive) switches and no subtitle
- **Sub-channel icons** (48x48) right-align with parent service icons (56x56 on web/mobile)
- Clicking a sub-channel checkbox toggles it and auto-enables the parent service if needed

### Icon Sizes

| Element | TV | Web / Mobile |
|---------|-----|-------------|
| Service icon | 80x80 | 56x56 |
| Sub-channel icon | 48x48 | 48x48 |

---

## TV Platform (1920x1080)

[View in Figma — Default](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=146-22367) · [View in Figma — Alphabetical + JumpBar](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=215-45840) · [View in Figma — Focus + Action Button](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=146-26164) · [View in Figma — More Options](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=146-30632)

### Input Model
- **Arrow keys**: Move focus within the current zone
- **Enter**: Activate focused element (toggle, open sort, open more options, select jumpbar letter)
- **Backspace**: Go back (close sort overlay, close more options, exit jumpbar)
- No mouse or touch input

### Panel Layout
- Sheet: **864px** wide, flush right
- Inner panel: **32px** margin from sheet edges, `border-radius: 16px`
- Background: `rgba(0,0,0,0.8)` + `backdrop-filter: blur(32px)`
- Content area: `padding: 48px 64px 0 64px` (128px right padding when JumpBar active)

### Focus Zones
Four independent zones, each tracking its own `focusIndex`:

| Zone | Contains | Enter action |
|------|----------|--------------|
| `services` | Sort chip + My Services rows + All Services rows | Toggle, open sort, open more options |
| `sort` | Sort overlay options (Popularity, Alphabetical, Free) | Select sort |
| `moreOptions` | Channels/Plans tabs + option rows | Toggle channel/plan |
| `scrubber` | JumpBar letters | Scroll to letter section |

### Focus State
Focused rows use Chroma on-focus tokens: **white background, black text**. This applies to service rows, sort options, more options items, and jumpbar letters.

### Action Button (_ListActionButton)
[View in Figma](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=146-26164)

- Rendered as a **sibling** to the service row (not nested inside it)
- Only visible when the row is **focused AND has additional options** (channels/plans)
- Specs: `gap: 8px`, `border-radius: 12px`, `padding: 0 24px`
- Pressing Enter on it opens the More Options drawer

### Sort Chip (Button)
- Inline with the "My Services" header row (left: title + badge, right: sort chip)
- Default sort (Popularity): chip bg `rgba(255,255,255,0.1)`
- Active non-default sort: transparent bg, white text
- Focused: white bg, black text

### JumpBar
[View in Figma](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=284-38747)

**Visibility:** Only when alphabetical sort is active. Replaces the scrollbar.

**Position:** `right: 36px` from panel-card edge, top aligned with sort chip. Width: 56px. Uses `justify-content: space-between` to distribute letters vertically.

**Content:** `✓` (My Services section) at top, then A through Z.

**States:**

| State | Style | When |
|-------|-------|------|
| Default | 16px, `rgba(255,255,255,0.6)` | Letter has services |
| Disabled | 16px, `rgba(255,255,255,0.2)` | No services for that letter. Not selectable, skipped during navigation |
| Active | 20px, 40px circle with 1px border | Reflects current section in view based on focused service (always shows) |
| Focused | 20px, 40px circle, solid white bg, black text | User is navigating the jumpbar |

Active and focused can appear simultaneously on different letters.

**Spatial Navigation:**
- **Right from service row →** Action button (if has options) → JumpBar (closest letter by Y position)
- **Left from JumpBar →** Action button (if closest service has options) → Service row (closest by Y position)
- **Up/Down in JumpBar:** Skips disabled letters

**Content padding:** When JumpBar is visible, content area right padding increases from 64px to 128px.

### Nested Drawer (More Options)
Uses Sheet stacking pattern:
- Parent panel: `scale(0.96) translateX(-80px)`, `opacity: 0.5`
- Child drawer: slides from `translateX(110%)` to `translateX(0)`
- Transition: `0.35s cubic-bezier(0.32, 0.72, 0, 1)`

### Subtitles
On TV, the "X options" subtitle is **always visible** (not just on focus/hover).
- Selected service: white text
- Unselected service: `rgba(255,255,255,0.6)`

---

## Web Platform (1250x1080)

[View in Figma — Default](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=263-53564) · [View in Figma — Search](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=287-36793) · [View in Figma — Sort Menu](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=264-35942) · [View in Figma — More Options](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=287-39207)

### Modal (Panel)
- **560x720px**, centered on page with `16px` outer padding
- `border-radius: 16px`, `background: rgba(0,0,0,0.8)`, `backdrop-filter: blur(32px)`
- Header: "Manage Services" (21px, PlexCircular Bold) + close X button
- Content: 24px horizontal padding

### Search
- Expandable: search icon → full-width text input
- Clicking **outside** the search bar dismisses it (clicks on interactive elements within results do not dismiss)

### Custom Scrollbar
- Width: 6px, `right: 4px`
- Track: `rgba(0,0,0,0.3)`, Thumb: white
- `border-radius: 6px`

### More Options
Slides in as a nested Panel. Back button + "Select Plan & Add Ons" title. Same tab/channel/plan structure as TV.

---

## Mobile Platform (393x854)

[View in Figma — Default](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=131-19443) · [View in Figma — More Options](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=176-23130) · [View in Figma — Search Channels](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=209-29078)

### Layout
- Phone frame: 393x854px, `border-radius: 40px`
- Ultrablur background (4 corner radial gradients)
- Content padding: `0 16px`

### More Options
Bottom sheet slides up with drag handle. Same content structure as web/TV.

---

## Figma Frame Reference

### TV (1920x1080)
| Frame | Node ID | Link |
|-------|---------|------|
| My Services Selected | `146:22367` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=146-22367) |
| Alphabetical + JumpBar | `215:45840` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=215-45840) |
| Focus + Action Button | `146:26164` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=146-26164) |
| More Options - Channels | `146:30632` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=146-30632) |
| Sort by Menu | `215:47372` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=215-47372) |
| Blank State | `209:31838` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=209-31838) |

### Web (1250x1080)
| Frame | Node ID | Link |
|-------|---------|------|
| My Services Selected | `263:53564` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=263-53564) |
| My Services Blank | `263:52689` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=263-52689) |
| Sort By Menu | `264:35942` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=264-35942) |
| Sort By Applied | `263:54665` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=263-54665) |
| Search Results | `287:36793` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=287-36793) |
| More Options | `287:39207` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=287-39207) |

### Mobile (393x854)
| Frame | Node ID | Link |
|-------|---------|------|
| My Services Selected | `131:19443` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=131-19443) |
| My Services Blank | `194:33192` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=194-33192) |
| Sort By Menu | `209:30025` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=209-30025) |
| Search Results - Channels | `209:29078` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=209-29078) |
| More Options - Channels | `176:23130` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=176-23130) |
| More Options - Plans | `194:32412` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=194-32412) |
| Hide My Services | `215:51290` | [Open](https://www.figma.com/design/angRLfny8lSdlHLuev6l9u/DISCO-6759--Redesign-service-selection-and-w2w-modal?node-id=215-51290) |
