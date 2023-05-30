import { useState } from 'react';
import Split from './Split';

import './styles.css';

export default function App() {
  const [minHorizontalFlexItemSizes, setHorizontalFlexMinItemSizes] = useState<
    number | number[]
  >();
  const [horizontalFlexItemSizes, setHorizontalFlexItemSizes] = useState<
    number | number[]
  >();

  const [minHorizontalFixedItemSizes, setHorizontalFixedMinItemSizes] =
    useState<number | number[]>();
  const [horizontalFixedItemSizes, setHorizontalFixedItemSizes] = useState<
    number | number[]
  >();

  const [minVerticalFlexItemSizes, setVerticalFlexMinItemSizes] = useState<
    number | number[]
  >();
  const [verticalFlexItemSizes, setVerticalFlexItemSizes] = useState<
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
      <h1>Basic</h1>
      <div className="container container-horizontal">
        <Split>
          <div className="block">A Component</div>
          <div className="block">B Component</div>
        </Split>
      </div>
      <br />

      <h3>set min item size</h3>
      <div>
        <button
          onClick={() => {
            const newSizes = 30;
            setHorizontalFlexMinItemSizes(newSizes);
            setHorizontalFixedMinItemSizes(newSizes);
            setVerticalFlexMinItemSizes(newSizes);
            setVerticalFixedMinItemSizes(newSizes);
          }}
        >
          set all item size to 30
        </button>
        <button
          onClick={() => {
            const newSizes = 200;
            setHorizontalFlexMinItemSizes(newSizes);
            setHorizontalFixedMinItemSizes(newSizes);
            setVerticalFlexMinItemSizes(newSizes);
            setVerticalFixedMinItemSizes(newSizes);
          }}
        >
          set all item size to 200
        </button>
        <button
          onClick={() => {
            const newSizes = [10, 20, 30, 60, 120];
            setHorizontalFlexMinItemSizes(newSizes);
            setHorizontalFixedMinItemSizes(newSizes);
            setVerticalFlexMinItemSizes(newSizes);
            setVerticalFixedMinItemSizes(newSizes);
          }}
        >
          set all item size to [10, 20, 30, 60, 120]
        </button>
        <button
          onClick={() => {
            const newSizes = [120, 60, 30, 20, 10];
            setHorizontalFlexMinItemSizes(newSizes);
            setHorizontalFixedMinItemSizes(newSizes);
            setVerticalFlexMinItemSizes(newSizes);
            setVerticalFixedMinItemSizes(newSizes);
          }}
        >
          set all item size to [120, 60, 30, 20, 10]
        </button>
        <button
          onClick={() => {
            const newSizes: number[] = [];
            setHorizontalFlexMinItemSizes(newSizes);
            setHorizontalFixedMinItemSizes(newSizes);
            setVerticalFlexMinItemSizes(newSizes);
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
            setHorizontalFlexItemSizes(newSizes);
            setHorizontalFixedItemSizes(newSizes);
            setVerticalFlexItemSizes(newSizes);
            setVerticalFixedItemSizes(newSizes);
          }}
        >
          set all item size to 30
        </button>
        <button
          onClick={() => {
            const newSizes = 200;
            setHorizontalFlexItemSizes(newSizes);
            setHorizontalFixedItemSizes(newSizes);
            setVerticalFlexItemSizes(newSizes);
            setVerticalFixedItemSizes(newSizes);
          }}
        >
          set all item size to 200
        </button>
        <button
          onClick={() => {
            const newSizes = [10, 20, 30, 60, 120];
            setHorizontalFlexItemSizes(newSizes);
            setHorizontalFixedItemSizes(newSizes);
            setVerticalFlexItemSizes(newSizes);
            setVerticalFixedItemSizes(newSizes);
          }}
        >
          set all item size to [10, 20, 30, 60, 120]
        </button>
        <button
          onClick={() => {
            const newSizes = [120, 60, 30, 20, 10];
            setHorizontalFlexItemSizes(newSizes);
            setHorizontalFixedItemSizes(newSizes);
            setVerticalFlexItemSizes(newSizes);
            setVerticalFixedItemSizes(newSizes);
          }}
        >
          set all item size to [120, 60, 30, 20, 10]
        </button>
        <button
          onClick={() => {
            const newSizes: number[] = [];
            setHorizontalFlexItemSizes(newSizes);
            setHorizontalFixedItemSizes(newSizes);
            setVerticalFlexItemSizes(newSizes);
            setVerticalFixedItemSizes(newSizes);
          }}
        >
          set all item size to []
        </button>
      </div>

      <h1>Horizontal & Flex</h1>
      <div className="container container-horizontal">
        <Split
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
          <div className="block">A Component</div>
          <div className="block">B Component</div>
          <div className="block">C Component</div>
          <div className="block">D Component</div>
          <div className="block">E Component</div>
        </Split>
      </div>
      <br />

      <h1>Horizontal & Fixed</h1>
      <div className="container container-horizontal">
        <Split
          flexContainer={false}
          minItemSizes={minHorizontalFixedItemSizes}
          // itemSizes={horizontalFixedItemSizes}
          // onGutterDown={(newItemSizes) => {
          //   console.log('onGutterDown', newItemSizes);
          // }}
          onGutterMove={(newItemSizes) => {
            // console.log('onGutterMove', newItemSizes);
            setHorizontalFixedItemSizes(newItemSizes);
          }}
          // onGutterUp={(newItemSizes) => {
          //   console.log('onGutterUp', newItemSizes);
          // }}
        >
          <div className="block">A Component</div>
          <div className="block">B Component</div>
          <div className="block">C Component</div>
          <div className="block">D Component</div>
          <div className="block">E Component</div>
        </Split>
      </div>
      <br />

      <h1>Vertical & Flex</h1>
      <div className="container container-vertical">
        <Split
          direction="vertical"
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
          <div className="block">A Component</div>
          <div className="block">B Component</div>
          <div className="block">C Component</div>
          <div className="block">D Component</div>
          <div className="block">E Component</div>
        </Split>
      </div>
      <br />

      <h1>Vertical & Fixed</h1>
      <div className="container container-vertical">
        <Split
          direction="vertical"
          flexContainer={false}
          minItemSizes={minVerticalFixedItemSizes}
          // itemSizes={verticalFixedItemSizes}
          // onGutterDown={(newItemSizes) => {
          //   console.log('onGutterDown', newItemSizes);
          // }}
          onGutterMove={(newItemSizes) => {
            // console.log('onGutterMove', newItemSizes);
            setVerticalFixedItemSizes(newItemSizes);
          }}
          // onGutterUp={(newItemSizes) => {
          //   console.log('onGutterUp', newItemSizes);
          // }}
        >
          <div className="block">A Component</div>
          <div className="block">B Component</div>
          <div className="block">C Component</div>
          <div className="block">D Component</div>
          <div className="block">E Component</div>
        </Split>
      </div>
    </div>
  );
}
