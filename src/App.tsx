import { useState } from 'react'
import Split from './Split';

import './styles.css';

export default function App() {
  const [minItemSizes, setMinItemSizes] = useState<number | number[]>([])
  const [itemSizes, setItemSizes] = useState<number | number[]>([])
  return (
    <div className="App">
      <h3>set item size</h3>
      <button onClick={() => { setItemSizes(30) }}>set all item size to 30</button>
      <button onClick={() => { setItemSizes(200) }}>set all item size to 200</button>
      <button onClick={() => { setItemSizes([10, 20, 30, 60, 120]) }}>set all item size to [10, 20, 30, 60, 120]</button>
      <button onClick={() => { setItemSizes([120, 60, 30, 20, 10]) }}>set all item size to [120, 60, 30, 20, 10]</button>
      <button onClick={() => { setItemSizes([]) }}>set all item size to []</button>

      <h3>set min item size</h3>
      <button onClick={() => { setMinItemSizes(30) }}>set all item min size to 30</button>
      <button onClick={() => { setMinItemSizes(200) }}>set all item min size to 200</button>
      <button onClick={() => { setMinItemSizes([10, 20, 30, 60, 120]) }}>set all item min size to [10, 20, 30, 60, 120]</button>
      <button onClick={() => { setMinItemSizes([120, 60, 30, 20, 10]) }}>set all item min size to [120, 60, 30, 20, 10]</button>
      <button onClick={() => { setMinItemSizes([]) }}>set all item min size to []</button>

      <h1>Horizontal & Flex</h1>
      <div className="container container-horizontal">
        <Split
          minItemSizes={minItemSizes}
          itemSizes={itemSizes}
        // onGutterDown={(event) => {
        //   console.log('onGutterDown', event);
        // }}
        onGutterMove={(event) => {
          console.log('onGutterMove', event);
        }}
        // onGutterUp={(event) => {
        //   console.log('onGutterUp', event);
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
          minItemSizes={minItemSizes}
          itemSizes={itemSizes}
        // onGutterDown={(event) => {
        //   console.log('onGutterDown', event);
        // }}
        onGutterMove={(event) => {
          console.log('onGutterMove', event);
        }}
        // onGutterUp={(event) => {
        //   console.log('onGutterUp', event);
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
          minItemSizes={minItemSizes}
          itemSizes={itemSizes}
        // onGutterDown={(event) => {
        //   console.log('onGutterDown', event);
        // }}
        onGutterMove={(event) => {
          console.log('onGutterMove', event);
        }}
        // onGutterUp={(event) => {
        //   console.log('onGutterUp', event);
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
          minItemSizes={minItemSizes}
          itemSizes={itemSizes}
        // onGutterDown={(event) => {
        //   console.log('onGutterDown', event);
        // }}
        onGutterMove={(event) => {
          console.log('onGutterMove', event);
        }}
        // onGutterUp={(event) => {
        //   console.log('onGutterUp', event);
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
