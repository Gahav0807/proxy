const http = require("http");
const net = require("net");
const url = require("url");

const PORT = 8080; // поменяй при необходимости

// Обработка обычных HTTP-запросов
const requestHandler = (clientReq, clientRes) => {
  const parsedUrl = url.parse(clientReq.url);
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 80,
    path: parsedUrl.path,
    method: clientReq.method,
    headers: clientReq.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes, { end: true });
  });

  proxyReq.on("error", (err) => {
    console.error("Request error:", err.message);
    clientRes.writeHead(500);
    clientRes.end("Proxy request error");
  });

  clientReq.pipe(proxyReq, { end: true });
};

// Обработка HTTPS (CONNECT)
const connectHandler = (req, clientSocket, head) => {
  const [host, port] = req.url.split(":");

  const serverSocket = net.connect(port || 443, host, () => {
    clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  serverSocket.on("error", (err) => {
    console.error("Tunnel error:", err.message);
    clientSocket.end("HTTP/1.1 500 Tunnel Error\r\n");
  });
};

// Создание сервера
const server = http.createServer(requestHandler);
server.on("connect", connectHandler);

server.listen(PORT, () => {
  console.log(`✅ Прокси сервер запущен на порту ${PORT}`);
});
