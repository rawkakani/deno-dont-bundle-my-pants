// Panda CSS configuration
// Using .js instead of .ts to avoid bundling issues during codegen
export default {
  // Whether to use css reset
  preflight: true,
  
  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./server.tsx"],

  // Files to exclude
  exclude: [],

  // The output directory for your css system
  outdir: "styled-system",
  
  // Enable JSX
  jsxFramework: "react",
  
  // Static CSS output mode for SSR
  emitPackage: true,
  
  // Minify output
  minify: false,
  
  // Recipes (components)
  theme: {
    extend: {
      recipes: {
        button: {
          className: "button",
          description: "A button component",
          base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "medium",
            transition: "colors",
            cursor: "pointer",
            _disabled: {
              opacity: 0.5,
              cursor: "not-allowed",
            },
            _focusVisible: {
              outline: "2px solid",
              outlineColor: "colorPalette.focusRing",
              outlineOffset: "2px",
            },
          },
          variants: {
            variant: {
              solid: {
                bg: "colorPalette.default",
                color: "colorPalette.fg",
                _hover: {
                  bg: "colorPalette.emphasized",
                },
                _active: {
                  bg: "colorPalette.emphasized",
                },
              },
              outline: {
                borderWidth: "1px",
                borderColor: "colorPalette.default",
                color: "colorPalette.fg",
                _hover: {
                  bg: "colorPalette.subtle",
                },
              },
              ghost: {
                color: "colorPalette.fg",
                _hover: {
                  bg: "colorPalette.subtle",
                },
              },
              link: {
                color: "colorPalette.fg",
                textDecoration: "underline",
                _hover: {
                  color: "colorPalette.emphasized",
                },
              },
            },
            size: {
              xs: { h: "8", px: "3", textStyle: "xs" },
              sm: { h: "9", px: "3.5", textStyle: "sm" },
              md: { h: "10", px: "4", textStyle: "sm" },
              lg: { h: "11", px: "4.5", textStyle: "base" },
              xl: { h: "12", px: "5", textStyle: "base" },
              "2xl": { h: "14", px: "6", textStyle: "lg" },
            },
          },
          defaultVariants: {
            variant: "solid",
            size: "md",
          },
        },
        spinner: {
          className: "spinner",
          description: "A spinner component",
          base: {
            display: "inline-block",
            borderRadius: "full",
            borderWidth: "2px",
            borderStyle: "solid",
            borderTopColor: "currentColor",
            animation: "spin",
            width: "1em",
            height: "1em",
          },
          variants: {
            size: {
              xs: { width: "0.75em", height: "0.75em", borderWidth: "1.5px" },
              sm: { width: "1em", height: "1em", borderWidth: "2px" },
              md: { width: "1.5em", height: "1.5em", borderWidth: "2px" },
              lg: { width: "2em", height: "2em", borderWidth: "2.5px" },
              xl: { width: "3em", height: "3em", borderWidth: "3px" },
            },
          },
          defaultVariants: {
            size: "md",
          },
        },
        pulseLoader: {
          className: "pulse-loader",
          description: "A pulsing loader component",
          base: {
            borderRadius: "full",
            bg: "colorPalette.default",
            animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          },
          variants: {
            size: {
              xs: { width: "6", height: "6" },
              sm: { width: "8", height: "8" },
              md: { width: "10", height: "10" },
              lg: { width: "12", height: "12" },
              xl: { width: "16", height: "16" },
            },
          },
          defaultVariants: {
            size: "lg",
          },
        },
        input: {
          className: "input",
          description: "An input component",
          base: {
            width: "100%",
            display: "flex",
            height: "10",
            minW: "0",
            appearance: "none",
            borderRadius: "l2",
            borderWidth: "1px",
            borderColor: "border.emphasized",
            bg: "bg.surface",
            px: "3.5",
            fontSize: "sm",
            _focus: {
              outline: "none",
              borderColor: "colorPalette.focusRing",
              boxShadow: "0 0 0 1px var(--colors-color-palette-focus-ring)",
            },
            _disabled: {
              opacity: 0.5,
              cursor: "not-allowed",
            },
          },
        },
        field: {
          className: "field",
          description: "A field component",
          slots: ["root", "label", "helperText", "errorText"],
          base: {
            root: {
              display: "flex",
              flexDirection: "column",
              gap: "1.5",
            },
            label: {
              fontSize: "sm",
              fontWeight: "medium",
              color: "fg.default",
            },
            helperText: {
              fontSize: "xs",
              color: "fg.muted",
            },
            errorText: {
              fontSize: "xs",
              color: "fg.error",
            },
          },
        },
        card: {
          className: "card",
          description: "A card component",
          slots: ["root", "header", "body", "footer", "title", "description"],
          base: {
            root: {
              display: "flex",
              flexDirection: "column",
              borderRadius: "l3",
              borderWidth: "1px",
              borderColor: "border.emphasized",
              bg: "bg.surface",
              overflow: "hidden",
            },
            header: {
              display: "flex",
              flexDirection: "column",
              gap: "1",
              px: "6",
              py: "5",
            },
            body: {
              display: "flex",
              flexDirection: "column",
              px: "6",
              py: "5",
            },
            footer: {
              display: "flex",
              alignItems: "center",
              gap: "2",
              px: "6",
              py: "4",
              borderTopWidth: "1px",
              borderTopColor: "border.emphasized",
            },
            title: {
              fontSize: "lg",
              fontWeight: "semibold",
              color: "fg.default",
            },
            description: {
              fontSize: "sm",
              color: "fg.muted",
            },
          },
        },
        alert: {
          className: "alert",
          description: "An alert component",
          slots: ["root", "title", "description", "icon"],
          base: {
            root: {
              display: "flex",
              gap: "3",
              borderRadius: "l2",
              borderWidth: "1px",
              px: "4",
              py: "3",
            },
            title: {
              fontWeight: "semibold",
              fontSize: "sm",
              color: "fg.default",
            },
            description: {
              fontSize: "sm",
              color: "fg.muted",
            },
            icon: {
              flexShrink: 0,
            },
          },
          variants: {
            status: {
              info: {
                root: { bg: "bg.info.subtle", borderColor: "border.info", color: "fg.info" },
              },
              success: {
                root: { bg: "bg.success.subtle", borderColor: "border.success", color: "fg.success" },
              },
              warning: {
                root: { bg: "bg.warning.subtle", borderColor: "border.warning", color: "fg.warning" },
              },
              error: {
                root: { bg: "bg.error.subtle", borderColor: "border.error", color: "fg.error" },
              },
            },
          },
          defaultVariants: {
            status: "info",
          },
        },
        text: {
          className: "text",
          description: "A text component",
          base: {
            color: "fg.default",
          },
          variants: {
            variant: {
              body: {
                fontSize: "base",
              },
              caption: {
                fontSize: "sm",
                color: "fg.muted",
              },
              heading: {
                fontSize: "2xl",
                fontWeight: "bold",
                lineHeight: "tight",
              },
            },
            size: {
              xs: { fontSize: "xs" },
              sm: { fontSize: "sm" },
              md: { fontSize: "base" },
              lg: { fontSize: "lg" },
              xl: { fontSize: "xl" },
              "2xl": { fontSize: "2xl" },
              "3xl": { fontSize: "3xl" },
              "4xl": { fontSize: "4xl" },
              "5xl": { fontSize: "5xl" },
              "6xl": { fontSize: "6xl" },
              "7xl": { fontSize: "7xl" },
            },
          },
          defaultVariants: {
            variant: "body",
            size: "md",
          },
        },
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: 0.8, transform: "scale(1)" },
          "50%": { opacity: 0.4, transform: "scale(1.1)" },
        },
      },
    },
  },
};