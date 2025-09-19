export type TagDataType = "boolean" | "number" | "string";

const BOOLEAN_PATTERNS = [
  /^pump\d+_bits/i,
  /^PC_IO_/i,
  /^DC_out_100ms\[\d+\]$/i,
  /^DC_in_100ms\[\d+\]\.2[4-6]$/i,
  /^DC_out_100ms\[\d+\]\.\d+$/i,
  /^DC_in_100ms\[\d+\]\.1[5-8]$/i,
  /^DC_in_100ms\[\d+\]\.2[1-6]$/i,
  /^DC_in_100ms\[\d+\]\.(4|5)$/i,
];

const NUMBER_PATTERNS = [
  /_spm$/i,
  /_feed$/i,
  /^DC_out_100ms\[\d+\]$/i,
  /^DC_in_100ms\[8[4-8]\]$/i,
];

export const determineTagType = (tagName: string): TagDataType => {
  for (const pattern of BOOLEAN_PATTERNS) {
    if (pattern.test(tagName)) {
      return "boolean";
    }
  }

  for (const pattern of NUMBER_PATTERNS) {
    if (pattern.test(tagName)) {
      return "number";
    }
  }

  return "string";
};

export const convertTagValue = (
  value: any,
  tagName: string
): boolean | number | string => {
  const tagType = determineTagType(tagName);

  switch (tagType) {
    case "boolean":
      if (typeof value === "number") {
        return value === 1;
      }
      if (typeof value === "string") {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          return num === 1;
        }
        return value.toLowerCase() === "true";
      }
      return Boolean(value);

    case "number":
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "string") {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
      }
      return Number(value) || 0;

    case "string":
    default:
      return String(value);
  }
};

export const getTagTypeInfo = (tagName: string) => {
  const type = determineTagType(tagName);

  return {
    type,
    isBooleanTag: type === "boolean",
    isNumberTag: type === "number",
    isStringTag: type === "string",
    description: getTagDescription(tagName, type),
  };
};

const getTagDescription = (tagName: string, type: TagDataType): string => {
  if (tagName.includes("pump") && tagName.includes("bits")) {
    return "Состояние бита насоса";
  }
  if (tagName.startsWith("PC_IO_")) {
    return "Состояние цифрового входа/выхода";
  }
  if (tagName.includes("_spm")) {
    return "Скорость в оборотах в минуту";
  }
  if (tagName.includes("_feed")) {
    return "Значение подачи";
  }
  if (tagName.includes("DC_out_100ms")) {
    return type === "boolean"
      ? "Состояние цифрового выхода"
      : "Значение цифрового выхода";
  }
  if (tagName.includes("DC_in_100ms")) {
    return type === "boolean"
      ? "Состояние цифрового входа"
      : "Значение цифрового входа";
  }

  return `Параметр ${tagName}`;
};

export const isBooleanTagValue = (value: any): boolean => {
  return (
    value === 0 ||
    value === 1 ||
    value === "0" ||
    value === "1" ||
    typeof value === "boolean"
  );
};

export const getKnownTagPatterns = () => {
  return {
    boolean: BOOLEAN_PATTERNS.map((p) => p.source),
    number: NUMBER_PATTERNS.map((p) => p.source),
  };
};
