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

export const toPercent = (pixel: number, denominator: number): number => {
  if (pixel === 0) return 0;
  if (denominator === 0) throw Error('denominator not to be "0"');
  return (pixel / denominator) * 100;
};

export const calculatePercentItemSizes = (
  pixelItemSizes: number[]
): number[] => {
  const totalPixelItemSize = pixelItemSizes.reduce(
    (accumulator, size) => accumulator + size,
    0
  );
  const result = pixelItemSizes.map((pixelSize) =>
    toPercent(pixelSize, totalPixelItemSize)
  );
  return result;
};

export const formatRenderItemSizes = (
  percentItemSizes: number[],
  gutterSize: number
): string[] => {
  const result = percentItemSizes.map((percentSize, percentSizeIdx) => {
    if (
      percentSizeIdx === 0 ||
      percentSizeIdx + 1 === percentItemSizes.length
    ) {
      return `calc(${percentSize}% - ${gutterSize / 2}px`;
    }

    return `calc(${percentSize}% - ${gutterSize}px`;
  });
  return result;
};
