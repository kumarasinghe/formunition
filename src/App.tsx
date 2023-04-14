import React, { useState } from "react";
import { z } from "zod";
import type { ValidationResult } from "lib/types";
import Form from "../lib/Form";

export default function App() {
  const [validations, setValidations] = useState<ValidationResult>({});

  const validators = {
    name: /([A-Z]|[a-z]| )+$/,
    email: z.string().email(),
    password: /.{8,}$/,
  };

  return (
    <Form
      onSubmit={console.log}
      onValidate={setValidations}
      validators={validators}
    >
      <div>
        <input type="text" name="name" placeholder="Name" />
        {validations.name === "fail" && <p>Invalid name!</p>}
      </div>
      <div>
        <input type="email" name="email" placeholder="Email" />
        {validations.email === "fail" && <p>Invalid email!</p>}
      </div>
      <div>
        <input type="password" name="password" placeholder="Password" />
        {validations.password === "fail" && <p>Weak password!</p>}
      </div>
      <button type="submit">Signup</button>
    </Form>
  );
}
