const { Schema, Instance } = require("@hyperjump/json-schema-core");


const compile = async (schema, ast, parentSchema) => {
  const optional = await Schema.value(schema);
  const propertiesSchema = await Schema.step("properties", parentSchema);
  const propertyNames = Schema.typeOf(propertiesSchema, "object") ? Schema.keys(propertiesSchema) : [];

  const required = new Set(propertyNames);
  optional.forEach((propertyName) => propertyNames.remove(propertyName));
  return [...required];
};

const interpret = (required, instance) => {
  return !Instance.typeOf(instance, "object") || required.every((propertyName) => Instance.value(instance).hasOwnProperty(propertyName));
};

module.exports = { compile, interpret };
