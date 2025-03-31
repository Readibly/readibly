import uvicorn
import ssl
import os

ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain(
    certfile='localhost.pem',
    keyfile='localhost-key.pem'
)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        ssl_keyfile="localhost-key.pem",
        ssl_certfile="localhost.pem",
        reload=True
    ) 