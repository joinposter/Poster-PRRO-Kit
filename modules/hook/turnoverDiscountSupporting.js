export const V2 = 2;

export const addVersionInArray = (version, list) => {
  if (!Array.isArray(list)) return list;
  return list.map((item) => ({ ...item, version }));
};

export const addVersionInObject = (version, obj) => {
  if (typeof obj !== "object" || obj === null) return obj;
  return { ...obj, version };
};

export const getVersion2SpecificFields = (version, fields) =>
  version === V2 ? fields : {};
