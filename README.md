# Formunition

![formunition logo](./formunition-logo.png)

### The most lightweight and flexible form library out there for React!

#### 🐤 As tiny as 1 KB in size (gzipped)

#### 🔀 Effortlessly works with UI component libraries

#### 🛡️ Easy validations with RegExp and Zod

#### 🚀 Designed with simplicity and performance in mind

### Install

```sh
npm install formunition
```

### Usage

```tsx
// LoginForm.tsx

import React, { useState } from "react";
import Form, { ValidationResult } from "formunition";

export default function LoginForm() {
  const [validations, setValidations] = useState<ValidationResult>({});

  const validators = {
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // or z.string().email(),
    password: /.{8,}$/,
  };

  return (
    <Form
      onSubmit={console.log}
      onValidate={setValidations}
      validators={validators}
    >
      <div>
        <input type="email" name="email" placeholder="Email" />
        {validations.email === "fail" && <p>Invalid email!</p>}
      </div>
      <div>
        <input type="password" name="password" placeholder="Password" />
        {validations.password === "fail" && <p>Weak password!</p>}
      </div>
      <button type="submit">Login</button>
    </Form>
  );
}
```
