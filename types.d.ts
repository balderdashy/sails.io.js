declare namespace SailsIOJS {
    export interface ISDKInfo {
        version?: string;
        language?: string;
        platform?: "browser" | "node";
        versionString?: string;

    }
    export interface IClientSails {
        url?: string;
        autoConnect?: boolean;
        headers?: { [index: string]: string };
        transports?: Array<"websocket" | "polling">;
        rejectUnauthorized?: boolean;
        reconnection?: boolean;
        reconnectionAttempts?: number;
        reconnectionDelay?: number;
        reconnectionDelayMax?: number;
        useCORSRouteToGetCookie?: boolean;
        query?: string;
        path?: string;
        multiplex?;
        randomizationFactor?;
        // All logs are disabled when `io.sails.environment = 'production'`
        environment?: "production" | string;
        connect?(url?: string, config?: IConnectConfig): ISocket;
        initialConnectionHeaders?: IInitialConnectionHeaders;
        timeout?;
        strict?: boolean;
        sdk?: ISDKInfo;
    }
    export interface IConnectConfig {
        initialConnectionHeaders?: IInitialConnectionHeaders
    }
    export interface IInitialConnectionHeaders {
        nosession?: boolean;
    }
    export interface IClient {
        socket: ISocket;
        sails: IClientSails;
    }
    export interface IHeaders { [index: string]: string }
    export interface IRequestOptions {
        url: string;
        method?: string;
        headers?: IHeaders;
        params?: any;
        data?: any;
    }
    export interface IJWR<T> {
        headers: IHeaders;
        statusCode: number;
        body: T;
        error?: Error;
        toString: () => string;
        toPOJO: () => {
            body: T;
            headers: IHeaders;
            statusCode: number;
        }
        pipe: () => Error;
    }
    export interface IRequestCallback<T> {
        (body: T, JWR: IJWR<T>): any;
    }
    export type IData = Object;
    export interface ISocket {
        get<T>(url: string, data?: IData): void;
        get<T>(url: string, cb?: IRequestCallback<T>): void;
        get<T>(url: string, data: IData, cb: IRequestCallback<T>): void;
        post<T>(url: string, data?: IData): void;
        post<T>(url: string, cb?: IRequestCallback<T>): void;
        post<T>(url: string, data: IData, cb: IRequestCallback<T>): void;
        put<T>(url: string, data?: IData): void;
        put<T>(url: string, cb?: IRequestCallback<T>): void;
        put<T>(url: string, data: IData, cb: IRequestCallback<T>): void;
        delete<T>(url: string, data?: IData): void;
        delete<T>(url: string, cb?: IRequestCallback<T>): void;
        delete<T>(url: string, data: IData, cb: IRequestCallback<T>): void;
        request<T>(options, cb?: IRequestCallback<T>): void;
        on(event: string, cb: () => any): ISocket;
        on(event: "connect", cb: () => any): ISocket;
        on(event: "disconnect", cb: () => any): ISocket;
        on(event: "reconnecting", cb: (numAttempts: number) => any): ISocket;
        on(event: "reconnect", cb: (transport, numAttempts: number) => any): ISocket;
        on(event: "error", cb: (err) => any): ISocket;
        off(event: string, cb: () => any): ISocket
        removeAllListeners(): ISocket;
        isConnecting(): boolean;
        isConnected(): boolean;
        reconnect(): ISocket;
        mightBeAboutToAutoConnect(): boolean;
        replay(): ISocket;
    }
}
declare function SailsIOJS(client: SocketIOClientStatic): SailsIOJS.IClient;
export = SailsIOJS;