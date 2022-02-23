import type { HubConnection } from '@microsoft/signalr';

import * as signalR from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { useUserStoreWidthOut } from '/@/store/modules/user';

// 发起连接的地址
const connect_url = '/hubs/account';

interface ISingleWebsocket {
  state: string;

  /**
   * @description 打开连接 - 初始化连接
   */
  openConnect(options?: { success?: () => void; fail?: (err: any) => void }): void;

  /**
   * @description 接受消息
   */
  receiveMessages({
    success,
    fail,
  }: {
    success: (res: any) => void;
    fail?: (err: any) => void;
  }): void;

  /**
   * @description 发送消息
   */
  sendMessage({
    methodName,
    message,
    success,
    fail,
  }: {
    methodName: string;
    message: any;
    success?: (res: any) => void;
    fail?: (err: any) => void;
  }): void;

  /**
   * @description 重新连接前回调
   */
  onReconnecting(callback?: (error: Error) => void): void;

  /**
   * @description 重新连接后回调
   */
  onReconnected(callback?: (connectionId: string) => void): void;

  /**
   * @description 关闭连接
   */
  closeConnect(options?: { success?: (res: any) => void; fail?: (err: any) => void }): void;

  /**
   * @description 关闭连接触发回调
   */
  onclose(callback: (error?: Error | undefined) => void): void;
}

class SingleWebsocket implements ISingleWebsocket {
  private connection: HubConnection | undefined;

  private sendRetryCount = 0;

  /**
   * @description 当前连接的状态 - Connected | Connecting | Disconnected | Disconnected | Reconnecting | Uninitialized
   */
  get state() {
    return this.connection ? this.connection.state : 'Uninitialized';
  }

  public async openConnect(options?: { success?: () => void; fail?: (err: any) => void }) {
    const userStore = useUserStoreWidthOut();
    const token = userStore.getToken;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(connect_url, {
        headers: { access_token: token },
        transport: signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 30000])
      .withHubProtocol(new MessagePackHubProtocol())
      .build();
    try {
      await this.connection.start();
      this.connection.invoke('InitializeConnection', { application: 'OdsApi' });
      options?.success && options.success();
    } catch (err) {
      options?.fail && options.fail(err);
    }
  }

  public receiveMessages({
    success,
    fail,
  }: {
    success: (res: any) => void;
    fail?: (err: any) => void;
  }) {
    if (this.connection && ['Connected', 'Connecting', 'Reconnecting'].includes(this.state)) {
      this.connection.on('ServerNotify', (res) => {
        const message = { ...res };
        if (message.data) {
          message.data = JSON.parse(message.data);
        }
        success(message);
      });
    } else {
      fail && fail('SingleWebsocket未初始化或已断开');
    }
  }

  public sendMessage({
    methodName,
    message,
    success,
    fail,
  }: {
    methodName: string;
    message: any;
    success?: (res: any) => void;
    fail?: (err: any) => void;
  }) {
    if (this.connection && this.state === 'Connected') {
      // 已连接成功，可以发送消息
      this.sendRetryCount = 0;
      this.connection
        .send(methodName, message)
        .then((res) => {
          if (success) {
            success(res);
          }
        })
        .catch((err) => {
          if (fail) {
            fail(err);
          }
        });
    } else if (
      this.connection &&
      ['Connecting', 'Reconnecting'].includes(this.state) &&
      this.sendRetryCount < 10
    ) {
      // 连接中或重连中，定时重复调用自身，等待连接成功发送消息，最多重复10次
      this.sendRetryCount++;
      setTimeout(() => {
        this.sendMessage({ methodName, message, success, fail });
      }, this.sendRetryCount * 500);
    } else {
      // 状态为Disconnected或Uninitialized
      fail && fail('SingleWebsocket未初始化或已断开');
    }
  }

  public onReconnecting(callback: (error?: Error | undefined) => void) {
    this.connection && this.connection.onreconnecting(callback);
  }

  public onReconnected(callback: (connectionId?: string | undefined) => void) {
    this.connection && this.connection.onreconnected(callback);
  }

  public closeConnect(options?: { success?: (res: any) => void; fail?: (err: any) => void }) {
    this.connection &&
      this.connection
        .stop()
        .then((res) => {
          options?.success && options?.success(res);
        })
        .catch((err) => {
          options?.fail && options?.fail(err);
        });
  }

  public onclose(callback: (error?: Error | undefined) => void) {
    this.connection && this.connection.onclose(callback);
  }
}

const websocketService = new SingleWebsocket();
export default websocketService;
