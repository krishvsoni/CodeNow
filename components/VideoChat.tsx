'use client';
import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const VideoChat: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const getUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                peerConnectionRef.current = new RTCPeerConnection();

                stream.getTracks().forEach(track => {
                    peerConnectionRef.current?.addTrack(track, stream);
                });

                peerConnectionRef.current.ontrack = (event) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                peerConnectionRef.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('ice-candidate', event.candidate);
                    }
                };

                socket.on('ice-candidate', (candidate) => {
                    peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
                });

                const offer = await peerConnectionRef.current.createOffer();
                await peerConnectionRef.current.setLocalDescription(offer);
                socket.emit('offer', offer);
            } catch (error) {
                console.error('Error accessing media devices.', error);
            }
        };

        getUserMedia();

        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            peerConnectionRef.current?.close();
            socket.off('ice-candidate');
            socket.off('offer');
        };
    }, []);

    return (
        <div className="flex flex-col items-center">
            <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="border border-gray-600 rounded-lg mb-4"
            />
            <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="border border-gray-600 rounded-lg"
            />
        </div>
    );
};

export default VideoChat;
