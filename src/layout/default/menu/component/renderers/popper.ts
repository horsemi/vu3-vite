import type { VNode } from 'vue';

import { h, withDirectives, Transition, withCtx, vShow } from 'vue';

export default function renderPopper(props, children: VNode[]) {
  const { visibility } = props;

  return h(
    'div',
    {
      class: 'menu-popper__container-animation',
    },
    h(
      Transition,
      {
        name: 'zoom-in-left',
      },
      {
        default: withCtx(() => [
          withDirectives(
            h(
              'div',
              {
                ref: 'popperRef',
              },
              children
            ),
            [[vShow, visibility]]
          ),
        ]),
      }
    )
  );
}
