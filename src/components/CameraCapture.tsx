'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CameraCaptureProps {
    onCapture: (file: File, dataUrl: string) => void;
    disabled?: boolean;
    onCameraStateChange?: (isActive: boolean) => void;
}

interface CameraDevice {
    deviceId: string;
    label: string;
}

export default function CameraCapture({ onCapture, disabled, onCameraStateChange }: CameraCaptureProps) {
    const [isStreamActive, setIsStreamActive] = useState(false);
    const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCaptured, setIsCaptured] = useState(false);
    const [permissionDenied, setPermissionDenied] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Get available cameras
    useEffect(() => {
        const getCameras = async () => {
            console.log('🔍 Starting camera detection...');
            try {
                // Request permission first
                console.log('📱 Requesting camera permission...');
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                console.log('✅ Camera permission granted:', stream);

                // Stop the test stream immediately
                stream.getTracks().forEach(track => {
                    console.log('🛑 Stopping test track:', track.label);
                    track.stop();
                });

                console.log('🔍 Enumerating devices...');
                const devices = await navigator.mediaDevices.enumerateDevices();
                console.log('📱 All devices:', devices);

                const cameras = devices
                    .filter(device => device.kind === 'videoinput')
                    .map((device, index) => ({
                        deviceId: device.deviceId,
                        label: device.label || `Camera ${index + 1}`
                    }));

                console.log('📷 Available cameras:', cameras);
                setAvailableCameras(cameras);

                if (cameras.length > 0) {
                    setSelectedCamera(cameras[0].deviceId);
                    console.log('✅ Selected default camera:', cameras[0]);
                }
                setPermissionDenied(false);
                setError(null);
            } catch (err) {
                console.error('❌ Error getting cameras:', err);
                setPermissionDenied(true);
                setError('Kamera ditolak aktif, Anda dapat mengupload gambarnya secara manual.');
                onCameraStateChange?.(false);
            }
        };

        getCameras();
    }, [onCameraStateChange]);

    // Start camera stream
    const startCamera = async (cameraId?: string) => {
        const targetCameraId = cameraId || selectedCamera;
        console.log('🚀 Starting camera with ID:', targetCameraId);
        
        if (!targetCameraId) {
            setError('Tidak ada kamera yang tersedia');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Stop existing stream
            if (streamRef.current) {
                console.log('🛑 Stopping existing stream');
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            const constraints: MediaStreamConstraints = {
                video: {
                    deviceId: { exact: targetCameraId },
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 }
                }
            };

            console.log('📝 Camera constraints:', constraints);
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('✅ Got camera stream:', stream);
            console.log('📊 Stream tracks:', stream.getTracks());

            streamRef.current = stream;

            if (videoRef.current) {
                console.log('📺 Setting video srcObject...');
                videoRef.current.srcObject = stream;

                // Force video to load and play
                videoRef.current.onloadedmetadata = async () => {
                    console.log('📺 Video metadata loaded');
                    console.log('📏 Video dimensions:', {
                        videoWidth: videoRef.current?.videoWidth,
                        videoHeight: videoRef.current?.videoHeight
                    });

                    try {
                        if (videoRef.current) {
                            await videoRef.current.play();
                            console.log('✅ Video playing successfully');
                            setIsStreamActive(true);
                            setIsCaptured(false);
                            onCameraStateChange?.(true);
                        }
                    } catch (playError) {
                        console.error('❌ Error playing video:', playError);
                        setError('Gagal memutar video kamera');
                        onCameraStateChange?.(false);
                    }
                };

                // Add additional event listeners for debugging
                videoRef.current.oncanplay = () => console.log('📺 Video can play');
                videoRef.current.onplaying = () => console.log('📺 Video is playing');
                videoRef.current.onerror = (e) => console.error('📺 Video error:', e);

                // Ensure video element is ready
                if (videoRef.current.readyState >= 2) {
                    // Metadata is loaded, try to play
                    try {
                        await videoRef.current.play();
                        console.log('✅ Video started (readyState check)');
                        setIsStreamActive(true);
                        setIsCaptured(false);
                        onCameraStateChange?.(true);
                    } catch (playError) {
                        console.log('⚠️ Play failed on readyState check:', playError);
                    }
                }
            }

        } catch (err) {
            console.error('❌ Error starting camera:', err);
            setError('Gagal membuka kamera. Silakan gunakan upload manual.');
            setPermissionDenied(true);
            onCameraStateChange?.(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Stop camera stream
    const stopCamera = () => {
        console.log('🛑 Stopping camera');
        
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                console.log('🛑 Stopping track:', track.label);
                track.stop();
            });
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.pause();
        }

        setIsStreamActive(false);
        onCameraStateChange?.(false);
    };

    // Capture photo
    const capturePhoto = () => {
        console.log('📸 Attempting to capture photo');
        
        if (!videoRef.current || !canvasRef.current) {
            console.error('❌ Video or canvas ref not available');
            return;
        }

        if (!isStreamActive || !streamRef.current) {
            console.error('❌ Camera stream not active');
            setError('Kamera tidak aktif. Silakan buka kamera terlebih dahulu.');
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
            console.error('❌ Cannot get canvas context');
            return;
        }

        // Check if video has valid dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.error('❌ Video has no dimensions');
            setError('Video belum siap. Tunggu sebentar dan coba lagi.');
            return;
        }

        console.log('📏 Capturing with dimensions:', {
            width: video.videoWidth,
            height: video.videoHeight
        });

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas (flip horizontally for selfie effect)
        context.save();
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();

        // Convert to blob and file
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `photo-${Date.now()}.jpg`, {
                    type: 'image/jpeg'
                });
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

                console.log('✅ Photo captured successfully', {
                    fileSize: blob.size,
                    fileName: file.name
                });

                onCapture(file, dataUrl);
                setIsCaptured(true);
                stopCamera();
            } else {
                console.error('❌ Failed to create blob from canvas');
                setError('Gagal mengambil foto. Silakan coba lagi.');
            }
        }, 'image/jpeg', 0.8);
    };

    // Retake photo
    const retakePhoto = () => {
        setIsCaptured(false);
        setError(null);
        startCamera();
    };

    // Switch camera
    const switchCamera = (cameraId: string) => {
        console.log('🔄 Switching to camera:', cameraId);
        setSelectedCamera(cameraId);
        if (isStreamActive) {
            stopCamera();
            setTimeout(() => startCamera(cameraId), 100);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log('🧹 Cleaning up camera component');
            stopCamera();
        };
    }, []);

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* Camera Controls */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Camera Selector */}
                        {availableCameras.length > 1 && !permissionDenied && (
                            <Select
                                value={selectedCamera}
                                onValueChange={switchCamera}
                                disabled={disabled || isLoading || isStreamActive}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Pilih kamera" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCameras.map((camera) => (
                                        <SelectItem key={camera.deviceId} value={camera.deviceId}>
                                            {camera.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {/* Start/Stop Camera Button */}
                        {!permissionDenied && (
                            <Button
                                type="button"
                                variant={isStreamActive ? "destructive" : "default"}
                                onClick={isStreamActive ? stopCamera : () => startCamera()}
                                disabled={disabled || isLoading || availableCameras.length === 0}
                            >
                                {isLoading ? (
                                    '⏳ Loading...'
                                ) : isStreamActive ? (
                                    '⏹️ Tutup Kamera'
                                ) : (
                                    '📷 Buka Kamera'
                                )}
                            </Button>
                        )}

                        {/* Capture Button */}
                        {isStreamActive && (
                            <Button
                                type="button"
                                onClick={capturePhoto}
                                disabled={disabled}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                📸 Ambil Foto
                            </Button>
                        )}

                        {/* Retake Button */}
                        {isCaptured && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={retakePhoto}
                                disabled={disabled}
                            >
                                🔄 Ambil Ulang
                            </Button>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={`p-3 border rounded-lg ${permissionDenied
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-red-50 border-red-200'
                            }`}>
                            <p className={`text-sm ${permissionDenied
                                ? 'text-yellow-800'
                                : 'text-red-800'
                                }`}>
                                {permissionDenied ? '⚠️' : '❌'} {error}
                            </p>
                        </div>
                    )}

                    {/* Camera Stream */}
                    {isStreamActive && !permissionDenied && (
                        <div className="relative bg-black rounded-lg overflow-hidden">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full max-w-md mx-auto block aspect-video object-cover"
                                style={{ 
                                    transform: 'scaleX(-1)',
                                    minHeight: '200px'
                                }}
                                onError={(e) => {
                                    console.error('📺 Video element error:', e);
                                    setError('Error pada video player');
                                }}
                            />

                            {/* Capture Overlay */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                <Button
                                    type="button"
                                    size="lg"
                                    onClick={capturePhoto}
                                    disabled={disabled}
                                    className="rounded-full w-16 h-16 bg-white border-4 border-gray-300 hover:border-blue-500 text-2xl shadow-lg"
                                >
                                    📷
                                </Button>
                            </div>

                            {/* Camera Status Indicator */}
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                LIVE
                            </div>
                        </div>
                    )}

                    {/* Hidden Canvas for Capture */}
                    <canvas
                        ref={canvasRef}
                        style={{ display: 'none' }}
                    />

                    {/* Instructions */}
                    {!isStreamActive && !error && !permissionDenied && (
                        <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-4xl mb-2">📷</div>
                            <p className="text-gray-600">
                                Klik &quot;Buka Kamera&quot; untuk mulai mengambil foto
                            </p>
                            {availableCameras.length === 0 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Pastikan browser memiliki akses ke kamera
                                </p>
                            )}
                        </div>
                    )}

                    {/* Success Message */}
                    {isCaptured && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm">
                                ✅ Foto berhasil diambil! Anda bisa mengambil ulang atau lanjut mengisi form.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}