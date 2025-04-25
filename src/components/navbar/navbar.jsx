import React from "react";
import Button from "../button/button";

export default function Navbar() {
  return (
    <div className="p-4 space-y-4">
      <Button variant="login" onClick={() => alert("login clicked!")}>
        login
      </Button>
    </div>
  );
}
