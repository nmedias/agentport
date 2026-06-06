// use_figma — read-only discovery before a Figma build. Returns the maps you bind against.
// Resolve variables/styles by ID (names carry group paths). Run once, keep the result.
// Returns: { collections, variablesByCollection, textStyles, effectStyles, pages }

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const want = ['semantic', 'semantic-dimension']; // color + radius/spacing (see config.json)

const vars = await figma.variables.getLocalVariablesAsync();
const variablesByCollection = {};
for (const v of vars) {
  const col = collections.find((c) => c.id === v.variableCollectionId);
  if (!col || !want.includes(col.name)) continue;
  (variablesByCollection[col.name] ||= []).push({ id: v.id, name: v.name, type: v.resolvedType });
}

const textStyles = (await figma.getLocalTextStylesAsync()).map((s) => ({ id: s.id, name: s.name }));
const effectStyles = (await figma.getLocalEffectStylesAsync()).map((s) => ({ id: s.id, name: s.name }));
const pages = figma.root.children.map((p) => ({ id: p.id, name: p.name }));

return {
  collections: collections.map((c) => ({ name: c.name, id: c.id, modes: c.modes.map((m) => m.name), count: c.variableIds.length })),
  variablesByCollection,
  textStyles,
  effectStyles,
  pages,
};
