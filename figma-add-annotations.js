// ============================================================
// Figma Dev Console Script — Add Spec Annotations to DISCO-6759
// ============================================================
//
// HOW TO USE:
// 1. Open the Figma file in the desktop app
// 2. Go to Plugins > Development > Open console (or Cmd+Option+I)
// 3. Paste this entire script and press Enter
// 4. Annotations will appear on the specified nodes in Dev Mode
//
// NOTE: Run this from the Figma Plugin console, NOT the browser console.
// You may need to wrap this in a plugin runner or use the Quick Actions
// console (Cmd+/ > "Run plugin script").
//
// If categories fail (requires certain plan), annotations will still
// be added without categories.
// ============================================================

(async () => {

  // --- Setup annotation categories ---
  let categories = {};
  try {
    // Try to create categories for organization
    const existing = await figma.annotations.getAnnotationCategoriesAsync();

    // Check if our categories exist
    const catNames = ['Interaction', 'Layout', 'Navigation', 'Animation', 'Component'];
    const catColors = ['RED', 'BLUE', 'GREEN', 'ORANGE', 'PURPLE'];

    for (let i = 0; i < catNames.length; i++) {
      let cat = existing.find(c => c.label === catNames[i]);
      if (!cat) {
        cat = await figma.annotations.createAnnotationCategoryAsync({
          label: catNames[i],
          color: catColors[i]
        });
      }
      categories[catNames[i]] = cat.id;
    }
    console.log('Categories created:', Object.keys(categories));
  } catch (e) {
    console.warn('Could not create categories (may require certain Figma plan). Adding annotations without categories.', e);
  }

  // --- Helper to add annotation to a node by ID ---
  function annotate(nodeId, markdown, category) {
    const node = figma.getNodeById(nodeId);
    if (!node) {
      console.warn(`Node ${nodeId} not found, skipping`);
      return;
    }
    const annotation = { labelMarkdown: markdown };
    if (category && categories[category]) {
      annotation.categoryId = categories[category];
    }
    // Append to existing annotations
    node.annotations = [...(node.annotations || []), annotation];
    console.log(`Annotated: ${node.name} (${nodeId})`);
  }

  // ============================================================
  // TV ANNOTATIONS
  // ============================================================

  // TV — My Services Selected (default view)
  annotate('146:22367',
`## TV — Manage Services (Default)
**Sheet**: 864px flush right, inner panel 32px margin
**Components**: Sheet, ListItem, Switch, Button (sort chip), Badge
**Input**: Arrow keys, Enter, B for back
**Focus zones**: services | sort | moreOptions | scrubber
**Sort chip**: Inline with My Services header row`,
    'Layout');

  // TV — Alphabetical + JumpBar
  annotate('215:45840',
`## TV — Alphabetical Sort + JumpBar
**When**: Alphabetical sort is active
**Content padding**: Right padding increases 64px → 128px
**JumpBar** (Chroma component): right:36px, 56px wide, top-aligned with sort chip
**Content**: ✓ (My Services) + A-Z
**Disabled letters**: rgba(255,255,255,0.2), skipped during nav
**Scrollbar**: Hidden when JumpBar visible`,
    'Navigation');

  // TV — JumpBar component itself
  annotate('284:38747',
`## JumpBar States
| State | Style |
|-------|-------|
| Default | 16px, rgba(255,255,255,0.6) |
| Disabled | 16px, rgba(255,255,255,0.2) — no services, not selectable |
| Active | 20px, 40px circle, 1px border — current section in view |
| Focused | 20px, 40px solid white bg, black text — user navigating jumpbar |

Active + focused can show simultaneously on different letters.

**Spatial nav**: Right from service → closest letter by Y pos (through action button if visible). Left from jumpbar → closest service row.`,
    'Navigation');

  // TV — Focus + Action Button
  annotate('146:26164',
`## TV — Focus State + Action Button
**Focus**: White background, black text (Chroma on-focus tokens)
**_ListActionButton**: Sibling element (not nested), only on focused rows WITH options
Specs: gap 8px, border-radius 12px, padding 0 24px
Enter on action button → opens More Options drawer`,
    'Interaction');

  // TV — More Options
  annotate('146:30632',
`## TV — More Options (Nested Drawer)
**Sheet stacking**: Parent scale(0.96) translateX(-80px) opacity 0.5
Child slides from translateX(110%) → translateX(0)
Transition: 0.35s cubic-bezier(0.32, 0.72, 0, 1)
**Components**: Sheet, ListItem, Checkbox, Button (tabs)
**Tabs**: Left/Right to switch, focus stays in items list
**B key**: Closes drawer, returns to services`,
    'Animation');

  // TV — Sort by Menu
  annotate('215:47372',
`## TV — Sort Overlay
Opens on Enter when sort chip focused
Options: Popularity, Alphabetical, Free
Up/Down to navigate, Enter to select, B to close
Selected option: accent color text`,
    'Interaction');

  // TV — Blank State
  annotate('209:31838',
`## TV — Blank State
Shows when My Services is empty
"It's a little empty here..." + description
Sort chip still visible in header`,
    'Layout');

  // ============================================================
  // WEB ANNOTATIONS
  // ============================================================

  // Web — My Services Selected
  annotate('263:53564',
`## Web — Manage Services (Default)
**Panel**: 560x720px centered modal, 16px outer padding
border-radius 16px, rgba(0,0,0,0.8) + backdrop-filter blur(32px)
**Components**: Panel, ListItem, Switch, Button, Badge
**Left-click row**: Toggles ON/OFF (no options) or opens More Options (has options)
**Deselect**: 1s fade → collapse. Re-clickable during fade to cancel.`,
    'Layout');

  // Web — Search Results
  annotate('287:36793',
`## Web — Search Results (Channels)
Sub-channel icons (48x48) right-align with parent icons (56x56)
Parent services: 70% opacity, disabled switch, no subtitle
Clicking outside search bar dismisses (not clicks on results)
**Components**: ListItem, Checkbox`,
    'Interaction');

  // Web — More Options
  annotate('287:39207',
`## Web — More Options
Nested Panel with back Button + close X
Service header: icon + name + Switch
Tabs: "Channels & Add Ons" / "Plans"
**Components**: Panel, Button, ListItem, Checkbox`,
    'Component');

  // Web — Sort Menu
  annotate('264:35942',
`## Web — Sort By Menu
Dropdown below sort chip (not fullscreen overlay)
Options: Popularity, Alphabetical, Free
Selected: checkmark + accent text
When active: chip shows sort name + X dismiss`,
    'Interaction');

  // ============================================================
  // MOBILE ANNOTATIONS
  // ============================================================

  // Mobile — My Services Selected
  annotate('131:19443',
`## Mobile — Manage Services (Default)
**Layout**: 393x854 phone frame, border-radius 40px
Ultrablur background (4 corner gradients)
Content padding: 0 16px
**Components**: ListItem, Switch, Button, Badge, Ultrablur
**Left-tap row**: Toggles ON/OFF or opens More Options
**Deselect**: Same 1s fade + re-select behavior as web`,
    'Layout');

  // Mobile — More Options
  annotate('176:23130',
`## Mobile — More Options (Bottom Sheet)
Bottom sheet slides up with drag handle
Same structure: service header + tabs + items
**Components**: Sheet, ListItem, Checkbox, Button`,
    'Component');

  // Mobile — Search Channels
  annotate('209:29078',
`## Mobile — Search (Channel Results)
Sub-channel icons (48x48) right-align with parent icons (56x56)
Sub-channel left padding: 8px (56 - 48 = 8)
Parent services at 70% opacity, disabled switches`,
    'Interaction');

  // Mobile — Blank State
  annotate('194:33192',
`## Mobile — Blank State
Scroll resets to top when My Services empties
"It's a little empty here..." message`,
    'Layout');

  // ============================================================

  console.log('✅ All annotations added! Switch to Dev Mode to see them.');
  figma.closePlugin();

})();
