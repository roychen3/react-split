import {
  isNumber,
  getStyleKey,
  getSiblingSizes,
  formatItemSizes,
} from '../utils';

export { isNumber, getStyleKey, getSiblingSizes, formatItemSizes };

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

export const fillItemSizes = (
  itemSizes: number[],
  length: number
): number[] => {
  const emptyArray: number[] = Array.from({ length });
  const result = emptyArray.map((empty, idx) => itemSizes[idx] ?? empty);
  return result;
};
