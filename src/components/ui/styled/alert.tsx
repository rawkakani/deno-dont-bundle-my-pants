import { ark } from "@ark-ui/react/factory";
import { alert } from "styled-system/recipes";
import type { ComponentProps } from "styled-system/types";
import { createStyleContext } from "styled-system/jsx";

const { withProvider, withContext } = createStyleContext(alert);

export const Root = withProvider(ark.div, "root");
export type RootProps = ComponentProps<typeof Root>;

export const Content = withContext(ark.div, "content");
export type ContentProps = ComponentProps<typeof Content>;

export const Description = withContext(ark.div, "description");
export type DescriptionProps = ComponentProps<typeof Description>;

export const Icon = withContext(ark.svg, "icon");
export type IconProps = ComponentProps<typeof Icon>;

export const Title = withContext(ark.h5, "title");
export type TitleProps = ComponentProps<typeof Title>;
