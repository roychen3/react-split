import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import FixedSplit from '../index';

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

describe('Component: FixedSplit', () => {
  test('only one item', async () => {
    render(
      <FixedSplit>
        <div>item</div>
      </FixedSplit>
    );
    expect(() => screen.getAllByTestId('split__gutter')).toThrow();
  });

  test('horizontal: adjust size', async () => {
    const onChange = jest.fn();
    const onGutterDown = jest.fn();
    const onGutterMove = jest.fn();
    const onGutterUp = jest.fn();
    render(
      <FixedSplit
        onChange={onChange}
        onGutterDown={onGutterDown}
        onGutterMove={onGutterMove}
        onGutterUp={onGutterUp}
      >
        {Array.from(Array(4).keys()).map((key) => (
          <div key={key}>{key}</div>
        ))}
      </FixedSplit>
    );

    const itemElements = screen.getAllByTestId('split__item');
    expect(itemElements).toHaveLength(4);
    itemElements.forEach((item) => {
      setRect(item, {
        ...defaultRect,
        width: 100,
      });
    });
    const gutterElements = screen.getAllByTestId('split__gutter');
    expect(gutterElements).toHaveLength(4);

    // move gutter1 position form 100 to 200
    {
      const gutterElement = gutterElements[0];
      const startPosition = {
        clientX: 100,
        clientY: 0,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[0][0]).toEqual([100, 100, 100, 100]);
      expect(onChange.mock.calls[0][0]).toEqual([100, 100, 100, 100]);

      const endPosition = {
        clientX: 200,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [200, 100, 100, 100];
      expect(onGutterMove.mock.calls[0][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[1][0]).toEqual(expectMovedSizes);
      setRect(itemElements[0], {
        ...defaultRect,
        width: 200,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[0][0]).toEqual(expectMovedSizes);
    }

    // move gutter2 position form 300 to 350
    {
      const gutterElement = gutterElements[1];
      const startPosition = {
        clientX: 300,
        clientY: 0,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[1][0]).toEqual([200, 100, 100, 100]);

      const endPosition = {
        clientX: 350,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [200, 150, 100, 100];
      expect(onGutterMove.mock.calls[1][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[2][0]).toEqual(expectMovedSizes);
      setRect(itemElements[1], {
        ...defaultRect,
        width: 150,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[1][0]).toEqual(expectMovedSizes);
    }

    // move gutter2 position form 350 to 0
    {
      const gutterElement = gutterElements[1];
      const startPosition = {
        clientX: 350,
        clientY: 0,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[2][0]).toEqual([200, 150, 100, 100]);

      const endPosition = {
        clientX: 0,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [200, 0, 100, 100];
      expect(onGutterMove.mock.calls[2][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[3][0]).toEqual(expectMovedSizes);
      setRect(itemElements[1], {
        ...defaultRect,
        width: 0,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[2][0]).toEqual(expectMovedSizes);
    }
  });

  test('vertical: adjust size', async () => {
    const onChange = jest.fn();
    const onGutterDown = jest.fn();
    const onGutterMove = jest.fn();
    const onGutterUp = jest.fn();
    render(
      <FixedSplit
        direction="vertical"
        onChange={onChange}
        onGutterDown={onGutterDown}
        onGutterMove={onGutterMove}
        onGutterUp={onGutterUp}
      >
        {Array.from(Array(4).keys()).map((key) => (
          <div key={key}>{key}</div>
        ))}
      </FixedSplit>
    );

    const itemElements = screen.getAllByTestId('split__item');
    expect(itemElements).toHaveLength(4);
    itemElements.forEach((item) => {
      setRect(item, {
        ...defaultRect,
        height: 100,
      });
    });
    const gutterElements = screen.getAllByTestId('split__gutter');
    expect(gutterElements).toHaveLength(4);

    // move gutter1 position form 100 to 200
    {
      const gutterElement = gutterElements[0];
      const startPosition = {
        clientX: 0,
        clientY: 100,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[0][0]).toEqual([100, 100, 100, 100]);
      expect(onChange.mock.calls[0][0]).toEqual([100, 100, 100, 100]);

      const endPosition = {
        clientX: 0,
        clientY: 200,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [200, 100, 100, 100];
      expect(onGutterMove.mock.calls[0][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[1][0]).toEqual(expectMovedSizes);
      setRect(itemElements[0], {
        ...defaultRect,
        height: 200,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[0][0]).toEqual(expectMovedSizes);
    }

    // move gutter2 position form 300 to 350
    {
      const gutterElement = gutterElements[1];
      const startPosition = {
        clientX: 0,
        clientY: 300,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[1][0]).toEqual([200, 100, 100, 100]);

      const endPosition = {
        clientX: 0,
        clientY: 350,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [200, 150, 100, 100];
      expect(onGutterMove.mock.calls[1][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[2][0]).toEqual(expectMovedSizes);
      setRect(itemElements[1], {
        ...defaultRect,
        height: 150,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[1][0]).toEqual(expectMovedSizes);
    }

    // move gutter2 position form 350 to 0
    {
      const gutterElement = gutterElements[1];
      const startPosition = {
        clientX: 0,
        clientY: 350,
      };
      fireEvent.mouseDown(gutterElement, startPosition);
      expect(onGutterDown.mock.calls[2][0]).toEqual([200, 150, 100, 100]);

      const endPosition = {
        clientX: 0,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [200, 0, 100, 100];
      expect(onGutterMove.mock.calls[2][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[3][0]).toEqual(expectMovedSizes);
      setRect(itemElements[1], {
        ...defaultRect,
        height: 0,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[2][0]).toEqual(expectMovedSizes);
    }
  });

  test('mini item size', async () => {
    const onChange = jest.fn();
    const onGutterDown = jest.fn();
    const onGutterMove = jest.fn();
    const onGutterUp = jest.fn();
    render(
      <FixedSplit
        minItemSizes={50}
        onChange={onChange}
        onGutterDown={onGutterDown}
        onGutterMove={onGutterMove}
        onGutterUp={onGutterUp}
      >
        {Array.from(Array(4).keys()).map((key) => (
          <div key={key}>{key}</div>
        ))}
      </FixedSplit>
    );

    const itemElements = screen.getAllByTestId('split__item');
    expect(itemElements).toHaveLength(4);
    itemElements.forEach((item) => {
      setRect(item, {
        ...defaultRect,
        width: 100,
      });
    });
    const gutterElements = screen.getAllByTestId('split__gutter');
    expect(gutterElements).toHaveLength(4);

    // move gutter1 position form 100 to 0
    {
      const gutterElement = gutterElements[0];
      const startPosition = {
        clientX: 100,
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
      const expectMovedSizes = [50, 100, 100, 100];
      expect(onGutterMove.mock.calls[0][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[1][0]).toEqual(expectMovedSizes);
      setRect(itemElements[0], {
        ...defaultRect,
        width: 50,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[0][0]).toEqual(expectMovedSizes);
    }

    // move gutter2 position form 150 to 0
    {
      const gutterElement = gutterElements[1];
      const startPosition = {
        clientX: 150,
        clientY: 0,
      };
      fireEvent.mouseDown(gutterElement, startPosition);

      const endPosition = {
        clientX: 0,
        clientY: 0,
      };
      fireEvent.mouseMove(gutterElement, endPosition);
      const expectMovedSizes = [50, 50, 100, 100];
      expect(onGutterMove.mock.calls[1][0]).toEqual(expectMovedSizes);
      expect(onChange.mock.calls[2][0]).toEqual(expectMovedSizes);
      setRect(itemElements[1], {
        ...defaultRect,
        width: 50,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[1][0]).toEqual(expectMovedSizes);
    }
  });
});
