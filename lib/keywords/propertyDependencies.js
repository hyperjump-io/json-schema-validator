const { Core, Schema, Instance } = require("@hyperjump/json-schema-core");
const Pact = require("@hyperjump/pact");


const compile = async (schema, ast) => {
  return Pact.pipeline([
    Schema.entries,
    Pact.reduce(async (propertyDependencies, [propertyName, valueMappings]) => {
      propertyDependencies[propertyName] = await Pact.pipeline([
        Schema.entries,
        Pact.reduce(async (valueMappings, [propertyValue, conditionalSchema]) => {
          valueMappings[propertyValue] = await Core.compileSchema(conditionalSchema, ast);
          return valueMappings;
        }, {})
      ], valueMappings);
      return propertyDependencies;
    }, {})
  ], schema);
};

const interpret = (propertyDependencies, instance, ast, dynamicAnchors) => {
  return !Instance.typeOf(instance, "object") || Object.entries(propertyDependencies).every(([propertyName, valueMappings]) => {
    return !Instance.has(propertyName, instance) || Core.interpretSchema(valueMappings[Instance.value(instance)[propertyName]], instance, ast, dynamicAnchors);
  });
};

module.exports = { compile, interpret };
