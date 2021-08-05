import React from "react";

type LoginButtonProps = {
  onClick: () => void
}

const LoginButton = (props: LoginButtonProps) => {
  return <button onClick={props.onClick}>Log In</button>;
};

export default LoginButton;
