/* eslint-disable */
import type { ConditionalValue } from '../types/index';
import type { DistributiveOmit, Pretty } from '../types/system-types';

interface AlertVariant {
  /**
 * @default "info"
 */
status: "info" | "success" | "warning" | "error"
}

type AlertVariantMap = {
  [key in keyof AlertVariant]: Array<AlertVariant[key]>
}

type AlertSlot = "root" | "title" | "description" | "icon"

export type AlertVariantProps = {
  [key in keyof AlertVariant]?: ConditionalValue<AlertVariant[key]> | undefined
}

export interface AlertRecipe {
  __slot: AlertSlot
  __type: AlertVariantProps
  (props?: AlertVariantProps): Pretty<Record<AlertSlot, string>>
  raw: (props?: AlertVariantProps) => AlertVariantProps
  variantMap: AlertVariantMap
  variantKeys: Array<keyof AlertVariant>
  splitVariantProps<Props extends AlertVariantProps>(props: Props): [AlertVariantProps, Pretty<DistributiveOmit<Props, keyof AlertVariantProps>>]
  getVariantProps: (props?: AlertVariantProps) => AlertVariantProps
}

/**
 * An alert component
 */
export declare const alert: AlertRecipe