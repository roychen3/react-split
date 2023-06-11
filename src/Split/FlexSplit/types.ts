import { ReactNode } from 'react';
import { MousePosition, Direction, ItemSizes } from '../types';

export { MousePosition, Direction, ItemSizes };

type GutterHTMLProps = React.HTMLProps<HTMLDivElement>;
export interface GutterProps extends GutterHTMLProps {
  index: number;
  direction?: Direction;
  minItemSizes: ItemSizes;
  itemSizes: number[];
  percentItemSizes: number[];
  getSplitItemsMap: () => Map<string, HTMLDivElement>;
  onGutterDown?: (newItemSizes: number[]) => void;
  onGutterMove?: (newSiblingSizes: number[]) => void;
  onGutterUp?: () => void;
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
  onGutterDown?: (itemSizes: number[]) => void;
  onGutterMove?: (itemSizes: number[]) => void;
  onGutterUp?: (itemSizes: number[]) => void;
}
