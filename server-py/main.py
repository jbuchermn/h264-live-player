from rpi_h264_stream import RPiH264Stream, RPiCameraConfig
from ws_server import WSServer

if __name__ == '__main__':
    stream = RPiH264Stream(RPiCameraConfig(
        width=1280,
        height=720,
        fps=10,
        quality=10))

    server = WSServer(5001)
    stream.on_frame(server.on_frame)
    server.start()
    stream.start()

