import { memo, splitProps } from '../helpers.mjs';
import { createRecipe, mergeRecipes } from './create-recipe.mjs';

const pulseLoaderFn = /* @__PURE__ */ createRecipe('pulse-loader', {
  "size": "lg"
}, [])

const pulseLoaderVariantMap = {
  "size": [
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
  ]
}

const pulseLoaderVariantKeys = Object.keys(pulseLoaderVariantMap)

export const pulseLoader = /* @__PURE__ */ Object.assign(memo(pulseLoaderFn.recipeFn), {
  __recipe__: true,
  __name__: 'pulseLoader',
  __getCompoundVariantCss__: pulseLoaderFn.__getCompoundVariantCss__,
  raw: (props) => props,
  variantKeys: pulseLoaderVariantKeys,
  variantMap: pulseLoaderVariantMap,
  merge(recipe) {
    return mergeRecipes(this, recipe)
  },
  splitVariantProps(props) {
    return splitProps(props, pulseLoaderVariantKeys)
  },
  getVariantProps: pulseLoaderFn.getVariantProps,
})