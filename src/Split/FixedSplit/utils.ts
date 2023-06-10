import { Direction, ItemSizes } from './types';

export const isNumber = (value: any): value is number =>
  typeof value === 'number';

export const getStyleKey = (direction: Direction): 'width' | 'height' => {
  switch (direction) {
    case 'horizontal':
      return 'width';

    case 'vertical':
      return 'height';
  }
};

export const getSiblingSizes = (
  sizes: number | number[],
  idx?: number
): [null | number, null | number] => {
  if (isNumber(sizes)) {
    return [sizes, sizes];
  }

  const arraySizes = sizes instanceof Array;
  if (arraySizes && isNumber(idx)) {
    const previousSize = sizes[idx] ?? null;
    const nextSize = sizes[idx + 1] ?? null;

    return [previousSize, nextSize];
  }

  return [null, null];
};

export const checkSizeRange = (
  minSize: number | null,
  size: number | null
): number | null => {
  if (isNumber(minSize) && isNumber(size)) {
    return Math.max(minSize, size);
  }
  if (!isNumber(minSize) && isNumber(size)) {
    return size;
  }
  return null;
};

export const formatItemSizes = (
  itemSizes: ItemSizes,
  length: number
): number[] => {
  if (isNumber(itemSizes)) {
    return Array.from({ length }, () => itemSizes);
  }
  if (itemSizes instanceof Array) {
    if (itemSizes.length === 0) {
      return Array.from({ length }, () => 0);
    }
    if (itemSizes.length < length) {
      return Array.from({ length }, () => 0).map((_, idx) => {
        return itemSizes[idx] ?? 0;
      });
    }
    return itemSizes;
  }
  return [];
};

export const fillItemSizes = (
  itemSizes: number[],
  length: number
): number[] => {
  const emptyArray: number[] = Array.from({ length });
  const result = emptyArray.map((empty, idx) => itemSizes[idx] ?? empty);
  return result;
};
