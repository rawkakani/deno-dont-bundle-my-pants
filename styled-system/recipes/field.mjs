import { compact, getSlotCompoundVariant, memo, splitProps } from '../helpers.mjs';
import { createRecipe } from './create-recipe.mjs';

const fieldDefaultVariants = {}
const fieldCompoundVariants = []

const fieldSlotNames = [
  [
    "root",
    "field__root"
  ],
  [
    "label",
    "field__label"
  ],
  [
    "helperText",
    "field__helperText"
  ],
  [
    "errorText",
    "field__errorText"
  ]
]
const fieldSlotFns = /* @__PURE__ */ fieldSlotNames.map(([slotName, slotKey]) => [slotName, createRecipe(slotKey, fieldDefaultVariants, getSlotCompoundVariant(fieldCompoundVariants, slotName))])

const fieldFn = memo((props = {}) => {
  return Object.fromEntries(fieldSlotFns.map(([slotName, slotFn]) => [slotName, slotFn.recipeFn(props)]))
})

const fieldVariantKeys = []
const getVariantProps = (variants) => ({ ...fieldDefaultVariants, ...compact(variants) })

export const field = /* @__PURE__ */ Object.assign(fieldFn, {
  __recipe__: false,
  __name__: 'field',
  raw: (props) => props,
  classNameMap: {},
  variantKeys: fieldVariantKeys,
  variantMap: {},
  splitVariantProps(props) {
    return splitProps(props, fieldVariantKeys)
  },
  getVariantProps
})