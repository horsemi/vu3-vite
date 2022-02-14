import type { HubConnection } from '@microsoft/signalr';

import * as signalR from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { useUserStoreWidthOut } from '/@/store/modules/user';

// 发起连接的地址
const connect_url = '/hubs/account';

interface IWebsocket {
  state: string;

  /**
   * @description 打开连接 - 初始化连接
   */
  openConnect(): void;

  /**
   * @description 开始连接
   */
  startConnect(onSuccess?: () => void, onError?: (err: any) => void): void;

  /**
   * @description 接受消息
   */
  receiveMessages(callback: (res: any) => void): void;

  /**
   * @description 发送消息
   */
  sendMessage(
    methodName: string,
    message: any,
    onSuccess?: (res: any) => void,
    onError?: (err: any) => void
  ): void;

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
  closeConnect(onSuccess?: (res: any) => void, onError?: (err: any) => void): void;

  /**
   * @description 关闭连接触发回调
   */
  onclose(callback: (error?: Error | undefined) => void): void;
}

class Websocket implements IWebsocket {
  private connection: HubConnection | undefined;

  private async start(onSuccess?: () => void, onError?: (err: any) => void) {
    if (this.connection) {
      try {
        await this.connection.start();
        onSuccess && onSuccess();
      } catch (err) {
        onError && onError(err);
      }
    }
  }

  /**
   * @description 当前连接的状态 - Connected | Disconnected | Reconnecting | Uninitialized
   */
  get state() {
    return this.connection ? this.connection.state : 'Uninitialized';
  }

  public openConnect() {
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
  }

  public startConnect(onSuccess?: () => void, onError?: (err: any) => void) {
    this.start(onSuccess, onError);
  }

  public receiveMessages(callback: (res: any) => void) {
    this.connection &&
      this.connection.on('ServerNotify', (res) => {
        const message = { ...res };
        if (message.data) {
          message.data = JSON.parse(message.data);
        }
        callback(message);
      });
  }

  public sendMessage(
    methodName: string,
    message: any,
    onSuccess?: (res: any) => void,
    onError?: (err: any) => void
  ) {
    this.connection &&
      this.connection
        .send(methodName, message)
        .then((res) => {
          if (onSuccess) {
            onSuccess(res);
          }
        })
        .catch((err) => {
          if (onError) {
            onError(err);
          }
        });
  }

  public onReconnecting(callback: (error?: Error | undefined) => void) {
    this.connection && this.connection.onreconnecting(callback);
  }

  public onReconnected(callback: (connectionId?: string | undefined) => void) {
    this.connection && this.connection.onreconnected(callback);
  }

  public closeConnect(onSuccess?: (res: any) => void, onError?: (err: any) => void) {
    this.connection &&
      this.connection
        .stop()
        .then((res) => {
          if (onSuccess) {
            onSuccess(res);
          }
        })
        .catch((err) => {
          if (onError) {
            onError(err);
          }
        });
  }

  public onclose(callback: (error?: Error | undefined) => void) {
    this.connection && this.connection.onclose(callback);
  }
}

const websocketService = new Websocket();
export default websocketService;
