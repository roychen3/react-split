import Split from './Split';

import './styles.css';

export default function App() {
  return (
    <div className="App">
      <h1>Horizontal & Flex</h1>
      <div className="container container-horizontal">
        <Split
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

      <h1>Vertical & Flex</h1>
      <div className="container container-vertical">
        <Split
          direction="vertical"
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
    </div>
  );
}
