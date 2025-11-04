/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface PulseLoaderVariant {
  /**
 * @default "lg"
 */
size: "xs" | "sm" | "md" | "lg" | "xl"
}

type PulseLoaderVariantMap = {
  [key in keyof PulseLoaderVariant]: Array<PulseLoaderVariant[key]>
}



export type PulseLoaderVariantProps = {
  [key in keyof PulseLoaderVariant]?: ConditionalValue<PulseLoaderVariant[key]> | undefined
}

export interface PulseLoaderRecipe {
  
  __type: PulseLoaderVariantProps
  (props?: PulseLoaderVariantProps): string
  raw: (props?: PulseLoaderVariantProps) => PulseLoaderVariantProps
  variantMap: PulseLoaderVariantMap
  variantKeys: Array<keyof PulseLoaderVariant>
  splitVariantProps<Props extends PulseLoaderVariantProps>(props: Props): [PulseLoaderVariantProps, Pretty<DistributiveOmit<Props, keyof PulseLoaderVariantProps>>]
  getVariantProps: (props?: PulseLoaderVariantProps) => PulseLoaderVariantProps
}

/**
 * A pulsing loader component
 */
export declare const pulseLoader: PulseLoaderRecipe