<template>
  <transition name="message-fade" @before-leave="onClose" @after-leave="$emit('destroy')">
    <div
      v-show="visible"
      :id="id"
      :class="[
        'message',
        type && !icon ? `message--${type}` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass,
      ]"
      :style="customStyle"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <i class="message__icon" :class="iconComponent" />
      <slot>
        <p class="message__content">
          {{ message }}
        </p>
      </slot>
      <i v-if="showClose" class="message__closeBtn dx-icon-close" @click.stop="close" />
    </div>
  </transition>
</template>

<script lang="ts">
  import type { CSSProperties } from 'vue';

  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { useEventListener, useTimeoutFn } from '@vueuse/core';

  import { messageProps } from './message';

  export default defineComponent({
    props: messageProps,
    emits: {
      destroy: () => true,
    },
    setup(props) {
      const TypeComponentsMap = {
        success: 'dx-icon-check',
        info: 'dx-icon-info',
        warning: 'dx-icon-warning',
        error: 'dx-icon-clear',
      };

      const visible = ref(false);

      let stopTimer: (() => void) | undefined = undefined;

      const typeClass = computed(() => {
        const type = props.type;
        return type ? `message-icon--${type}` : '';
      });

      const iconComponent = computed(() => {
        return props.icon || TypeComponentsMap[props.type] || '';
      });

      const customStyle = computed<CSSProperties>(() => ({
        top: `${props.offset}px`,
        zIndex: props.zIndex,
      }));

      function startTimer() {
        if (props.duration > 0) {
          ({ stop: stopTimer } = useTimeoutFn(() => {
            if (visible.value) close();
          }, props.duration));
        }
      }

      function clearTimer() {
        stopTimer?.();
      }

      function close() {
        visible.value = false;
      }

      function keydown({ code }: KeyboardEvent) {
        if (code === 'Escape') {
          // press esc to close the message
          if (visible.value) {
            close();
          }
        } else {
          startTimer(); // resume timer
        }
      }

      onMounted(() => {
        startTimer();
        visible.value = true;
      });

      useEventListener(document, 'keydown', keydown);

      return {
        visible,
        customStyle,
        typeClass,
        iconComponent,

        close,
        startTimer,
        clearTimer,
      };
    },
  });
</script>

<style lang="less" scoped>
  .message {
    position: fixed;
    top: 20px;
    left: 50%;
    display: flex;
    align-items: center;
    min-width: 380px;
    padding: 15px 15px 15px 20px;
    background-color: #edf2fc;
    border-color: #ebeef5;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    transform: translateX(-50%);
    box-sizing: border-box;
    transition: opacity 0.3s, transform 0.4s, top 0.4s;

    .message__content {
      padding: 0;
      font-size: 14px;
      line-height: 1;
      &:focus {
        outline-width: 0;
      }
    }

    &.is-center {
      justify-content: center;
    }

    &.is-closable {
      .message__content {
        padding-right: 16px;
      }
    }

    p {
      margin: 0;
    }
  }

  .message__icon {
    margin-right: 10px;
    font-size: 14px;
  }

  /* stylelint-disable */
  @colors: {
    success: #67c23a;
    info: #909399;
    warning: #e6a23c;
    error: #f56c6c;
  };

  each(@colors, {
  .message--@{key} {
    color: @value;
    background-color: mix(#fff, @value, 90%);
    border-color: mix(#fff, @value, 80%);
    .message__content {
      color: @value;
    }
  }
});
  /* stylelint-enable */

  .message__closeBtn {
    position: absolute;
    top: 50%;
    right: 15px;
    font-size: 14px;
    color: #c0c4cc;
    cursor: pointer;
    transform: translateY(-50%);

    &:focus {
      outline-width: 0;
    }
    &:hover {
      color: #909399;
    }
  }

  .message-fade-enter-from,
  .message-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -100%);
  }
</style>
