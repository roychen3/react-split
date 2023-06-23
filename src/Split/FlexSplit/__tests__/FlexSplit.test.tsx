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
      const width = 100;
      const gutter = 10;
      setRect(item, {
        ...defaultRect,
        width,
        left: itemIdx * width + itemIdx * gutter,
        right: (itemIdx + 1) * width + itemIdx * gutter,
      });
      // console.log('itemElements', item.getBoundingClientRect());
    });
    const gutterElements = screen.getAllByTestId('split__gutter');
    expect(gutterElements).toHaveLength(3);
    gutterElements.forEach((item, itemIdx) => {
      const width = 10;
      const splitItem = 100;
      setRect(item, {
        ...defaultRect,
        width,
        left: (itemIdx + 1) * splitItem + itemIdx * width,
        right: (itemIdx + 1) * splitItem + (itemIdx + 1) * width,
      });
      // console.log('gutterElements', item.getBoundingClientRect());
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
      expect(onGutterMove.mock.calls[0][0]).toEqual([150, 50, 100, 100]);
      expect(onChange.mock.calls[1][0]).toEqual([150, 50, 100, 100]);
      setRect(itemElements[0], {
        ...defaultRect,
        width: 150,
      });
      setRect(itemElements[1], {
        ...defaultRect,
        width: 50,
      });

      fireEvent.mouseUp(gutterElement, endPosition);
      expect(onGutterUp.mock.calls[0][0]).toEqual([150, 50, 100, 100]);
    }

    // move gutter2 position form 300 to 350
    // {
    //   const gutterElement = gutterElements[1];
    //   const startPosition = {
    //     clientX: 300,
    //     clientY: 0,
    //   };
    //   fireEvent.mouseDown(gutterElement, startPosition);
    //   expect(onGutterDown.mock.calls[1][0]).toEqual([200, 100, 100, 100]);

    //   const endPosition = {
    //     clientX: 350,
    //     clientY: 0,
    //   };
    //   fireEvent.mouseMove(gutterElement, endPosition);
    //   expect(onGutterMove.mock.calls[1][0]).toEqual([200, 150, 100, 100]);
    //   expect(onChange.mock.calls[2][0]).toEqual([200, 150, 100, 100]);
    //   setRect(itemElements[1], {
    //     ...defaultRect,
    //     width: 150,
    //   });

    //   fireEvent.mouseUp(gutterElement, endPosition);
    //   expect(onGutterUp.mock.calls[1][0]).toEqual([200, 150, 100, 100]);
    // }

    // move gutter2 position form 350 to 0
    // {
    //   const gutterElement = gutterElements[1];
    //   const startPosition = {
    //     clientX: 350,
    //     clientY: 0,
    //   };
    //   fireEvent.mouseDown(gutterElement, startPosition);
    //   expect(onGutterDown.mock.calls[2][0]).toEqual([200, 150, 100, 100]);

    //   const endPosition = {
    //     clientX: 0,
    //     clientY: 0,
    //   };
    //   fireEvent.mouseMove(gutterElement, endPosition);
    //   expect(onGutterMove.mock.calls[2][0]).toEqual([200, 0, 100, 100]);
    //   expect(onChange.mock.calls[3][0]).toEqual([200, 0, 100, 100]);
    //   setRect(itemElements[1], {
    //     ...defaultRect,
    //     width: 0,
    //   });

    //   fireEvent.mouseUp(gutterElement, endPosition);
    //   expect(onGutterUp.mock.calls[2][0]).toEqual([200, 0, 100, 100]);
    // }
  });

  // test('vertical: adjust size', async () => {
  //   const onChange = jest.fn();
  //   const onGutterDown = jest.fn();
  //   const onGutterMove = jest.fn();
  //   const onGutterUp = jest.fn();
  //   render(
  //     <FlexSplit
  //       direction="vertical"
  //       onChange={onChange}
  //       onGutterDown={onGutterDown}
  //       onGutterMove={onGutterMove}
  //       onGutterUp={onGutterUp}
  //     >
  //       {[...Array(4).keys()].map((key) => (
  //         <div key={key}>{key}</div>
  //       ))}
  //     </FlexSplit>
  //   );

  //   const itemElements = screen.getAllByTestId('split__item');
  //   expect(itemElements).toHaveLength(4);
  //   itemElements.forEach((item) => {
  //     setRect(item, {
  //       ...defaultRect,
  //       height: 100,
  //     });
  //   });
  //   const gutterElements = screen.getAllByTestId('split__gutter');
  //   expect(gutterElements).toHaveLength(4);

  //   // move gutter1 position form 100 to 200
  //   {
  //     const gutterElement = gutterElements[0];
  //     const startPosition = {
  //       clientX: 0,
  //       clientY: 100,
  //     };
  //     fireEvent.mouseDown(gutterElement, startPosition);
  //     expect(onGutterDown.mock.calls[0][0]).toEqual([100, 100, 100, 100]);
  //     expect(onChange.mock.calls[0][0]).toEqual([100, 100, 100, 100]);

  //     const endPosition = {
  //       clientX: 0,
  //       clientY: 200,
  //     };
  //     fireEvent.mouseMove(gutterElement, endPosition);
  //     expect(onGutterMove.mock.calls[0][0]).toEqual([200, 100, 100, 100]);
  //     expect(onChange.mock.calls[1][0]).toEqual([200, 100, 100, 100]);
  //     setRect(itemElements[0], {
  //       ...defaultRect,
  //       height: 200,
  //     });

  //     fireEvent.mouseUp(gutterElement, endPosition);
  //     expect(onGutterUp.mock.calls[0][0]).toEqual([200, 100, 100, 100]);
  //   }

  //   // move gutter2 position form 300 to 350
  //   {
  //     const gutterElement = gutterElements[1];
  //     const startPosition = {
  //       clientX: 0,
  //       clientY: 300,
  //     };
  //     fireEvent.mouseDown(gutterElement, startPosition);
  //     expect(onGutterDown.mock.calls[1][0]).toEqual([200, 100, 100, 100]);

  //     const endPosition = {
  //       clientX: 0,
  //       clientY: 350,
  //     };
  //     fireEvent.mouseMove(gutterElement, endPosition);
  //     expect(onGutterMove.mock.calls[1][0]).toEqual([200, 150, 100, 100]);
  //     expect(onChange.mock.calls[2][0]).toEqual([200, 150, 100, 100]);
  //     setRect(itemElements[1], {
  //       ...defaultRect,
  //       height: 150,
  //     });

  //     fireEvent.mouseUp(gutterElement, endPosition);
  //     expect(onGutterUp.mock.calls[1][0]).toEqual([200, 150, 100, 100]);
  //   }

  //   // move gutter2 position form 350 to 0
  //   {
  //     const gutterElement = gutterElements[1];
  //     const startPosition = {
  //       clientX: 0,
  //       clientY: 350,
  //     };
  //     fireEvent.mouseDown(gutterElement, startPosition);
  //     expect(onGutterDown.mock.calls[2][0]).toEqual([200, 150, 100, 100]);

  //     const endPosition = {
  //       clientX: 0,
  //       clientY: 0,
  //     };
  //     fireEvent.mouseMove(gutterElement, endPosition);
  //     expect(onGutterMove.mock.calls[2][0]).toEqual([200, 0, 100, 100]);
  //     expect(onChange.mock.calls[3][0]).toEqual([200, 0, 100, 100]);
  //     setRect(itemElements[1], {
  //       ...defaultRect,
  //       height: 0,
  //     });

  //     fireEvent.mouseUp(gutterElement, endPosition);
  //     expect(onGutterUp.mock.calls[2][0]).toEqual([200, 0, 100, 100]);
  //   }
  // });

  // test('mini item size', async () => {
  //   const onChange = jest.fn();
  //   render(
  //     <FlexSplit minItemSizes={50} onChange={onChange}>
  //       {[...Array(4).keys()].map((key) => (
  //         <div key={key}>{key}</div>
  //       ))}
  //     </FlexSplit>
  //   );

  //   const itemElements = screen.getAllByTestId('split__item');
  //   expect(itemElements).toHaveLength(4);
  //   itemElements.forEach((item) => {
  //     setRect(item, {
  //       ...defaultRect,
  //       width: 100,
  //     });
  //   });
  //   const gutterElements = screen.getAllByTestId('split__gutter');
  //   expect(gutterElements).toHaveLength(4);

  //   // move gutter1 position form 100 to 0
  //   {
  //     const gutterElement = gutterElements[0];
  //     const startPosition = {
  //       clientX: 100,
  //       clientY: 0,
  //     };
  //     fireEvent.mouseDown(gutterElement, startPosition);
  //     expect(onChange.mock.calls[0][0]).toEqual([100, 100, 100, 100]);

  //     const endPosition = {
  //       clientX: 0,
  //       clientY: 0,
  //     };
  //     fireEvent.mouseMove(gutterElement, endPosition);
  //     expect(onChange.mock.calls[1][0]).toEqual([50, 100, 100, 100]);
  //     setRect(itemElements[0], {
  //       ...defaultRect,
  //       width: 50,
  //     });

  //     fireEvent.mouseUp(gutterElement, endPosition);
  //   }

  //   // move gutter2 position form 150 to 0
  //   {
  //     const gutterElement = gutterElements[1];
  //     const startPosition = {
  //       clientX: 150,
  //       clientY: 0,
  //     };
  //     fireEvent.mouseDown(gutterElement, startPosition);

  //     const endPosition = {
  //       clientX: 0,
  //       clientY: 0,
  //     };
  //     fireEvent.mouseMove(gutterElement, endPosition);
  //     expect(onChange.mock.calls[2][0]).toEqual([50, 50, 100, 100]);
  //     setRect(itemElements[1], {
  //       ...defaultRect,
  //       width: 50,
  //     });

  //     fireEvent.mouseUp(gutterElement, endPosition);
  //   }
  // });
});
