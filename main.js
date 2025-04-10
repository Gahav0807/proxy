const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');

// Создаём HTTP прокси-сервер
const proxy = httpProxy.createProxyServer({});

// Функция для обработки HTTPS запросов
const createServer = (port) => {
  return http.createServer((req, res) => {
    // Прокси всё на целевой URL
    proxy.web(req, res, {
      target: req.url,  // Проксиируем запрос на целевой ресурс
      changeOrigin: true, // Изменяем заголовки Origin
      ws: true, // Включаем поддержку WebSocket
    });
  });
};

// Для Render порты можно брать из окружения
const PORT = process.env.PORT || 8080;
createServer(PORT).listen(PORT, () => {
  console.log(`🚀 HTTP прокси запущен на порту ${PORT}`);
});
