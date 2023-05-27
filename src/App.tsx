import Split from './Split';

import './styles.css';

export default function App() {
  return (
    <div className="App">
      <h1>Horizontal & Flex</h1>
      <div className="container container-horizontal">
        <Split>
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
        <Split flexContainer={false}>
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
        <Split direction="vertical">
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
        <Split direction="vertical" flexContainer={false}>
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
