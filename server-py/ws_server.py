from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from threading import Thread


class WSServer(Thread):
    def __init__(self, port):
        super().__init__()
        self.port = port
        self._server = SimpleWebSocketServer('', self.port, WebSocket)

    def run(self):
        print("Opening WS server on port %d..." % self.port)
        self._server.serveforever()

    def on_frame(self, frame):
        for c in self._server.connections:
            self._server.connections[c].sendMessage(frame)

