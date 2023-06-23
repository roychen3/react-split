import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import FlexSplit from '../index';

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};
const defaultRect: Rect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};
const setRect = (element: HTMLElement, rect: Rect = defaultRect) => {
  Object.defineProperty(element, 'getBoundingClientRect', {
    value: jest.fn(() => rect),
    writable: true,
  });
};

describe('Component: Split', () => {
  test('only one item', async () => {
    render(
      <FlexSplit>
        <div>item</div>
      </FlexSplit>
    );
    expect(() => screen.getAllByTestId('split__gutter')).toThrow();
  });

  test('horizontal: adjust size', async () => {
    const gutter = 10;
    const splitItem = 100;
    const onChange = jest.fn();
    const onGutterDown = jest.fn();
    const onGutterMove = jest.fn();
    const onGutterUp = jest.fn();
    render(
      <FlexSplit
        onChange={onChange}
        onGutterDown={onGutterDown}
        onGutterMove={onGutterMove}
        onGutterUp={onGutterUp}
      >
        {Array.from(Array(4).keys()).map((key) => (
          <div key={key}>{key}</div>
        ))}
      </FlexSplit>
    );

    const itemElements = screen.getAllByTestId('split__item');
    expect(itemElements).toHaveLength(4);
    itemElements.forEach((item, itemIdx) => {
      setRect(item, {
        ...defaultRect,
        width: splitItem,
        left: itemIdx * splitItem + itemIdx * gutter,
        right: (itemIdx + 1) * splitItem + itemIdx * gutter,
      });
    });
    const gutterElements = screen.getAllByTestId('split__gutter');
    expect(gutterElements).toHaveLength(3);
    gutterElements.forEach((item, itemIdx) => {
      setRect(item, {
        ...defaultRect,
        width: gutter,
        left: (itemIdx + 1) * splitItem + itemIdx * gutter,
        right: (itemIdx + 1) * splitItem + (itemIdx + 1) * gutter,
      });
    });

    // move gutter1 position form 100 to 150
    {
      const gutterElement = gutterElements[0];
      const startPosition = {
        clientX: 105,
        clientY: 0,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[0][0]).toEqual([100, 100, 100, 100]);
      expect(onChange.mock.calls[0][0]).toEqual([100, 100, 100, 100]);

      const endPosition = {
        clientX: 155,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [150, 50, 100, 100];
      expect(onGutterMove.mock.calls[0][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[1][0]).toEqual(expectMovedSizes);
      const newARect = {
        width: 150,
        left: 0,
        right: 150,
      };
      const newBRect = {
        width: 50,
        left: newARect.right + gutter,
        right: newARect.right + gutter + 50,
      };
      setRect(itemElements[0], {
        ...defaultRect,
        ...newARect,
      });
      setRect(itemElements[1], {
        ...defaultRect,
        ...newBRect,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[0][0]).toEqual(expectMovedSizes);
    }

    // move gutter2 position form 215 to 265
    {
      const gutterElement = gutterElements[1];
      const startPosition = {
        clientX: 215,
        clientY: 0,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[1][0]).toEqual([150, 50, 100, 100]);

      const endPosition = {
        clientX: 265,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [150, 100, 50, 100];
      expect(onGutterMove.mock.calls[1][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[2][0]).toEqual(expectMovedSizes);
      const newARect = {
        width: 100,
        left: 150 + gutter,
        right: 150 + gutter + 100,
      };
      const newBRect = {
        width: 50,
        left: newARect.right + gutter,
        right: newARect.right + gutter + 50,
      };
      setRect(itemElements[1], {
        ...defaultRect,
        ...newARect,
      });
      setRect(itemElements[2], {
        ...defaultRect,
        ...newBRect,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[1][0]).toEqual(expectMovedSizes);
    }

    // move gutter2 position form 265 to 0
    {
      const gutterElement = gutterElements[1];
      const startPosition = {
        clientX: 265,
        clientY: 0,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[2][0]).toEqual([150, 100, 50, 100]);

      const endPosition = {
        clientX: 0,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [150, 0, 150, 100];
      expect(onGutterMove.mock.calls[2][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[3][0]).toEqual(expectMovedSizes);
      const newARect = {
        width: 0,
        left: 150 + gutter,
        right: 150 + gutter + 0,
      };
      const newBRect = {
        width: 150,
        left: newARect.right + gutter,
        right: newARect.right + gutter + 150,
      };
      setRect(itemElements[1], {
        ...defaultRect,
        ...newARect,
      });
      setRect(itemElements[2], {
        ...defaultRect,
        ...newBRect,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[2][0]).toEqual(expectMovedSizes);
    }
  });

  test('vertical: adjust size', async () => {
    const gutter = 10;
    const splitItem = 100;
    const onChange = jest.fn();
    const onGutterDown = jest.fn();
    const onGutterMove = jest.fn();
    const onGutterUp = jest.fn();
    render(
      <FlexSplit
        direction="vertical"
        onChange={onChange}
        onGutterDown={onGutterDown}
        onGutterMove={onGutterMove}
        onGutterUp={onGutterUp}
      >
        {Array.from(Array(4).keys()).map((key) => (
          <div key={key}>{key}</div>
        ))}
      </FlexSplit>
    );

    const itemElements = screen.getAllByTestId('split__item');
    expect(itemElements).toHaveLength(4);
    itemElements.forEach((item, itemIdx) => {
      setRect(item, {
        ...defaultRect,
        height: splitItem,
        top: itemIdx * splitItem + itemIdx * gutter,
        bottom: (itemIdx + 1) * splitItem + itemIdx * gutter,
      });
    });
    const gutterElements = screen.getAllByTestId('split__gutter');
    expect(gutterElements).toHaveLength(3);
    gutterElements.forEach((item, itemIdx) => {
      setRect(item, {
        ...defaultRect,
        height: gutter,
        top: (itemIdx + 1) * splitItem + itemIdx * gutter,
        bottom: (itemIdx + 1) * splitItem + (itemIdx + 1) * gutter,
      });
    });

    // move gutter1 position form 100 to 150
    {
      const gutterElement = gutterElements[0];
      const startPosition = {
        clientX: 0,
        clientY: 105,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[0][0]).toEqual([100, 100, 100, 100]);
      expect(onChange.mock.calls[0][0]).toEqual([100, 100, 100, 100]);

      const endPosition = {
        clientX: 0,
        clientY: 155,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [150, 50, 100, 100];
      expect(onGutterMove.mock.calls[0][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[1][0]).toEqual(expectMovedSizes);
      const newARect = {
        height: 150,
        top: 0,
        bottom: 150,
      };
      const newBRect = {
        height: 50,
        top: newARect.bottom + gutter,
        bottom: newARect.bottom + gutter + 50,
      };
      setRect(itemElements[0], {
        ...defaultRect,
        ...newARect,
      });
      setRect(itemElements[1], {
        ...defaultRect,
        ...newBRect,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[0][0]).toEqual(expectMovedSizes);
    }

    // move gutter2 position form 215 to 265
    {
      const gutterElement = gutterElements[1];
      const startPosition = {
        clientX: 0,
        clientY: 215,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[1][0]).toEqual([150, 50, 100, 100]);

      const endPosition = {
        clientX: 0,
        clientY: 265,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [150, 100, 50, 100];
      expect(onGutterMove.mock.calls[1][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[2][0]).toEqual(expectMovedSizes);
      const newARect = {
        height: 100,
        top: 150 + gutter,
        bottom: 150 + gutter + 100,
      };
      const newBRect = {
        height: 50,
        top: newARect.bottom + gutter,
        bottom: newARect.bottom + gutter + 50,
      };
      setRect(itemElements[1], {
        ...defaultRect,
        ...newARect,
      });
      setRect(itemElements[2], {
        ...defaultRect,
        ...newBRect,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[1][0]).toEqual(expectMovedSizes);
    }

    // move gutter2 position form 265 to 0
    {
      const gutterElement = gutterElements[1];
      const startPosition = {
        clientX: 0,
        clientY: 265,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[2][0]).toEqual([150, 100, 50, 100]);

      const endPosition = {
        clientX: 0,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [150, 0, 150, 100];
      expect(onGutterMove.mock.calls[2][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[3][0]).toEqual(expectMovedSizes);
      const newARect = {
        height: 0,
        top: 150 + gutter,
        bottom: 150 + gutter + 0,
      };
      const newBRect = {
        height: 150,
        top: newARect.bottom + gutter,
        bottom: newARect.bottom + gutter + 150,
      };
      setRect(itemElements[1], {
        ...defaultRect,
        ...newARect,
      });
      setRect(itemElements[2], {
        ...defaultRect,
        ...newBRect,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[2][0]).toEqual(expectMovedSizes);
    }
  });

  test('mini item size', async () => {
    const gutter = 10;
    const splitItem = 100;
    const onChange = jest.fn();
    const onGutterDown = jest.fn();
    const onGutterMove = jest.fn();
    const onGutterUp = jest.fn();
    render(
      <FlexSplit
        minItemSizes={20}
        onChange={onChange}
        onGutterDown={onGutterDown}
        onGutterMove={onGutterMove}
        onGutterUp={onGutterUp}
      >
        {Array.from(Array(4).keys()).map((key) => (
          <div key={key}>{key}</div>
        ))}
      </FlexSplit>
    );

    const itemElements = screen.getAllByTestId('split__item');
    expect(itemElements).toHaveLength(4);
    itemElements.forEach((item, itemIdx) => {
      setRect(item, {
        ...defaultRect,
        width: splitItem,
        left: itemIdx * splitItem + itemIdx * gutter,
        right: (itemIdx + 1) * splitItem + itemIdx * gutter,
      });
    });
    const gutterElements = screen.getAllByTestId('split__gutter');
    expect(gutterElements).toHaveLength(3);
    gutterElements.forEach((item, itemIdx) => {
      setRect(item, {
        ...defaultRect,
        width: gutter,
        left: (itemIdx + 1) * splitItem + itemIdx * gutter,
        right: (itemIdx + 1) * splitItem + (itemIdx + 1) * gutter,
      });
    });

    // move gutter1 position form 100 to 0
    {
      const gutterElement = gutterElements[0];
      const startPosition = {
        clientX: 105,
        clientY: 0,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[0][0]).toEqual([100, 100, 100, 100]);
      expect(onChange.mock.calls[0][0]).toEqual([100, 100, 100, 100]);

      const endPosition = {
        clientX: 0,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [20, 180, 100, 100];
      expect(onGutterMove.mock.calls[0][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[1][0]).toEqual(expectMovedSizes);
      const newARect = {
        width: 20,
        left: 0,
        right: 20,
      };
      const newBRect = {
        width: 180,
        left: newARect.right + gutter,
        right: newARect.right + gutter + 180,
      };
      setRect(itemElements[0], {
        ...defaultRect,
        ...newARect,
      });
      setRect(itemElements[1], {
        ...defaultRect,
        ...newBRect,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[0][0]).toEqual(expectMovedSizes);
    }

    // move gutter2 position form 215 to 0
    {
      const gutterElement = gutterElements[1];
      const startPosition = {
        clientX: 215,
        clientY: 0,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[1][0]).toEqual([20, 180, 100, 100]);

      const endPosition = {
        clientX: 0,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [20, 20, 260, 100];
      expect(onGutterMove.mock.calls[1][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[2][0]).toEqual(expectMovedSizes);
      const newARect = {
        width: 20,
        left: 20 + gutter,
        right: 20 + gutter + 20,
      };
      const newBRect = {
        width: 260,
        left: newARect.right + gutter,
        right: newARect.right + gutter + 260,
      };
      setRect(itemElements[1], {
        ...defaultRect,
        ...newARect,
      });
      setRect(itemElements[2], {
        ...defaultRect,
        ...newBRect,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[1][0]).toEqual(expectMovedSizes);
    }

    // move gutter3 position form 325 to 9999
    {
      const gutterElement = gutterElements[2];
      const startPosition = {
        clientX: 325,
        clientY: 0,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[2][0]).toEqual([20, 20, 260, 100]);

      const endPosition = {
        clientX: 9999,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [20, 20, 340, 20];
      expect(onGutterMove.mock.calls[2][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[3][0]).toEqual(expectMovedSizes);
      const newARect = {
        width: 340,
        left: 40 + gutter,
        right: 40 + gutter + 340,
      };
      const newBRect = {
        width: 20,
        left: newARect.right + gutter,
        right: newARect.right + gutter + 20,
      };
      setRect(itemElements[2], {
        ...defaultRect,
        ...newARect,
      });
      setRect(itemElements[3], {
        ...defaultRect,
        ...newBRect,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[2][0]).toEqual(expectMovedSizes);
    }
  });
});
