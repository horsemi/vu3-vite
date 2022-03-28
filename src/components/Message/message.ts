import { buildProps, definePropType } from '/@/utils/props';

import type { VNode, ExtractPropTypes, Component } from 'vue';

export const messageTypes = ['success', 'info', 'warning', 'error'] as const;

export const messageProps = buildProps({
  customClass: {
    type: String,
    default: '',
  },
  center: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 3000,
  },
  icon: {
    type: definePropType<string | Component>([String, Object]),
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: definePropType<string | VNode>([String, Object]),
    default: '',
  },
  onClose: {
    type: definePropType<() => void>(Function),
    required: false,
  },
  showClose: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    values: messageTypes,
    default: 'info',
  },
  offset: {
    type: Number,
    default: 20,
  },
  zIndex: {
    type: Number,
    default: 0,
  },
  dangerouslyUseHTMLString: {
    type: Boolean,
    default: false,
  },
} as const);
export type MessageProps = ExtractPropTypes<typeof messageProps>;

export type MessageOptions = Omit<MessageProps, 'id'> & {
  appendTo?: HTMLElement | string;
};
export type MessageOptionsTyped = Omit<MessageOptions, 'type'>;

export interface MessageHandle {
  close: () => void;
}

export type MessageParams = Partial<MessageOptions> | string | VNode;
export type MessageParamsTyped = Partial<MessageOptionsTyped> | string | VNode;

export type MessageFn = ((options?: MessageParams) => MessageHandle) & {
  closeAll(): void;
};
export type MessageTypedFn = (options?: MessageParamsTyped) => MessageHandle;

export interface Message extends MessageFn {
  success: MessageTypedFn;
  warning: MessageTypedFn;
  info: MessageTypedFn;
  error: MessageTypedFn;
}

type MessageQueueItem = {
  vm: VNode;
};

export type MessageQueue = MessageQueueItem[];