import { ReactNode } from 'react';

export type MousePosition = { x: number; y: number };

export type Direction = 'horizontal' | 'vertical';

export type ItemSizes = number | number[];

type GutterHTMLProps = Omit<
  React.HTMLProps<HTMLDivElement>,
  'ref' | 'className' | 'onMouseDown'
>;
export interface GutterProps extends GutterHTMLProps {
  index: number;
  direction?: Direction;
  minItemSizes: ItemSizes;
  itemSizes: number[];
  percentItemSizes: number[];
  onGutterDown?: (newItemSizes: number[], event: MouseEvent) => void;
  onGutterMove?: (newSiblingSizes: number[], event: MouseEvent) => void;
  onGutterUp?: (event: MouseEvent) => void;
}

type SplitHTMLProps = Omit<React.HTMLProps<HTMLDivElement>, 'onChange'>;
export interface FlexSplitProps extends SplitHTMLProps {
  children: ReactNode;
  direction?: Direction;
  minItemSizes?: ItemSizes;
  itemSizes?: ItemSizes;
  gutterSize?: number;
  gutterStyle?: React.CSSProperties;
  onChange?: (itemSizes: number[]) => void;
  onGutterDown?: (itemSizes: number[], event: MouseEvent) => void;
  onGutterMove?: (itemSizes: number[], event: MouseEvent) => void;
  onGutterUp?: (itemSizes: number[], event: MouseEvent) => void;
}
