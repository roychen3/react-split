import { ReactNode } from 'react';
import { MousePosition, Direction, ItemSizes } from '../types';

export { MousePosition, Direction, ItemSizes };

export type SiblingInfo = {
  startRect: DOMRect | null;
};

type GutterHTMLProps = React.HTMLProps<HTMLDivElement>;
export interface GutterProps extends GutterHTMLProps {
  index: number;
  direction?: Direction;
  minItemSizes: ItemSizes;
  onGutterDown?: () => void;
  onGutterMove: (newSiblingSizes: number[]) => void;
  onGutterUp?: () => void;
}

type FixedSplitHTMLProps = Omit<React.HTMLProps<HTMLDivElement>, 'onChange'>;
export interface FixedSplitProps extends FixedSplitHTMLProps {
  children: ReactNode;
  direction?: Direction;
  minItemSizes?: ItemSizes;
  itemSizes?: ItemSizes;
  gutterSize?: number;
  gutterStyle?: React.CSSProperties;
  onChange?: (itemSizes: number[]) => void;
  onGutterDown?: (itemSizes: number[]) => void;
  onGutterMove?: (itemSizes: number[]) => void;
  onGutterUp?: (itemSizes: number[]) => void;
}
