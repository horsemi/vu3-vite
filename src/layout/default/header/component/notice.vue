<template>
  <div :class="prefixCls" @click="showNotice = true">
    <SvgIcon id="noticeIcon" size="24" name="notice"></SvgIcon>
    <DxPopover
      ref="noticePopover"
      v-model:visible="showNotice"
      target="#noticeIcon"
      position="bottom"
      width="360px"
    >
      <div v-loading="loading">
        <div v-if="!noticeList.length" :class="`${prefixCls}--empty`">
          <img src="http://cdn.uviewui.com/uview/empty/message.png" />
          <div>消息列表为空</div>
        </div>
        <div v-else>
          <div :class="`${prefixCls}--tips`">最近消息</div>
          <div v-for="(item, index) in noticeList" :key="index">
            <div>
              <span :class="`${prefixCls}--module`">
                {{
                  item.module && noticeModuleMap[item.module] && noticeModuleMap[item.module].name
                }}
              </span>
              <span :class="`${prefixCls}--time`">{{ item.createdTime }}</span>
            </div>
            <div :class="`${prefixCls}--message`" @click="onGoPage(item.module)">
              <i :class="noticeModuleMap[item.module].icon" />
              <span>{{ item.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </DxPopover>
    <span v-if="showNoticeBadge" :class="`${prefixCls}-notice-num__wrapper`"></span>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { DxPopover } from 'devextreme-vue/popover';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import { UserApi } from '/@/api/user';
  import websocketService from '/@/utils/websocket/index';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    components: {
      DxPopover,
    },
    setup() {
      const { prefixCls } = useDesign('header-notice');
      const userStore = useUserStore();
      const router = useRouter();

      const noticeModuleMap = {
        Exportation: {
          name: '导出任务',
          routerName: 'ExportList',
          icon: 'dx-icon-download',
        },
      };

      const loading = ref(true);
      const showNotice = ref(false);
      const noticeList = ref<{ module: string; message: string; createdTime: string }[]>([]);
      const showNoticeBadge = computed(() => {
        return userStore.getShowNoticeBadge;
      });

      function getNoticeList() {
        UserApi.getNoticeList({
          Application: 'OdsApi',
          PageIndex: 1,
          PageSize: 10,
        })
          .then((res) => {
            noticeList.value = res.list;
            loading.value = false;
          })
          .catch(() => {
            loading.value = false;
          });
      }

      function handleExportMessage() {
        websocketService.receiveMessages((res) => {
          if (res && res.event === 'ExportStatusUpdate') {
            const {
              data: { message },
              module,
            } = res;
            if (message && module) {
              if (showNoticeBadge.value) {
                userStore.setShowNoticeBadge(true);
              }
              getNoticeList();
            }
          }
        });
      }

      function onGoPage(module: string) {
        const name = noticeModuleMap[module]?.routerName;
        name &&
          router.push({
            name,
          });
      }

      handleExportMessage();
      getNoticeList();

      return {
        prefixCls,
        loading,
        showNotice,
        noticeModuleMap,
        noticeList,
        showNoticeBadge,
        onGoPage,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-notice';

  .@{prefix-cls} {
    position: relative;
    cursor: pointer;

    &-notice-num__wrapper {
      position: absolute;
      top: -5px;
      right: -5px;
      display: inline-block;
      width: 8px;
      height: 8px;
      font-size: 12px;
      color: #fff;
      text-align: center;
      white-space: nowrap;
      background-color: #f56c6c;
      border: 1px solid #fff;
      border-radius: 50%;
    }

    &--empty {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 200px;
        height: 200px;
      }

      > div {
        margin-bottom: 20px;
        color: rgb(192, 196, 204);
        text-align: center;
      }
    }
    &--tips {
      padding-bottom: 10px;
      color: #8f9ca2;
      text-align: center;
    }
    &--module {
      margin-right: 4px;
      font-size: 14px;
    }
    &--time {
      color: #8f9ca2;
    }
    &--message {
      display: flex;
      align-items: center;
      padding: 4px 0 20px 0;
      color: #337ab7;
      cursor: pointer;

      i {
        margin-right: 4px;
        font-size: 18px;
      }
    }
  }
</style>
