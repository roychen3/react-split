# React-Split

Split element

## Installation

node v16.15.0

```bash
npm install
```

## Usage

### Horizontal & Flex

```javascript
import Split from './Split';

function Component() {
  return (
    <Split 
      direction // string: 'horizontal' | 'vertical'
      flexContainer // boolean
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

[MIT](https://choosealicense.com/licenses/mit/)
