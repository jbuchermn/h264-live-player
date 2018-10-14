from rpi_stream import RPiStream, RPiCameraConfig
from ws_server import WSServer

if __name__ == '__main__':
    stream = RPiStream(RPiCameraConfig(
        format='mjpeg',
        bps=10000000,
        width=640,
        height=480,
        fps=3,
        quality=20))

    server = WSServer(5001)
    stream.on_frame(server.on_frame)
    server.start()
    stream.start()

