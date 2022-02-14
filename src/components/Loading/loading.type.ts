import type { Ref, VNode } from 'vue';

export type ILoadingOptions = {
  parent?: ILoadingParentElement | null;
  background?: string;
  svg?: string | null;
  svgViewBox?: string | null;
  spinner?: boolean | string;
  text?: string | null;
  fullscreen?: boolean;
  body?: boolean;
  lock?: boolean;
  customClass?: string;
  visible?: boolean;
  target?: string | HTMLElement;
};

export type ILoadingInstance = {
  parent?: Ref<ILoadingParentElement>;
  background?: Ref<string>;
  spinner?: Ref<boolean | string>;
  text?: Ref<string>;
  fullscreen?: Ref<boolean>;
  body?: Ref<boolean>;
  lock?: Ref<boolean>;
  customClass?: Ref<string>;
  visible?: Ref<boolean>;
  target?: Ref<string | HTMLElement>;
  originalPosition?: Ref<string>;
  originalOverflow?: Ref<string>;
  setText: (text: string) => void;
  close: () => void;
  handleAfterLeave: () => void;
  vm: VNode;
  $el: HTMLElement;
};

export type ILoadingGlobalConfig = {
  fullscreenLoading: ILoadingInstance | undefined;
};

export type ILoadingCreateComponentParams = {
  options: ILoadingOptions;
  globalLoadingOption: ILoadingGlobalConfig;
};

export interface ILoadingParentElement extends HTMLElement {
  vLoadingAddClassList?: () => void;
}
