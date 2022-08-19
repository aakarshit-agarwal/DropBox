export default class Route {
    url: string;
    proxy: Proxy;
    creditCheck: boolean;
    rateLimit?: {
        window: number,
        max: number
    };
}

export class Proxy {
    target: string;
    changeOrigin: boolean;
    pathRewrite?: {[regexp: string]: string};
}
