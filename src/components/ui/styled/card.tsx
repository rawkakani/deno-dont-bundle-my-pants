import { ark } from "@ark-ui/react/factory";
import { card } from "styled-system/recipes";
import type { ComponentProps } from "styled-system/types";
import { createStyleContext } from "styled-system/jsx";

const { withProvider, withContext } = createStyleContext(card);

export const Root = withProvider(ark.div, "root");
export type RootProps = ComponentProps<typeof Root>;

export const Body = withContext(ark.div, "body");
export type BodyProps = ComponentProps<typeof Body>;

export const Description = withContext(ark.div, "description");
export type DescriptionProps = ComponentProps<typeof Description>;

export const Footer = withContext(ark.div, "footer");
export type FooterProps = ComponentProps<typeof Footer>;

export const Header = withContext(ark.div, "header");
export type HeaderProps = ComponentProps<typeof Header>;

export const Title = withContext(ark.h3, "title");
export type TitleProps = ComponentProps<typeof Title>;
