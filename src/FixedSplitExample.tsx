import { useState } from 'react';
import Split from './FixedSplit';

import './styles.css';

export default function App() {
  const [childrenCount, setChildrenCount] = useState(5)

  const [minHorizontalFixedItemSizes, setHorizontalFixedMinItemSizes] =
    useState<number | number[]>();
  const [horizontalFixedItemSizes, setHorizontalFixedItemSizes] = useState<
    number | number[]
  >();

  const [minVerticalFixedItemSizes, setVerticalFixedMinItemSizes] = useState<
    number | number[]
  >();
  const [verticalFixedItemSizes, setVerticalFixedItemSizes] = useState<
    number | number[]
  >();

  return (
    <div className="App">
      <h3>set min item size</h3>
      <div>
        <button
          onClick={() => {
            const newSizes = 30;
            setHorizontalFixedMinItemSizes(newSizes);
            setVerticalFixedMinItemSizes(newSizes);
          }}
        >
          set all item size to 30
        </button>
        <button
          onClick={() => {
            const newSizes = 200;
            setHorizontalFixedMinItemSizes(newSizes);
            setVerticalFixedMinItemSizes(newSizes);
          }}
        >
          set all item size to 200
        </button>
        <button
          onClick={() => {
            const newSizes = [10, 20, 30, 60, 120];
            setHorizontalFixedMinItemSizes(newSizes);
            setVerticalFixedMinItemSizes(newSizes);
          }}
        >
          set all item size to [10, 20, 30, 60, 120]
        </button>
        <button
          onClick={() => {
            const newSizes = [120, 60, 30, 20, 10];
            setHorizontalFixedMinItemSizes(newSizes);
            setVerticalFixedMinItemSizes(newSizes);
          }}
        >
          set all item size to [120, 60, 30, 20, 10]
        </button>
        <button
          onClick={() => {
            const newSizes: number[] = [];
            setHorizontalFixedMinItemSizes(newSizes);
            setVerticalFixedMinItemSizes(newSizes);
          }}
        >
          set all item size to []
        </button>
      </div>

      <h3>set item size</h3>
      <div>
        <button
          onClick={() => {
            const newSizes = 30;
            setHorizontalFixedItemSizes(newSizes);
            setVerticalFixedItemSizes(newSizes);
          }}
        >
          set all item size to 30
        </button>
        <button
          onClick={() => {
            const newSizes = 200;
            setHorizontalFixedItemSizes(newSizes);
            setVerticalFixedItemSizes(newSizes);
          }}
        >
          set all item size to 200
        </button>
        <button
          onClick={() => {
            const newSizes = [10, 20, 30, 60, 120];
            setHorizontalFixedItemSizes(newSizes);
            setVerticalFixedItemSizes(newSizes);
          }}
        >
          set all item size to [10, 20, 30, 60, 120]
        </button>
        <button
          onClick={() => {
            const newSizes = [120, 60, 30, 20, 10];
            setHorizontalFixedItemSizes(newSizes);
            setVerticalFixedItemSizes(newSizes);
          }}
        >
          set all item size to [120, 60, 30, 20, 10]
        </button>
        <button
          onClick={() => {
            const newSizes: number[] = [];
            setHorizontalFixedItemSizes(newSizes);
            setVerticalFixedItemSizes(newSizes);
          }}
        >
          set all item size to []
        </button>
      </div>

      <button
        onClick={() => { setChildrenCount(childrenCount + 1) }}
      >
        Add child
      </button>

      <h1>Horizontal & Fixed</h1>
      <div className="container container-horizontal">
        <Split
          // gutterSize={30}
          minItemSizes={minHorizontalFixedItemSizes}
          // itemSizes={horizontalFixedItemSizes}
          // onGutterDown={(newItemSizes) => {
          //   console.log('onGutterDown', newItemSizes);
          // }}
          onGutterMove={({ itemSizes }) => {
            // console.log('onGutterMove', newItemSizes);
            setHorizontalFixedItemSizes(itemSizes);
          }}
        // onGutterUp={(newItemSizes) => {
        //   console.log('onGutterUp', newItemSizes);
        // }}
        >
          {Array.from(Array(childrenCount).keys()).map((item) => (
            <div key={item} className="block">{item + 1} Component</div>
          ))}
        </Split>
      </div>
      <br />

      <h1>Vertical & Fixed</h1>
      <div className="container container-vertical">
        <Split
          direction="vertical"
          // gutterSize={30}
          minItemSizes={minVerticalFixedItemSizes}
          // itemSizes={verticalFixedItemSizes}
          // onGutterDown={(newItemSizes) => {
          //   console.log('onGutterDown', newItemSizes);
          // }}
          onGutterMove={({ itemSizes }) => {
            // console.log('onGutterMove', newItemSizes);
            setVerticalFixedItemSizes(itemSizes);
          }}
        // onGutterUp={(newItemSizes) => {
        //   console.log('onGutterUp', newItemSizes);
        // }}
        >
          {Array.from(Array(childrenCount).keys()).map((item) => (
            <div key={item} className="block">{item + 1} Component</div>
          ))}
        </Split>
      </div>
    </div>
  );
}
