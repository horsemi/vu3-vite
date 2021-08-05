<template>
  <DxToast
    type="custom"
    :position="{ at: 'top center', my: 'top center', offset: '0 50' }"
    content-template="contentTemplate"
    :display-time="displayTime"
    width="500"
    @initialized="onInitialized"
    @hidden="hiddenHandle"
  >
    <template #contentTemplate>
      <div :class="prefixCls">
        <div :class="type" class="toast-box__container">
          <span class="toast-icon__wrap">
            <SvgIcon :color="svgColor" :size="24" :name="svgName"></SvgIcon>
          </span>
          <div class="toast-message__wrap">
            <div class="toast-title__wrap">{{ message }}</div>
            <div class="toast-content__wrap">{{ description }}</div>
          </div>
        </div>
      </div>
    </template>
  </DxToast>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';

  import { DxToast } from 'devextreme-vue/toast';

  import { useDesign } from '/@/hooks/web/useDesign';
  import SvgIcon from '/@/components/Icon/SvgIcon.vue';

  export default defineComponent({
    name: 'Toast',
    components: {
      DxToast,
      SvgIcon,
    },
    props: {
      type: {
        type: String,
        default: 'success',
      },
      message: {
        type: String,
        default: '操作成功!',
      },
      description: {
        type: String,
        default: '',
      },
    },
    emits: ['update:description'],
    setup(props, ctx) {
      const { prefixCls } = useDesign('toast');

      const toast = ref();
      const svgName = ref('');
      const svgColor = ref('');
      const displayTime = ref(3000);

      watch(
        () => props.type,
        (value) => {
          switch (value) {
            case 'success': {
              svgColor.value = '#52c41a';
              svgName.value = 'system-checkCircleFill';
              displayTime.value = 3000;
              break;
            }
            case 'info': {
              svgColor.value = '#3694fd';
              svgName.value = 'system-infoCircleFill';
              displayTime.value = 3000;
              break;
            }
            case 'warning': {
              svgColor.value = '#faad14';
              svgName.value = 'system-warningCircleFill';
              displayTime.value = 5000;
              break;
            }
            case 'error': {
              svgColor.value = '#ff4d4f';
              svgName.value = 'system-closeCircleFill';
              displayTime.value = 5000;
              break;
            }
          }
        },
        {
          immediate: true,
        }
      );

      function showToast() {
        toast.value.hide();
        toast.value.show();
      }

      function onInitialized(e) {
        toast.value = e.component;
      }

      function hiddenHandle() {
        ctx.emit('update:description', null);
      }

      return {
        prefixCls,
        svgName,
        svgColor,
        displayTime,
        hiddenHandle,
        onInitialized,
        showToast,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-toast';

  .@{prefix-cls} {
    .success {
      background-color: #f6ffed;
      border: 1px solid #b7eb8f;
    }

    .info {
      background-color: #e8f7ff;
      border: 1px solid #91d5ff;
    }

    .warning {
      background-color: #fffbe6;
      border: 1px solid #ffe58f;
    }

    .error {
      background-color: #fff2f0;
      border: 1px solid #ffccc7;
    }

    .toast-box__container {
      position: relative;
      display: flex;
      padding: 8px 15px;
      line-height: 24px;
      color: #000000d9;
      word-wrap: break-word;
      .toast-icon__wrap {
        display: inline-block;
        margin-right: 15px;
      }

      .toast-message__wrap {
        flex: 1;
        min-width: 0;
        font-weight: normal;

        .toast-title__wrap {
          margin-bottom: 4px;
          font-size: 16px;
        }

        .toast-content__wrap {
          width: 100%;
          font-size: 14px;
        }
      }
    }
  }
</style>
