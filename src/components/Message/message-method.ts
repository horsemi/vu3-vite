import type { ComponentPublicInstance } from 'vue';
import type { Message, MessageFn, MessageQueue, MessageProps } from './message';

import { isVNode, createVNode, render } from 'vue';

import MessageConstructor from './message.vue';
import { messageTypes } from './message';

const instances: MessageQueue = [];
let seed = 1;

const message: MessageFn & Partial<Message> = function (options: any = {}) {
  if (window === undefined) {
    return {
      close: () => undefined,
    };
  }

  if (
    !isVNode(options) &&
    typeof options === 'object' &&
    options.grouping &&
    !isVNode(options.message) &&
    instances.length
  ) {
    const tempVm: any = instances.find(
      (item) => `${item.vm.props?.message ?? ''}` === `${options.message ?? ''}`
    );

    if (tempVm) {
      tempVm.vm.component.props.repeatNum += 1;
      tempVm.vm.component.props.type = options?.type;

      return {
        close: () =>
          ((vm.component!.proxy as ComponentPublicInstance<{ visible: boolean }>).visible = false),
      };
    }
  }

  if (typeof options === 'string' || isVNode(options)) {
    options = { message: options };
  }

  let verticalOffset = options.offset || 20;
  instances.forEach(({ vm }) => {
    verticalOffset += (vm.el?.offsetHeight || 0) + 16;
  });
  verticalOffset += 16;

  const id = `message_${seed++}`;
  const userOnClose = options.onClose;

  const props: Partial<MessageProps> = {
    zIndex: 1000, // PopupManager.nextZIndex()
    offset: verticalOffset,
    ...options,
    id,
    onClose: () => {
      close(id, userOnClose);
    },
  };

  let appendTo = document.body;
  if (options.appendTo instanceof HTMLElement) {
    appendTo = options.appendTo;
  } else if (typeof options.appendTo === 'string') {
    appendTo = document.querySelector(options.appendTo);
  }

  if (!(appendTo instanceof HTMLElement)) {
    appendTo = document.body;
  }

  const container = document.createElement('div');

  container.className = `container_${id}`;

  const message = props.message;
  const vm = createVNode(
    MessageConstructor,
    props,
    isVNode(props.message) ? { default: () => message } : null
  );

  vm.props!.onDestroy = () => {
    render(null, container);
  };

  render(vm, container);

  instances.push({ vm });
  appendTo.appendChild(container.firstElementChild!);

  return {
    // instead of calling the onClose function directly, setting this value so that we can have the full lifecycle
    // for out component, so that all closing steps will not be skipped.
    close: () =>
      ((vm.component!.proxy as ComponentPublicInstance<{ visible: boolean }>).visible = false),
  };
};

messageTypes.forEach((type) => {
  message[type] = (options = {}) => {
    if (typeof options === 'string' || isVNode(options)) {
      options = {
        message: options,
      };
    }
    return message({
      ...options,
      type,
    });
  };
});

export function close(id, userOnClose) {
  const idx = instances.findIndex(({ vm }) => id === vm.component!.props.id);
  if (idx === -1) return;

  const { vm } = instances[idx];
  if (!vm) return;
  userOnClose?.(vm);

  const removedHeight = vm.el!.offsetHeight;
  instances.splice(idx, 1);

  // adjust other instances vertical offset
  const len = instances.length;
  if (len < 1) return;
  for (let i = idx; i < len; i++) {
    const pos = parseInt(instances[i].vm.el!.style['top'], 10) - removedHeight - 16;

    instances[i].vm.component!.props.offset = pos;
  }
}

export function closeAll() {
  for (let i = instances.length - 1; i >= 0; i--) {
    const instance = instances[i].vm.component;
    (instance?.proxy as any)?.close();
  }
}

message.closeAll = closeAll;

export default message;
