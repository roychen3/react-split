import { Direction } from './types'

export const getStyleKey = (direction: Direction): 'width' | 'height' => {
  switch (direction) {
    case 'horizontal':
      return 'width';

    case 'vertical':
      return 'height';
  }
};

export const getSiblingSize = (sizes: number | number[], idx?: number): number[] | null[] => {
  const numberSizes = typeof sizes === 'number'
  if (numberSizes) {
    return [sizes, sizes]
  }

  const arraySizes = sizes instanceof Array
  const numberIdx = typeof idx === 'number'
  if (arraySizes && numberIdx) {
    const previousSize = sizes[idx] ?? null
    const nextSize = sizes[idx + 1] ?? null

    return [previousSize, nextSize];
  }

  return [null, null]
}

export const formatSize = (minSize: number | null, size: number | null): number | null => {
  const isMinSizeNumber = typeof minSize === 'number'
  const isSizeNumber = typeof size === 'number'
  if (isMinSizeNumber && !isSizeNumber) {
    return null
  }
  if (!isMinSizeNumber && isSizeNumber) {
    return size
  }
  if (isMinSizeNumber && isSizeNumber) {
    return Math.max(minSize, size)
  }
  return null
}