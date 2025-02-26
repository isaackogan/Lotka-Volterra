import {FieldError, UseFormRegister} from "react-hook-form";
import {ChangeEvent, DetailedHTMLProps, FC, InputHTMLAttributes} from "react";
import {Parameters, useParametersStore} from "../stores/model.ts";
import styled from "styled-components";

// input props
export type FormFieldProps =
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
    & {
  type: string;
  placeholder: string;
  name: keyof Parameters;
  register: UseFormRegister<any>;
  error: FieldError | undefined;
  label?: string;
  description?: string;
  onValueChanged?: () => void;
  floatPrecision?: number;
};


const FormElement = styled.div`
    width: 300px;
    display: flex;
    align-items: start;
    flex-direction: column;
`;

const RangeValue = styled.span`
    font-size: 0.9em;
`;

const ErrorText = styled.span`
    font-size: 0.8em;
    color: #d74646;
    margin-top: 5px;
`

export const Label = styled.label`
    font-weight: bold;
    margin-bottom: 5px;
    text-align: left;
    font-size: 1em;
`

export const Description = styled.label`
    text-align: left;
    color: #a2a2a2;
    font-size: 0.8em;
    font-style: italic;
    margin-top: 10px;
`

const FormElementInput = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;
    column-gap: 10px;
    width: 100%;
`;

const FormField: FC<FormFieldProps> = (
    {
      type,
      placeholder,
      name,
      register,
      error,
      defaultValue,
      label,
      description,
      onValueChanged,
      floatPrecision = 2,
      ...props
    }
) => {
  const {set, ...values} = useParametersStore();

  const {onChange, ...rest} = register(name, {
    setValueAs: type === "number" || type === "range" ? (v: string) => parseFloat(v) : undefined
  });

  const onChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const floatValue = parseFloat(e.target.value);
    set(name, floatValue);
    await onChange(e);
    onValueChanged && onValueChanged();
  }


  return (
      <FormElement>
        {label && <Label>{label}</Label>}
        <FormElementInput>
          {type === "range" && <RangeValue>{(values as any)[name].toFixed(floatPrecision)}</RangeValue>}
          <input
              type={type}
              placeholder={placeholder}
              {...rest}
              {...props}
              defaultValue={defaultValue}
              onChange={onChangeHandler}
          />
        </FormElementInput>
        {description && <Description>{description}</Description>}
        {error && <ErrorText><strong>Issue:</strong> {error.message}</ErrorText>}
      </FormElement>
  );
}

export default FormField;