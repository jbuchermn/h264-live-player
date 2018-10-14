import picamera
import time

NAL_SEP = b'\x00\x00\x00\x01'

# raspivid -t 0 -0 -w 1280 -h 720 -fps 60 -pf baseline -o - > /dev/null: CPU 10-15%
# picamera: CPU 30-40%, same performance without NAL splitting
# subprocess 1kB packets: CPU 60-70%
# subprocess 10kB packets: CPU 25-30%

class Stream:
    def __init__(self):
        self.dat = bytearray()
        self.nframes = 0

    def on_frame(self, frame):
        self.nframes += 1

    def write(self, b):
        self.dat += b
        nal = self.dat.find(NAL_SEP, len(NAL_SEP))
        while nal != -1:
            frame = self.dat[0:nal]
            self.dat = self.dat[nal:]
            self.on_frame(frame)
            nal = self.dat.find(NAL_SEP, nal + len(NAL_SEP))

    def flush(self):
        pass


with picamera.PiCamera() as camera:
    camera.resolution = (1280, 720)
    camera.framerate = 30

    stream = Stream()
    camera.start_recording(stream, format='h264', profile='baseline')
    while True:
        time.sleep(1)
