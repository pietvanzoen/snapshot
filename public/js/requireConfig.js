requirejs.config({
  baseUrl: '/js',
  paths: {
    ko: 'libs/knockout',
    net: 'libs/net',
    lodash: "libs/lodash",
    io: '/socket.io/socket.io.js',
    simplewebrtc: 'http://simplewebrtc.com/latest',
  },
  waitSeconds: 30
});

