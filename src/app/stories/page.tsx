'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

import { createStorySchema, type CreateStoryFormData } from '@/lib/validations/story';
import { storiesApi } from '../api/stories/route';
import LocationPicker from '@/components/LocationPicker';
import CameraCapture from '@/components/CameraCapture';
import Image from 'next/image';

export default function CreateStoryPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<File | null>(null);
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
        address?: string;
    } | null>(null);

    const form = useForm<CreateStoryFormData>({
        resolver: zodResolver(createStorySchema),
        defaultValues: {
            title: '',
            content: '',
            image: null as unknown as File,
            latitude: undefined,
            longitude: undefined,
        },
    });

    // Handle file upload dan preview
    const handleImageUpload = (file: File) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            form.setValue('image', file);
            setCapturedImage(null);
        }
    };

    // Handle camera capture
    const handleCameraCapture = (file: File, dataUrl: string) => {
        setCapturedImage(file);
        setPreviewImage(dataUrl);
        setImageSize({
            width: 640,
            height: 480,
        });
        form.setValue('image', file, { shouldValidate: true });
    };


    // Clear image
    const clearImage = () => {
        setPreviewImage(null);
        setCapturedImage(null);
        form.setValue('image', null as unknown as File);

        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };



    // Handle form submission dengan progress tracking
    const onSubmit = async (data: CreateStoryFormData) => {

        console.log("errors", form.formState.errors);
        console.log("form data", data);

        if (!(data.image instanceof File)) {
            toast.error('File image tidak valid. Pastikan Anda memilih file yang benar.');
            return;
        }
        try {
            setIsSubmitting(true);
            setUploadProgress(0);

            // Simulate upload progress (karena fetch tidak support progress native)
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            // Include location data if available
            const submitData = {
                ...data,
                latitude: selectedLocation?.lat,
                longitude: selectedLocation?.lng,
            };

            const result = await storiesApi.createStory(submitData);

            clearInterval(progressInterval);
            setUploadProgress(100);

            toast.success('Story berhasil dibuat! 🎉');

            // Redirect setelah delay singkat
            setTimeout(() => {
                router.push('/stories');
            }, 1500);

        } catch (error) {
            console.error('Error creating story:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Gagal membuat story. Silakan coba lagi.'
            );
            setUploadProgress(0);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-save draft (optional feature)
    useEffect(() => {
        const formData = form.watch();
        const draft = {
            title: formData.title,
            content: formData.content,
            timestamp: Date.now()
        };

        // Save to sessionStorage (hanya jika ada content)
        if (formData.title || formData.content) {
            sessionStorage.setItem('story-draft', JSON.stringify(draft));
        }
    }, [form.watch()]);

    // Load draft on mount
    useEffect(() => {
        const savedDraft = sessionStorage.getItem('story-draft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                // Only load if draft is less than 1 hour old
                if (Date.now() - draft.timestamp < 3600000) {
                    form.setValue('title', draft.title || '');
                    form.setValue('content', draft.content || '');

                    if (draft.title || draft.content) {
                        toast.success('Draft berhasil dimuat 📝');
                    }
                }
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, [form]);

    return (
        <div className="container mx-auto py-8 px-4 mt-10 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">📝 Tambah Story Baru</CardTitle>
                    <CardDescription>
                        Bagikan cerita Anda dengan foto dan lokasi
                    </CardDescription>

                    {/* Upload Progress */}
                    {isSubmitting && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Uploading story...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Title Field */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Judul Story</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Masukkan judul yang anda inginkan..."
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Judul yang baik akan menarik lebih banyak pembaca
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Content Field */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ceritakan pengalaman Anda..."
                                                className="min-h-[120px] resize-none"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Ceritakan detail yang menarik dari pengalaman Anda
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Image Upload dengan Camera Integration */}
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field: { onChange, value, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Foto</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                {/* Camera Capture Component */}
                                                <CameraCapture
                                                    onCapture={handleCameraCapture}
                                                    disabled={isSubmitting}
                                                    onCameraStateChange={setIsCameraActive}
                                                />

                                                {/* Manual File Upload */}
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                onChange(file);
                                                                handleImageUpload(file);
                                                            }
                                                        }}
                                                        disabled={isSubmitting || isCameraActive}
                                                        {...field}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Atau pilih file dari device Anda
                                                    </p>
                                                </div>

                                                {/* Image Preview */}
                                                {previewImage && (
                                                    <div className="relative">
                                                        <Image
                                                            src={previewImage}
                                                            alt="Preview"
                                                            width={imageSize?.width || 640}
                                                            height={imageSize?.height || 480}
                                                            className="max-w-full h-48 object-cover rounded-lg border shadow-sm"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="absolute top-2 right-2"
                                                            onClick={clearImage}
                                                            disabled={isSubmitting}
                                                        >
                                                            ✕
                                                        </Button>
                                                        {capturedImage && (
                                                            <div className="absolute bottom-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                                📸 Foto dari kamera
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            {isCameraActive
                                                ? "Kamera sedang aktif - upload dinonaktifkan"
                                                : "Ambil foto dengan kamera atau upload dari device (max 5MB)"
                                            }
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Map Component untuk Location Picker */}
                            <div className="space-y-4">
                                <FormLabel>Pilih Lokasi (Opsional)</FormLabel>
                                <LocationPicker
                                    onLocationSelect={(location) => {
                                        setSelectedLocation(location);
                                        form.setValue('latitude', location.lat);
                                        form.setValue('longitude', location.lng);
                                    }}
                                    initialLocation={selectedLocation}
                                />
                            </div>

                            {/* Location Display */}
                            {selectedLocation && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <h4 className="font-medium text-green-800">📍 Lokasi Terpilih</h4>
                                    <p className="text-sm text-green-700">
                                        Lat: {selectedLocation.lat.toFixed(6)},
                                        Lng: {selectedLocation.lng.toFixed(6)}
                                    </p>
                                    {selectedLocation.address && (
                                        <p className="text-sm text-green-600 mt-1">
                                            {selectedLocation.address}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                        // Clear draft on cancel
                                        sessionStorage.removeItem('story-draft');
                                        router.back();
                                    }}
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    Batal
                                </Button>

                                <Button
                                    type="submit"
                                    variant="default"
                                    disabled={isSubmitting || !form.formState.isValid}
                                    className="flex-1"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Mengirim...
                                        </span>
                                    ) : (
                                        '📤 Kirim Story'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}