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
}

export interface SplitProps {
  children: ReactNode;
  direction?: Direction;
  flexContainer?: boolean;
}
