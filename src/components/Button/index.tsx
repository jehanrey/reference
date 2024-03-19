import { ComponentProps, forwardRef } from "react";

const Button = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  function Button({ children, ...rest }, ref) {
    return (
      <button ref={ref} {...rest}>
        {children}
      </button>
    );
  },
);

export default Button;
