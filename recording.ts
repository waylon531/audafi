/*
    The MIT License (MIT)

    Copyright (c) 2022 Lancaster University

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
*/

/**
 * Functions to operate the v2 on-board microphone and speaker.
 */
//% weight=5 color=#015f85 icon="\uf130" block="Record" advanced=false
namespace record {
    // 

    export enum AudioEvent {
        //% block="starts playing"
        StartedPlaying,
        //% block="stops playing"
        StoppedPlaying,
        //% block="starts recording"
        StartedRecording,
        //% block="stops recording"
        StoppedRecording
    }

    export enum AudioLevels {
        //% block="low"
        Low = 1,
        //% block="medium"
        Medium,
        //% block="high"
        High
    }

    export enum AudioSampleRateScope {
        //% block="everything"
        Everything,
        //% block="playback"
        Playback,
        //% block="recording"
        Recording
    }

    export enum AudioRecordingMode {
        //% block="stopped"
        Stopped,
        //% block="recording"
        Recording,
        //% block="playing"
        Playing
    }

    export enum AudioStatus {
        //% block="playing"
        Playing,
        //% block="recording"
        Recording,
        //% block="stopped"
        Stopped,
        //% block="empty"
        BufferEmpty,
    }

    export enum BlockingState {
        //% block="until done"
        Blocking,
        //% block="in background"
        Nonblocking
    }

    let _recordingPresent: boolean = false;

    function audioNotRecording(): boolean {
        return !audioIsRecording();
    }

    function audioNotPlaying(): boolean {
        return !audioIsPlaying();
    }


    /**
     * Record an audio clip for a maximum of 3 seconds
     */
    //% block="record audio clip $mode"
    //% blockId="record_startRecording"
    //% weight=70
    //% parts="microphone"
    //% help=record/start-recording
    export function startRecording(mode: BlockingState): void {
        music._onStopSound(stopPlayback);
        eraseRecording();
        record();
        if (mode === BlockingState.Blocking) pauseUntil(audioNotRecording);
        _recordingPresent = true;
    }

    /**
     * Play recorded audio
     */
    //% block="play audio clip $mode"
    //% blockId="record_playAudio"
    //% weight=60
    //% parts="microphone"
    //% help=record/play-audio
    export function playAudio(mode: BlockingState): void {
        play();
        if (mode === BlockingState.Blocking) pauseUntil(audioNotPlaying);
    }

    function stopPlayback(): void {
        if (audioIsPlaying()) {
            stop();
        }
    }

    //% shim=record::stop
    export function stopRecording(): void {
    }


    export function eraseRecording(): void {
        _recordingPresent = false;
        erase();
        return
    }

    /**
     * Test what the audio is doing
     */
    //% block="audio is $status"
    //% blockId="record_audioStatus"
    //% parts="microphone"
    //% help=record/audio-status
    export function audioStatus(status: AudioStatus): boolean {
        switch (status) {
            case AudioStatus.Playing:
                return audioIsPlaying();
            case AudioStatus.Recording:
                return audioIsRecording();
            case AudioStatus.Stopped:
                return audioIsStopped();
            case AudioStatus.BufferEmpty:
                return !_recordingPresent;
        }
    }

    /**
     * Change how sensitive the microphone is. This changes the recording quality!
     */
    //% block="set microphone sensitivity to $gain"
    //% blockId="record_setMicGain"
    //% parts="microphone"
    //% weight=30
    //% help=record/set-mic-gain
    export function setMicGain(gain: AudioLevels): void {
        switch (gain) {
            case AudioLevels.Low:
                setMicrophoneGain(0.079);
                break;
            case AudioLevels.Medium:
                setMicrophoneGain(0.2);
                break;
            case AudioLevels.High:
                setMicrophoneGain(1.0);
                break;
        }
    }

    /**
     * Set the sample frequency for recording, playback, or both (default)
     * 
     * @param hz The sample frequency, in Hz
     */
    //% block="set sample rate to $hz || for $scope"
    //% blockId="record_setSampleRate"
    //% hz.min=1000 hz.max=22000 hz.defl=11000
    //% expandableArgumentMode="enabled"
    //% parts="microphone"
    //% weight=40
    //% help=record/set-sample-rate
    export function setSampleRate(hz: number, scope?: AudioSampleRateScope): void {
        switch (scope) {
            case AudioSampleRateScope.Playback:
                setOutputSampleRate(hz);
                break;
            case AudioSampleRateScope.Recording:
                setInputSampleRate(hz);
                break;
            case AudioSampleRateScope.Everything:
            default:
                setBothSamples(hz);
                break;
        }
    }
}
namespace bruh {
    /**
     * Get the recorded audio buffer
     */
    //% block="get audio buffer"
    //% blockId="record_getBuffer"
    //% weight=30
    export function getRecordingBuffer(): Buffer {
        return getBuffer();
    }
    /**
     * Test function
     */
    //% blockId=bruh-test
    //% block="test block"
    export function testBlock(): void {

    }

}
