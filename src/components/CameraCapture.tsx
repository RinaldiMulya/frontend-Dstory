'use client';
/* eslint-disable */

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CameraCaptureProps {
    onCapture: (file: File, dataUrl: string) => void;
    disabled?: boolean;
    onCameraStateChange?: (isActive: boolean) => void;
}

interface CameraDevice {
    deviceId: string;
    label: string;
}

export default function CameraCapture({
    onCapture,
    disabled,
    onCameraStateChange,
}: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [isStreamActive, setIsStreamActive] = useState(false);
    const [isCaptured, setIsCaptured] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    // Get available cameras on mount
    useEffect(() => {
        const detectCameras = async () => {
            try {
                const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
                tempStream.getTracks().forEach(track => track.stop());

                const devices = await navigator.mediaDevices.enumerateDevices();
                const cameras = devices
                    .filter(device => device.kind === 'videoinput')
                    .map((d, i) => ({
                        deviceId: d.deviceId,
                        label: d.label || `Camera ${i + 1}`,
                    }));

                setAvailableCameras(cameras);
                setSelectedCamera(cameras[0]?.deviceId || '');
                setPermissionDenied(false);
            } catch (err) {
                console.error('Camera permission error:', err);
                setPermissionDenied(true);
                setError('Izin kamera ditolak. Anda bisa unggah manual.');
                onCameraStateChange?.(false);
            }
        };

        detectCameras();
    }, [onCameraStateChange]);

    // Start streaming
    const startCamera = async (cameraId = selectedCamera) => {
        if (!cameraId) return;

        try {
            setIsLoading(true);
            stopCamera();

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { exact: cameraId },
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            streamRef.current = stream;

            // Delay untuk memastikan ref ter-render
            setTimeout(async () => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    try {
                        await videoRef.current.play();
                        setIsStreamActive(true);
                        setIsCaptured(false);
                        setError(null);
                        onCameraStateChange?.(true);
                    } catch (playError) {
                        console.warn('Autoplay error:', playError);
                        setError('Klik video untuk mulai streaming.');
                        videoRef.current.addEventListener('click', () => {
                            videoRef.current?.play();
                        });
                    }
                }
            }, 100);
        } catch (err) {
            console.error('Failed to start camera:', err);
            setError('Gagal membuka kamera.');
            setPermissionDenied(true);
            onCameraStateChange?.(false);
        } finally {
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.pause();
        }

        setIsStreamActive(false);
        onCameraStateChange?.(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;


        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        setImageSize({
            width: video.videoWidth,
            height: video.videoHeight
        });


        canvas.toBlob(blob => {
            if (blob) {
                const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                onCapture(file, dataUrl);
                setIsCaptured(true);
                stopCamera();
            }
        }, 'image/jpeg', 0.8);
    };

    const retakePhoto = () => {
        setIsCaptured(false);
        startCamera();
    };

    const switchCamera = (cameraId: string) => {
        setSelectedCamera(cameraId);
        if (isStreamActive) {
            stopCamera();
            setTimeout(() => startCamera(cameraId), 300);
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {/* Camera controls */}
                    <div className="flex flex-wrap gap-3 items-center">
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
                                    {availableCameras.map((cam) => (
                                        <SelectItem key={cam.deviceId} value={cam.deviceId}>
                                            {cam.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {!permissionDenied && (
                            <Button
                                type="button"
                                onClick={() => (isStreamActive ? stopCamera() : startCamera())}
                                disabled={disabled || isLoading}
                                variant={isStreamActive ? 'destructive' : 'default'}
                            >
                                {isStreamActive ? '⛔ Tutup Kamera' : '📷 Buka Kamera'}
                            </Button>
                        )}

                        {isStreamActive && (
                            <Button onClick={capturePhoto} disabled={disabled}>
                                📸 Ambil Foto
                            </Button>
                        )}

                        {isCaptured && (
                            <Button variant="outline" onClick={retakePhoto} disabled={disabled}>
                                🔄 Ambil Ulang
                            </Button>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                            ❗ {error}
                        </div>
                    )}

                    {/* Video Preview */}
                    <div className="relative bg-black rounded-lg overflow-hidden min-h-[200px]">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className={`w-full object-cover aspect-video transition-opacity duration-300 ${isStreamActive ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{ transform: 'scaleX(-1)' }}
                        />
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Success Message */}
                    {isCaptured && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                            ✅ Foto berhasil diambil!
                        </div>
                    )}

                    {/* Hint if no camera */}
                    {!isStreamActive && !permissionDenied && !isCaptured && (
                        <div className="text-center text-sm text-gray-500">
                            Klik “Buka Kamera” untuk mulai mengambil gambar.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
