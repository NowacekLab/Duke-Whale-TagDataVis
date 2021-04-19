import wave
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
from plotly.subplots import make_subplots

def readWAV(filename, sampleRate):
    signal_wave = wave.open(filename, 'r')
    sample_rate = sampleRate
    signal = np.frombuffer(signal_wave.readframes(sample_rate), dtype=np.int16)
    return signal

sample_rate = 16000
signal = readWAV('../Downloads/gm172a011.wav', sample_rate)

signal = signal[0:50000]

def createSoundGraphs(sig, fft, freq, num_overlap_samp):
    plt.figure(1)

    energy_plot = plt.subplot(211)
    energy_plot.plot(sig)
    energy_plot.set_ylabel('Energy')

    freq_plot = plt.subplot(212)
    freq_plot.specgram(sig, NFFT=fft, Fs=freq, noverlap=num_overlap_samp)
    freq_plot.set_xlabel('Time')
    freq_plot.set_ylabel('Frequency')

    plt.show()
    
createSoundGraphs(signal, 1024, sample_rate, 900)