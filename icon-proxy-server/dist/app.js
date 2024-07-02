"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const jsdom_1 = require("jsdom");
const body_parser_1 = __importDefault(require("body-parser"));
// Configuration
const PORT = 3000;
const HOST = "localhost";
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
function processURL(html, target_url) {
    const dom = new jsdom_1.JSDOM(html);
    const doc = dom.window.document;
    // console.log(html);
    const iconTag = doc.querySelector('link[rel="icon"]');
    if (iconTag) {
        const img = iconTag.getAttribute('href');
        console.log('Icon tag found');
        let gotImage = "";
        if (img) {
            gotImage = getImage(img, target_url);
        }
        else {
            gotImage = target_url + "/favicon.ico";
            console.log('Icon tag href not found: ', iconTag);
        }
        return gotImage;
    }
    else {
        console.log('Icon tag not found: ', iconTag);
        return target_url + "/favicon.ico";
    }
}
function getImage(icon, iconURl) {
    if (icon) {
        let parts = "";
        if (icon.substring(0, 4) !== "http") {
            parts = iconURl.split('/');
            if (parts.length >= 4) {
                parts = parts.slice(0, 3).join('/');
            }
            else {
                parts = "uh oh, string is too short";
            }
        }
        console.log('Icon URL:', parts + icon);
        return parts + icon;
    }
    else {
        console.log('No icon URL found');
        return iconURl + "/favicon.ico";
    }
}
// Proxy endpoints
app.use('/icon_url', (req, res) => {
    const target_url = req.query.i;
    console.log(target_url);
    const proxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: target_url,
        changeOrigin: true,
        pathRewrite: (path, req) => target_url,
        selfHandleResponse: true,
        on: {
            proxyRes: (0, http_proxy_middleware_1.responseInterceptor)((responseBuffer, proxyRes, req, res) => __awaiter(void 0, void 0, void 0, function* () {
                res.statusCode = 200;
                const response = responseBuffer.toString('utf8');
                const url = processURL(response, target_url);
                return url;
            })),
        },
    });
    proxy(req, res);
});
// Start the Proxy
app.listen(PORT, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
