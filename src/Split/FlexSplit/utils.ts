import { getStyleKey, getSiblingSizes, formatItemSizes } from '../utils';

export { getStyleKey, getSiblingSizes, formatItemSizes };

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
