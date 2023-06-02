import { useState } from 'react';
import Split from './FlexSplit';

import './styles.css';

export default function App() {
  const [childrenCount, setChildrenCount] = useState(5);

  const [minHorizontalFlexItemSizes, setHorizontalFlexMinItemSizes] = useState<
    number | number[]
  >();
  const [horizontalFlexItemSizes, setHorizontalFlexItemSizes] = useState<
    number | number[]
  >();

  const [minVerticalFlexItemSizes, setVerticalFlexMinItemSizes] = useState<
    number | number[]
  >();
  const [verticalFlexItemSizes, setVerticalFlexItemSizes] = useState<
    number | number[]
  >();

  return (
    <div className="App">
      <h3>set min item size</h3>
      <div>
        <button
          onClick={() => {
            const newSizes = 30;
            setHorizontalFlexMinItemSizes(newSizes);
            setVerticalFlexMinItemSizes(newSizes);
          }}
        >
          set all item size to 30
        </button>
        <button
          onClick={() => {
            const newSizes = 200;
            setHorizontalFlexMinItemSizes(newSizes);
            setVerticalFlexMinItemSizes(newSizes);
          }}
        >
          set all item size to 200
        </button>
        <button
          onClick={() => {
            const newSizes = [10, 20, 30, 60, 120];
            setHorizontalFlexMinItemSizes(newSizes);
            setVerticalFlexMinItemSizes(newSizes);
          }}
        >
          set all item size to [10, 20, 30, 60, 120]
        </button>
        <button
          onClick={() => {
            const newSizes = [120, 60, 30, 20, 10];
            setHorizontalFlexMinItemSizes(newSizes);
            setVerticalFlexMinItemSizes(newSizes);
          }}
        >
          set all item size to [120, 60, 30, 20, 10]
        </button>
        <button
          onClick={() => {
            const newSizes: number[] = [];
            setHorizontalFlexMinItemSizes(newSizes);
            setVerticalFlexMinItemSizes(newSizes);
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
            setHorizontalFlexItemSizes(newSizes);
            setVerticalFlexItemSizes(newSizes);
          }}
        >
          set all item size to 30
        </button>
        <button
          onClick={() => {
            const newSizes = 200;
            setHorizontalFlexItemSizes(newSizes);
            setVerticalFlexItemSizes(newSizes);
          }}
        >
          set all item size to 200
        </button>
        <button
          onClick={() => {
            const newSizes = [10, 20, 30, 60, 120];
            setHorizontalFlexItemSizes(newSizes);
            setVerticalFlexItemSizes(newSizes);
          }}
        >
          set all item size to [10, 20, 30, 60, 120]
        </button>
        <button
          onClick={() => {
            const newSizes = [120, 60, 30, 20, 10];
            setHorizontalFlexItemSizes(newSizes);
            setVerticalFlexItemSizes(newSizes);
          }}
        >
          set all item size to [120, 60, 30, 20, 10]
        </button>
        <button
          onClick={() => {
            const newSizes: number[] = [];
            setHorizontalFlexItemSizes(newSizes);
            setVerticalFlexItemSizes(newSizes);
          }}
        >
          set all item size to []
        </button>
      </div>

      <button
        onClick={() => {
          setChildrenCount(childrenCount + 1);
        }}
      >
        Add child
      </button>

      <h1>Horizontal & Flex</h1>
      <div className="container container-horizontal">
        <Split
          // gutterSize={30}
          minItemSizes={minHorizontalFlexItemSizes}
          // itemSizes={horizontalFlexItemSizes}
          // onGutterDown={(newItemSizes) => {
          //   console.log('onGutterDown', newItemSizes);
          // }}
          onGutterMove={(newItemSizes) => {
            // console.log('onGutterMove', newItemSizes);
            setHorizontalFlexItemSizes(newItemSizes);
          }}
          // onGutterUp={(newItemSizes) => {
          //   console.log('onGutterUp', newItemSizes);
          // }}
        >
          {Array.from(Array(childrenCount).keys()).map((item) => (
            <div key={item} className="block">
              {item + 1} Component
            </div>
          ))}
        </Split>
      </div>
      <br />

      <h1>Vertical & Flex</h1>
      <div className="container container-vertical">
        <Split
          direction="vertical"
          // gutterSize={30}
          minItemSizes={minVerticalFlexItemSizes}
          // itemSizes={verticalFlexItemSizes}
          // onGutterDown={(newItemSizes) => {
          //   console.log('onGutterDown', newItemSizes);
          // }}
          onGutterMove={(newItemSizes) => {
            // console.log('onGutterMove', newItemSizes);
            setVerticalFlexItemSizes(newItemSizes);
          }}
          // onGutterUp={(newItemSizes) => {
          //   console.log('onGutterUp', newItemSizes);
          // }}
        >
          {Array.from(Array(childrenCount).keys()).map((item) => (
            <div key={item} className="block">
              {item + 1} Component
            </div>
          ))}
        </Split>
      </div>
      <br />
    </div>
  );
}
