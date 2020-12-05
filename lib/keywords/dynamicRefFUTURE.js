const { Core, Schema } = require("@hyperjump/json-schema-core");
const { safeResolveUrl, splitUrl } = require("@hyperjump/json-schema-core/lib/common");


const compile = (dynamicRef) => splitUrl(Schema.value(dynamicRef));

const interpret = ([id, fragment], instance, ast, dynamicAnchors) => {
  if (!(fragment in dynamicAnchors)) {
    throw Error(`No dynamic anchor found for "${fragment}"`);
  }
  const schemaId = safeResolveUrl(dynamicAnchors[fragment], id);
  const pointer = Schema.getAnchorPointer(ast.metaData[schemaId], fragment);
  return Core.interpretSchema(`${schemaId}#${pointer}`, instance, ast, dynamicAnchors);
};

const collectEvaluatedProperties = Core.collectEvaluatedProperties;
const collectEvaluatedItems = Core.collectEvaluatedItems;

module.exports = { compile, interpret, collectEvaluatedProperties, collectEvaluatedItems };
