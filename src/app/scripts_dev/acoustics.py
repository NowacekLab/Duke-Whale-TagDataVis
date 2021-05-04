from scipy.io import wavfile as wav
import matplotlib.pyplot as plt
import numpy as np
from scipy.fftpack import fft
from matplotlib.widgets import Slider
from helpers import cmdArgs

def acousticPlot(wav_file_path, new_file_path, is_export):
    frameSize = 100
    rate, data = wav.read(wav_file_path)
    fq = rate
    xValRange = np.arange(len(data))
    sector = data[:frameSize,:]
    
    time = xValRange / fq
    
    fig = plt.figure()
    gs = fig.add_gridspec(2, 1)
    ax_time = fig.add_subplot(gs[0, 0])
    ax_time.set_xlabel('Time(s)')
    ax_time.set_ylabel("Intensity")
    ax_freq = fig.add_subplot(gs[1, 0])
    
    plt.subplots_adjust(bottom=0.15)
    ax_time.plot(time[0:frameSize], sector, '-')
    fft_out1 = fft(data[0:frameSize,0])
    fft_out2 = fft(data[0:frameSize,1])
    ax_freq.plot(abs(fft_out1[0:int(len(fft_out1)/2)]))
    ax_freq.plot(abs(fft_out2[0:int(len(fft_out2)/2)]))
    
    # Update function
    def update(val):
        length = int(sliderRange.val)
        idx = int(sliderDist.val)
        ax_time.cla()
        ax_freq.cla()
        frameSize = length
        ax_time.plot(time[idx:idx + frameSize], data[idx:idx + frameSize], '-')
        ax_time.set_xlabel('Time(s)')
        ax_time.set_ylabel("Intensity")
        fft_out1 = fft(data[idx:idx + frameSize,0])
        fft_out2 = fft(data[idx:idx + frameSize,1])
        ax_freq.plot(abs(fft_out1[0:int(len(fft_out1)/2)]))
        ax_freq.plot(abs(fft_out2[0:int(len(fft_out2)/2)]))
        fig.canvas.draw_idle()
    
    # Sliders
    
    axDist = plt.axes([0.25, 0.05, 0.5, 0.03])
    axRange = plt.axes([0.25, 0.01, 0.5, 0.03])
    
    sliderDist = Slider(axDist, 'Data Location', 0, xValRange[-1], valinit=0, valfmt='%d')
    sliderDist.on_changed(update)
    
    sliderRange = Slider(axRange, 'Frame Size', 100, 1000000, valinit=100, valfmt='%d')
    sliderRange.on_changed(update)
    
    if is_export:
        plt.savefig(new_file_path)
    else:
        plt.show()
        
def _getCMDLineArgs():
    return cmdArgs.getCMDLineArgs() 
    
def main(cmdLineArgs: dict):
    try:
        wav_file_path = cmdLineArgs['wavFilePath']
        new_file_path = cmdLineArgs['newFilePath']
        is_export = cmdLineArgs['isExport']
        
        is_export = True if is_export == "True" else False  
        
        acousticPlot(wav_file_path, new_file_path, is_export)
        
        return "SUCCESS"
    except Exception as e:
        raise Exception(e)
    