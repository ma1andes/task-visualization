import { WidgetType } from "../types/widgets";
import type { Tag } from "../types";
import type {
  TagCustomization,
  WidgetParams,
} from "../types/customization";
import {
  parseCustomizationValue,
  isWidgetKey,
  normalizeWidgetName,
  mergeParams,
  validateParams,
  isSafeUrl,
} from "./customizationParser";

// =============================================
// Функции для работы с кастомизацией из API
// =============================================

/**
 * Получить виджет для тега из кастомизаций API
 * @param tagId - ID тега
 * @param customizations - массив кастомизаций из API
 * @returns тип виджета или null
 */
export const getWidgetForTagFromCustomization = (
  tagId: string,
  customizations: TagCustomization[]
): WidgetType | "image" | null => {
  // Ищем кастомизацию с ключом виджета
  const widgetCustomization = customizations.find(
    (c) => c.tag_id === tagId && isWidgetKey(c.key)
  );

  if (!widgetCustomization) {
    return null;
  }

  const parsed = parseCustomizationValue(widgetCustomization.value);

  // Если это картинка
  if (parsed.isImage) {
    return "image";
  }

  // Используем key как имя виджета
  // key может быть: "Widget", "Vertical bar", "chart", "half-circle"
  const widgetName = widgetCustomization.key.toLowerCase() === "widget"
    ? widgetCustomization.value // если key="Widget", то имя в value
    : widgetCustomization.key;   // иначе key - это имя виджета

  // Нормализуем имя виджета
  const normalizedName = normalizeWidgetName(widgetName);

  // Пробуем найти виджет по нормализованному имени
  const widgetType = Object.values(WidgetType).find(
    (type) => type === normalizedName
  );

  return widgetType || null;
};

/**
 * Получить параметры виджета из кастомизаций API
 * @param tagId - ID тега
 * @param customizations - массив кастомизаций из API
 * @param widgetKey - ключ виджета, для которого нужны параметры (опционально)
 * @returns объект с параметрами или null
 */
export const getWidgetParamsFromCustomization = (
  tagId: string,
  customizations: TagCustomization[],
  widgetKey?: string
): WidgetParams | null => {
  // Получаем все кастомизации для этого тега
  const tagCustomizations = customizations.filter((c) => c.tag_id === tagId);

  if (tagCustomizations.length === 0) {
    return null;
  }

  const allParams: WidgetParams[] = [];

  for (const customization of tagCustomizations) {
    // Если указан ключ виджета, берём параметры только из этой кастомизации
    if (widgetKey && customization.key !== widgetKey) {
      // Но всегда учитываем общие настройки (color, color_text)
      if (customization.key.toLowerCase() === "color_text") {
        allParams.push({ color_text: customization.value });
        continue;
      }
      if (customization.key.toLowerCase() === "color") {
        allParams.push({ color: customization.value });
        continue;
      }
      continue;
    }

    const parsed = parseCustomizationValue(customization.value);

    // Если это параметры виджета
    if (parsed.params) {
      allParams.push(parsed.params);
    }

    // Специальная обработка для некоторых ключей
    if (customization.key.toLowerCase() === "color_text" && !parsed.params) {
      allParams.push({ color_text: customization.value });
    }

    if (customization.key.toLowerCase() === "color" && !parsed.params) {
      allParams.push({ color: customization.value });
    }
  }

  // Объединяем все параметры
  if (allParams.length === 0) {
    return null;
  }

  const merged = mergeParams(...allParams);
  
  // Валидируем параметры (проверяем min < max и т.д.)
  return validateParams(merged);
};

/**
 * Получить полную информацию о виджете для тега с учётом кастомизации
 * @param tag - тег
 * @param customizations - массив кастомизаций из API (опционально)
 * @returns информация о виджете или null
 */
