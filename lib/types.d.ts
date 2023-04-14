import { ReactNode } from "react";

type FieldName = string | number;

type ZodSchema = {
    safeParse: (value: unknown) => { success: boolean };
};

type Validator = RegExp | ((value: string) => boolean) | ZodSchema;

export type ValidationStatus = "pending" | "fail" | "success";

export type ValidationResult = Record<string, ValidationStatus>;

export type FormProps = {
    children: ReactNode;
    onSubmit: (values: any) => void;
    onValidate?: (validationResult: ValidationResult) => void;
    validators?: Record<FieldName, Validator>;
    validationTimeout?: number;
};
