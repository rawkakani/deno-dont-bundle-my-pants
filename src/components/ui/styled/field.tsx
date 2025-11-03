import { Field } from "@ark-ui/react/field";
import { styled } from "styled-system/jsx";
import { field, input } from "styled-system/recipes";
import type { ComponentProps } from "styled-system/types";
import { createStyleContext } from "styled-system/jsx";

const { withProvider, withContext } = createStyleContext(field);

export const RootProvider = withProvider(Field.RootProvider, "root");
export type RootProviderProps = ComponentProps<typeof RootProvider>;

export const Root = withProvider(Field.Root, "root");
export type RootProps = ComponentProps<typeof Root>;

export const ErrorText = withContext(Field.ErrorText, "errorText");
export type ErrorTextProps = ComponentProps<typeof ErrorText>;

export const HelperText = withContext(Field.HelperText, "helperText");
export type HelperTextProps = ComponentProps<typeof HelperText>;

export const Label = withContext(Field.Label, "label");
export type LabelProps = ComponentProps<typeof Label>;

export type InputProps = ComponentProps<typeof Input>;
export const Input = styled(Field.Input, input);

export type TextareaProps = ComponentProps<typeof Textarea>;
export const Textarea = styled(Field.Textarea, input);

export { FieldContext as Context } from "@ark-ui/react/field";
