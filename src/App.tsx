import Split from './Split';

import './styles.css';

export default function App() {
  return (
    <div className="App">
      <h1>Horizontal & Flex</h1>
      <div className="container container-horizontal">
        <Split
          // minItemSizes={30}
          // minItemSizes={[]}
          // minItemSizes={[120, 60, 30, 20, 10]}
          // itemSizes={120}
          // itemSizes={[]}
          // itemSizes={[10, 20, 30, 60, 120]}
        // onGutterDown={(event) => {
        //   console.log('onGutterDown', event);
        // }}
        // onGutterMove={(event) => {
        //   console.log('onGutterMove', event);
        // }}
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
          // minItemSizes={30}
          // minItemSizes={[]}
          minItemSizes={[120, 60, 30, 20, 10]}
          // itemSizes={120}
          // itemSizes={[]}
          // itemSizes={[10, 20, 30, 60, 120]}
        // onGutterDown={(event) => {
        //   console.log('onGutterDown', event);
        // }}
        // onGutterMove={(event) => {
        //   console.log('onGutterMove', event);
        // }}
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

      {/* <h1>Vertical & Flex</h1>
      <div className="container container-vertical">
        <Split
          direction="vertical"
        // itemSizes={120}
        // itemSizes={[]}
        // itemSizes={[10, 20, 30, 60, 120]}
        // onGutterDown={(event) => {
        //   console.log('onGutterDown', event);
        // }}
        // onGutterMove={(event) => {
        //   console.log('onGutterMove', event);
        // }}
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
        // itemSizes={120}
        // itemSizes={[]}
        // itemSizes={[10, 20, 30, 60, 120]}
        // onGutterDown={(event) => {
        //   console.log('onGutterDown', event);
        // }}
        // onGutterMove={(event) => {
        //   console.log('onGutterMove', event);
        // }}
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
      </div> */}
    </div>
  );
}
