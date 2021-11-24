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
      <svg v-if="iconComponent" class="message__icon" aria-hidden="true">
        <use :xlink:href="`#icon-${iconComponent}`" />
      </svg>
      <div>
        <p class="message__title">{{ titleText }}</p>
        <slot>
          <p v-if="!dangerouslyUseHTMLString" class="message__content">
            {{ message }}
          </p>
          <!-- Caution here, message could've been compromised, never use user's input as message -->
          <p v-else class="message__content" v-html="message"></p>
        </slot>
      </div>
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
        success: 'system-checkCircleFill',
        info: 'system-infoCircleFill',
        warning: 'system-warningCircleFill',
        error: 'system-closeCircleFill',
      };

      const TitleTextMap = {
        success: '操作成功',
        info: '提示',
        warning: '警告',
        error: '错误',
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

      const titleText = computed(() => {
        return props.title || TitleTextMap[props.type] || '';
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
        titleText,

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
    min-width: 380px;
    padding: 15px 15px 15px 20px;
    line-height: 24px;
    background-color: #edf2fc;
    border-color: #ebeef5;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    transform: translateX(-50%);
    box-sizing: border-box;
    transition: opacity 0.3s, transform 0.4s, top 0.4s;

    .message__title {
      margin-bottom: 8px;
      font-size: 16px;
      color: #000000d9;
    }

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
    display: inline-block;
    width: 24px;
    height: 24px;
    fill: currentColor;
    margin-right: 10px;
    flex-shrink: 0;
    overflow: hidden;
    vertical-align: -0.15em;
  }

  /* stylelint-disable */
  @colors: {
    success: #52c41a;
    info: #3694fd;
    warning: #faad14;
    error: #ff4d4f;
  };

  each(@colors, {
  .message--@{key} {
    background-color: mix(#fff, @value, 95%);
    border-color: mix(#fff, @value, 70%);

    .message__icon {
      color: @value
    }
  }
});
  /* stylelint-enable */

  .message__closeBtn {
    position: absolute;
    top: 22px;
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
