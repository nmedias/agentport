// use_figma — create the canonical DS Section wrapper (Section + Headline, NO inner frame).
// AUTHORITATIVE VALUES LIVE IN ../config.json. Every {{placeholder}} below maps to a config value
// or an input. The calling skill reads config.json and substitutes ALL placeholders before executing.
//
// A Figma SECTION has no padding / no auto-layout / no cornerRadius. The headline is a direct child
// at (inset, inset). The caller appends its build as further section children, below the headline,
// and resizes the section to fit.
//
// Input placeholders:   {{pageId}} {{name}} {{headline}} {{besideNodeId}}
//                        ({{besideNodeId}} = '' when no placement.besideNodeId input → auto placement)
// Config placeholders:   {{fill_r}} {{fill_g}} {{fill_b}} {{cornerRadius}}
//                        {{offsetRight}} {{originY}} {{besideGap}}
//                        {{font_family}} {{font_style}} {{font_size}} {{line_height_pct}} {{inset}}
//                        {{hl_r}} {{hl_g}} {{hl_b}}
// Returns: { sectionId, headlineId }

const page = await figma.getNodeByIdAsync('{{pageId}}')
if (!page || page.type !== 'PAGE') throw new Error('Target page not found or not a PAGE: {{pageId}}')
await figma.setCurrentPageAsync(page)

// Placement: besideNode mode (top-aligned, besideGap px right of a reference node) or auto.
// Computed from EXISTING children BEFORE creating the section — createSection() appends to the
// page immediately, so scanning page.children afterwards would include (and offset from) itself.
let x, y
const refId = '{{besideNodeId}}'
if (refId) {
  const ref = await figma.getNodeByIdAsync(refId)
  if (!ref) throw new Error('placement.besideNodeId not found: ' + refId)
  const b = ref.absoluteBoundingBox
  if (!b) throw new Error('placement reference node has no bounding box: ' + refId)
  x = b.x + b.width + {{besideGap}}
  y = b.y
} else {
  x = page.children.length > 0
    ? Math.max(...page.children.map(c => c.x + (c.width || 0))) + {{offsetRight}}
    : 0
  y = {{originY}}
}

// Section: fill + name (no radius/padding — sections do not support them).
const sec = figma.createSection()
sec.name = '{{name}}'
sec.fills = [{ type: 'SOLID', color: { r: {{fill_r}}, g: {{fill_g}}, b: {{fill_b}} }, opacity: 1 }]
sec.cornerRadius = {{cornerRadius}}
sec.x = x
sec.y = y

// Headline: direct child of the section, inset px from its top-left. Caller appends its build below.
await figma.loadFontAsync({ family: '{{font_family}}', style: '{{font_style}}' })
const h = figma.createText()
h.fontName = { family: '{{font_family}}', style: '{{font_style}}' }
h.characters = '{{headline}}'
h.fontSize = {{font_size}}
h.lineHeight = { unit: 'PERCENT', value: {{line_height_pct}} }
h.fills = [{ type: 'SOLID', color: { r: {{hl_r}}, g: {{hl_g}}, b: {{hl_b}} }, opacity: 1 }]
sec.appendChild(h)
h.x = {{inset}}
h.y = {{inset}}

// Initial size: hug the headline with inset padding on all sides. Caller resizes when it adds content.
sec.resizeWithoutConstraints(h.width + {{inset}} * 2, h.height + {{inset}} * 2)

return { sectionId: sec.id, headlineId: h.id }