export const getTagWidgetInfoWithCustomization = (
  tag: Tag,
  customizations?: TagCustomization[]
) => {
  let widgetType: WidgetType | "image" | null = null;
  let params: WidgetParams | null = null;
  let widgetKey: string | null = null;

  // Получаем из кастомизаций API
  if (customizations && customizations.length > 0) {
    // Сначала находим кастомизацию виджета
    const widgetCustomization = customizations.find(
      (c) => c.tag_id === tag.id && isWidgetKey(c.key)
    );

    if (widgetCustomization) {
      widgetKey = widgetCustomization.key;
      widgetType = getWidgetForTagFromCustomization(tag.id, customizations);
      // Передаём ключ виджета, чтобы получить только его параметры
      params = getWidgetParamsFromCustomization(tag.id, customizations, widgetKey);
    }
  }

  // Если виджет не найден в кастомизациях - возвращаем null
  if (!widgetType) {
    return null;
  }

  // Если это картинка
  if (widgetType === "image") {
    return {
      widgetType: "image" as const,
      tag,
      params,
      isImage: true,
    };
  }

  return {
    widgetType,
    tag,
    params,
    isImage: false,
  };
};

/**
 * Получить URL картинки из кастомизаций
 * @param tagId - ID тега
 * @param customizations - массив кастомизаций из API
 * @returns URL картинки или null
 */
export const getImageUrlFromCustomization = (
  tagId: string,
  customizations: TagCustomization[]
): string | null => {
  const widgetCustomization = customizations.find(
    (c) => c.tag_id === tagId && isWidgetKey(c.key)
  );

  if (!widgetCustomization) {
    return null;
  }

  const parsed = parseCustomizationValue(widgetCustomization.value);

  if (parsed.imageUrl) {
    // Проверяем безопасность URL перед возвратом
    if (isSafeUrl(parsed.imageUrl)) {
      return parsed.imageUrl;
    }
    // Если URL небезопасен - возвращаем null
    return null;
  }

  return null;
};


/**
 * Проверить, является ли виджет тега картинкой
 * @param tagId - ID тега
 * @param customizations - массив кастомизаций из API
 * @returns true если это картинка
 */
export const isImageWidget = (
  tagId: string,
  customizations: TagCustomization[]
): boolean => {
  const widgetType = getWidgetForTagFromCustomization(tagId, customizations);
  return widgetType === "image";
};

/**
 * Проверить, есть ли кастомизация для тега
 * @param tagId - ID тега
 * @param customizations - массив кастомизаций из API
 * @returns true если есть кастомизация с ключом виджета
 */
export const hasCustomization = (
  tagId: string,
  customizations: TagCustomization[]
): boolean => {
  return customizations.some(
    (c) => c.tag_id === tagId && isWidgetKey(c.key)
  );
};

/**
 * Получить все виджеты для тега (если их несколько в БД)
 * @param tagId - ID тега
 * @param customizations - массив кастомизаций из API
 * @returns массив ключей виджетов
 */
export const getAllWidgetKeysForTag = (
  tagId: string,
  customizations: TagCustomization[]
): string[] => {
  return customizations
    .filter((c) => c.tag_id === tagId && isWidgetKey(c.key))
    .map((c) => c.key);
};

/**
 * Получить информацию о конкретном виджете по ключу
 * @param tag - тег
 * @param widgetKey - ключ виджета из БД
 * @param customizations - массив кастомизаций из API
 * @returns информация о виджете или null
 */
export const getTagWidgetInfoByKey = (
  tag: Tag,
  widgetKey: string,
  customizations: TagCustomization[]
) => {
  // Находим кастомизацию для этого ключа
  const widgetCustomization = customizations.find(
    (c) => c.tag_id === tag.id && c.key === widgetKey
  );

  if (!widgetCustomization) {
    return null;
  }

  const parsed = parseCustomizationValue(widgetCustomization.value);

  // Если это картинка
  if (parsed.isImage) {
    const imageUrl = parsed.imageUrl || null;
    const params = getWidgetParamsFromCustomization(tag.id, customizations, widgetKey);
    return {
      widgetType: "image" as const,
      tag,
      params,
      isImage: true,
      imageUrl,
    };
  }

  // Определяем имя виджета
  const widgetName = widgetKey.toLowerCase() === "widget"
    ? widgetCustomization.value
    : widgetKey;

  // Нормализуем имя виджета
  const normalizedName = normalizeWidgetName(widgetName);

  // Пробуем найти тип виджета
  const widgetType = Object.values(WidgetType).find(
    (type) => type === normalizedName
  );

  if (!widgetType) {
    return null;
  }

  // Получаем параметры для этого конкретного виджета
  const params = getWidgetParamsFromCustomization(tag.id, customizations, widgetKey);

  return {
    widgetType,
    tag,
    params,
    isImage: false,
  };
};
