const MIN_BROWSER_SAFE_PORT = 20000;
const MAX_BROWSER_SAFE_PORT = 45000;
const MAX_ATTEMPTS = 32;

function listenOnSafePort(server, host = '127.0.0.1') {
  const span = MAX_BROWSER_SAFE_PORT - MIN_BROWSER_SAFE_PORT + 1;
  const start = Math.floor(Math.random() * span);

  return new Promise((resolve, reject) => {
    let attempt = 0;
    const tryListen = () => {
      const port = MIN_BROWSER_SAFE_PORT + ((start + (attempt * 7919)) % span);
      attempt += 1;

      const onError = (error) => {
        server.removeListener('listening', onListening);
        if ((error.code === 'EADDRINUSE' || error.code === 'EACCES') && attempt < MAX_ATTEMPTS) {
          setImmediate(tryListen);
          return;
        }
        reject(error);
      };
      const onListening = () => {
        server.removeListener('error', onError);
        const address = server.address();
        if (!address || typeof address === 'string') {
          reject(new Error('Could not determine safe local verifier port'));
          return;
        }
        resolve(address);
      };

      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(port, host);
    };

    tryListen();
  });
}

module.exports = {
  MAX_BROWSER_SAFE_PORT,
  MIN_BROWSER_SAFE_PORT,
  listenOnSafePort,
};
