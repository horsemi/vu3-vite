import type { Plugin } from 'vue';

import Message from './message-method';

type SFCWithInstall<T> = T & Plugin;

const withInstallFunction = <T>(fn: T, name: string) => {
  (fn as SFCWithInstall<T>).install = (app) => {
    app.config.globalProperties[name] = fn;
  };

  return fn as SFCWithInstall<T>;
};

export const message = withInstallFunction(Message, '$message');
export default message;

/* 
使用方式：

按需使用：
import { message } from '/@/components/Message/index';

message({
  type: 'warning',
  message: '恭喜你，这是一条成功消息',
  duration: 0,
  showClose: true
});

全局使用：
main主入口文件写入
import message from '/@/components/Message/index';
app.use(message);

this.$message({
  type: 'warning',
  message: '恭喜你，这是一条成功消息',
  duration: 0,
  showClose: true
}); 
*/
