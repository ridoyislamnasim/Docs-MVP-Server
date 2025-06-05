function isField(field, fieldName) {
  return field && { [`${fieldName}`]: field };
}

export default isField;
