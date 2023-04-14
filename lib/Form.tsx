import React, { useRef, useState, useEffect, FormEvent } from "react";
import { createDebouncer } from "./debounce";
import type { ValidationResult, FormProps, Validator } from "./types.d";

function Form(props: FormProps) {
    const {
        onSubmit,
        children,
        validators = {},
        onValidate,
        validationTimeout = 200,
    } = props;
    const formRef = useRef<HTMLFormElement>(null);
    const [validations, setValidations] = useState<ValidationResult>({});

    const validateField = (value: string, validator: Validator) => {
        // validator is a zod schema
        if ("safeParse" in validator) {
            return validator.safeParse(value)?.success;
        }

        // validator is a regular expression
        if (validator instanceof RegExp) {
            return Boolean(value?.match?.(validator));
        }

        // validator is a function
        if (typeof validator === "function") {
            return Boolean(validator(value));
        }

        return false;
    };

    const validationsUpdatedHandler = () => {
        onValidate?.(validations);
    };

    const setupForm = () => {
        // setup form
        Object.entries(validators).forEach((validator) => {
            const [fieldName, fieldValidator] = validator;

            // set initial validation status
            setValidations((currentValidations) => ({
                ...currentValidations,
                [fieldName]: "pending",
            }));

            const inputElement = formRef.current?.elements?.[
                fieldName as keyof HTMLFormControlsCollection
            ] as HTMLInputElement;

            if (!inputElement) {
                throw new Error(
                    `Could not find an input element with name ${fieldName}`
                );
            }

            const inputValidationHandler = () => {
                const validationResult = validateField(
                    inputElement.value,
                    fieldValidator
                );

                // store validation result
                setValidations((currentFieldValidations) => ({
                    ...currentFieldValidations,
                    [fieldName]: validationResult ? "success" : "fail",
                }));
            };

            // after the first focus lost, attach inputHandler for validation
            const blurHandler = () => {
                inputElement.removeEventListener("blur", blurHandler);
                inputElement.addEventListener(
                    "input",
                    createDebouncer(inputValidationHandler, validationTimeout)
                );
                inputValidationHandler();
            };

            inputElement.addEventListener("blur", blurHandler);
        });
    };

    const getFormValidationResult = () => {
        let isFormValidationSuccessful = true;

        // check if each field is valid
        Object.entries(validations).forEach((validation) => {
            const [field, validationResult] = validation;

            // run pending validations
            if (validationResult === "pending") {
                const inputElement = formRef.current?.elements?.[
                    field as keyof HTMLFormControlsCollection
                ] as HTMLInputElement;

                inputElement.dispatchEvent(new Event("blur"));
                isFormValidationSuccessful = false;
            } else if (validationResult === "fail") {
                isFormValidationSuccessful = false;
            }
        });
        return isFormValidationSuccessful;
    };

    const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!getFormValidationResult()) {
            return false;
        }

        const formElements = event.currentTarget?.elements;
        const formValues: Record<string, unknown> = {};

        for (let i = 0; i < formElements.length; i += 1) {
            const element = formElements[i] as HTMLFormElement;

            if (element.name && element.value) {
                formValues[element.name] = element.value;
            }
        }

        onSubmit(formValues);
        return true;
    };

    useEffect(setupForm, []);
    useEffect(validationsUpdatedHandler, [validations]);

    return (
        <form
            ref={formRef}
            onSubmit={submitHandler}
        >
            {children}
        </form>
    );
}

export default Form;
