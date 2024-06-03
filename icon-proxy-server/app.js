const express = require('express');
const cors = require("cors");
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const { JSDOM } = require('jsdom');
const bodyParser = require('body-parser');

// Configuration
const PORT = 3000;
const HOST = "localhost";

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function processURL(html, target_url) {
    const dom = new JSDOM(html);
    const doc = dom.window.document; 
    // console.log(html);
    const iconTag = doc.querySelector('link[rel="icon"]');
    if (iconTag) {
      const img = iconTag.getAttribute('href');
      console.log('Icon tag found');
      const gotImage = getImage(img, target_url);
      return gotImage; 
    } else {
      console.log('Icon tag not found: ', iconTag);
      return target_url + "/favicon.ico";
    }
}

function getImage(icon, iconURl) {
    if (icon) {
      let parts = "";
      if (icon.substring(0,4) !== "http")  {
        parts = iconURl.split('/');
        if (parts.length >= 4) {
          parts = parts.slice(0, 3).join('/')
        } else {
          parts = "uh oh, string is too short";
        }
      }
      console.log('Icon URL:', parts + icon);
      return parts + icon;
    } else {
        console.log('No icon URL found');
        return iconURl + "/favicon.ico";
    }
}

// Proxy endpoints
app.use('/icon_url', (req, res) => {
    const target_url = req.query.i;
    console.log(target_url);
    const proxy = createProxyMiddleware({
        target: target_url,
        changeOrigin: true,
        pathRewrite: (path, req) => target_url,
        selfHandleResponse: true, 
        on: {
            proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
            res.statusCode = 200;
            const response = responseBuffer.toString('utf8');
            const url = processURL(response, target_url);
            return url;
            }),
        },
    });
    proxy(req, res);
  });

 // Start the Proxy
app.listen(PORT, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
