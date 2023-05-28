import { ReactNode } from 'react';

export type SiblingInfo = {
  startRect: DOMRect | null;
  element: HTMLElement | null;
};

export type MousePosition = { x: number; y: number };

export type Direction = 'horizontal' | 'vertical';

export interface GutterProps {
  direction?: Direction;
  flexContainer?: boolean;
  onGutterDown?: (event: MouseEvent) => void;
  onGutterMove?: (event: MouseEvent) => void;
  onGutterUp?: (event: MouseEvent) => void;
}

export interface SplitProps {
  children: ReactNode;
  direction?: Direction;
  flexContainer?: boolean;
  onGutterDown?: (event: MouseEvent) => void;
  onGutterMove?: (event: MouseEvent) => void;
  onGutterUp?: (event: MouseEvent) => void;
}
