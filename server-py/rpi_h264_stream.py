import picamera
import time

NAL_SEP = b'\x00\x00\x00\x01'


class RPiCameraConfig:
    def __init__(self, **kwargs):
        self.width = 1280 if 'width' not in kwargs else kwargs['width']
        self.height = 720 if 'height' not in kwargs else kwargs['height']
        self.fps = 30 if 'fps' not in kwargs else kwargs['fps']
        self.bps = 0 if 'bps' not in kwargs else kwargs['bps']
        self.quality = 20 if 'quality' not in kwargs else kwargs['quality']
        self.profile = 'baseline' if 'profile' not in kwargs else kwargs['profile']

    def start_recording(self, camera, stream):
        camera.resolution = (self.width, self.height)
        camera.framerate = self.fps

        camera.start_recording(stream,
                               format='h264',
                               profile=self.profile,
                               quality=self.quality,
                               bitrate=self.bps)


class RPiH264Stream:
    def __init__(self, rpi_camera_config):
        self._dat = bytearray()
        self._frame_listeners = []
        self._camera = rpi_camera_config

    def on_frame(self, callback):
        self._frame_listeners += [callback]

    def _on_frame(self, frame):
        for f in self._frame_listeners:
            f(frame)

    def write(self, b):
        self._dat += b
        nal = self._dat.find(NAL_SEP, len(NAL_SEP))
        while nal != -1:
            frame = self._dat[0:nal]
            self._dat = self._dat[nal:]
            self._on_frame(frame)
            nal = self._dat.find(NAL_SEP, nal + len(NAL_SEP))

    def flush(self):
        pass

    def start(self, number_secs=-1):
        with picamera.PiCamera() as camera:
            print("Starting camera...")
            self._camera.start_recording(camera, self)
            i = 0
            while number_secs == -1 or i < number_secs:
                time.sleep(1)
                i += 1


if __name__ == '__main__':
    stream = RPiH264Stream(RPiCameraConfig(
        width=1920,
        height=1080,
        fps=30,
        quality=20))

    with open('tmp.h264', 'wb') as f:
        def on_frame(frame):
            f.write(frame)
        stream.on_frame(on_frame)
        stream.start(number_secs=10)


