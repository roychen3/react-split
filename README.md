# React-Split

Split element

[DEMO](https://roychen3.github.io/react-split/)

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

### FlexSplit

```javascript
import { FlexSplit } from './Split';

function Component() {
  return (
    <FlexSplit
      children     // ReactNode
      direction    // Direction | undefined
      minItemSizes // ItemSizes | undefined
      itemSizes    // ItemSizes | undefined
      gutterSize   // number | undefined
      gutterStyle  // React.CSSProperties | undefined
      onChange     // (itemSizes: number[]) => void | undefined
      onGutterDown // (itemSizes: number[]) => void | undefined
      onGutterMove // (itemSizes: number[]) => void | undefined
      onGutterUp   // (itemSizes: number[]) => void | undefined
    >
      <div className="block">A Component</div>
      <div className="block">B Component</div>
      <div className="block">C Component</div>
      <div className="block">D Component</div>
      <div className="block">E Component</div>
    </FlexSplit>
  );
}
```

### FixedSplit

```javascript
import { FixedSplit } from './Split';

function Component() {
  return (
    <FixedSplit
      children     // ReactNode
      direction    // Direction | undefined
      minItemSizes // ItemSizes | undefined
      itemSizes    // ItemSizes | undefined
      gutterSize   // number | undefined
      gutterStyle  // React.CSSProperties | undefined
      onChange     // (itemSizes: number[]) => void  | undefined
      onGutterDown // (itemSizes: number[]) => void  | undefined
      onGutterMove // (itemSizes: number[]) => void  | undefined
      onGutterUp   // (itemSizes: number[]) => void  | undefined
    >
      <div className="block">A Component</div>
      <div className="block">B Component</div>
      <div className="block">C Component</div>
      <div className="block">D Component</div>
      <div className="block">E Component</div>
    </FixedSplit>
  );
}
```

## License

[LICENSE](LICENSE)
