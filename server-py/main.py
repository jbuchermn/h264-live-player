from rpi_h264_stream import RPiH264Stream, RPiCameraConfig
from ws_server import WSServer

if __name__ == '__main__':
    stream = RPiH264Stream(RPiCameraConfig(
        width=640,
        height=480,
        fps=24,
        quality=30))

    server = WSServer(5001)
    stream.on_frame(server.on_frame)
    server.start()
    stream.start()

