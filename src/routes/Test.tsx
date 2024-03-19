import { useState } from "react";

import Button from "../components/Button";

const Test = () => {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <div>Hello from Test</div>
      <div className="flex gap-[15px]">
        <Button onClick={() => setCount((x) => ++x)}>Click Me Daddy</Button>
        <div>Count: {count}</div>
      </div>
    </div>
  );
};

export default Test;
