import React from "react";

type LogoutButtonProps = {
  onClick: () => void
}

const LogoutButton = (props: LogoutButtonProps) => {
  return (
    <button onClick={props.onClick}>Log Out</button>
  );
};

export default LogoutButton;
