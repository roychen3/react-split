# React-Split

Split element

## Getting Started

```bash
npm run start
```

## Installation

node v16.15.0

```bash
npm install
```

## Usage

```javascript
import Split from './Split';

function Component() {
  return (
    <Split 
      children      // ReactNode
      direction     // 'horizontal' | 'vertical' | undefined
      flexContainer // boolean | undefined
    >
      <div className="block">A Component</div>
      <div className="block">B Component</div>
      <div className="block">C Component</div>
      <div className="block">D Component</div>
      <div className="block">E Component</div>
    </Split>
  );
}
```

## License

[LICENSE](LICENSE)
