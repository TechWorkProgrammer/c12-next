import React, { useRef, useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { User } from '@/interfaces/User';
import { useAlert } from '@/contexts/AlertContext';
import client from '@/api/client';

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedUsers: User[];
    selectedDisposisi: string[];
    note: string;
    letter: any;
    parentDisposisi?: any;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, selectedUsers, selectedDisposisi, note, letter, parentDisposisi }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const alert = useAlert();

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(
            event.type === 'mousedown' ? (event as React.MouseEvent).clientX - canvas.offsetLeft : (event as React.TouchEvent).touches[0].clientX - canvas.offsetLeft,
            event.type === 'mousedown' ? (event as React.MouseEvent).clientY - canvas.offsetTop : (event as React.TouchEvent).touches[0].clientY - canvas.offsetTop
        );
        setIsDrawing(true);
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(
            event.type === 'mousemove' ? (event as React.MouseEvent).clientX - canvas.offsetLeft : (event as React.TouchEvent).touches[0].clientX - canvas.offsetLeft,
            event.type === 'mousemove' ? (event as React.MouseEvent).clientY - canvas.offsetTop : (event as React.TouchEvent).touches[0].clientY - canvas.offsetTop
        );
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleSaveSignature = async () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            alert.warning('Canvas not available.');
            return;
        }
        setIsProcessing(true);
        await new Promise<void>((resolve) => {
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    alert.warning('Please provide a signature before submitting.');
                    setIsProcessing(false);
                    return;
                }

                try {
                    const file = new File([blob], 'signature.png', { type: 'image/png' });

                    const formData = new FormData();
                    formData.append('catatan', note);
                    formData.append('tanda_tangan', file);
                    selectedDisposisi.forEach((id) => formData.append('isi_disposisi_id[]', id));
                    selectedUsers.forEach((user) => formData.append('penerima[]', user.uuid));

                    const url = parentDisposisi
                        ? `/surat-masuk/${letter?.uuid}/disposisi/${parentDisposisi.uuid}`
                        : `/surat-masuk/${letter?.uuid}/disposisi`;

                    await client.post(url, formData);

                    alert.success('Disposition successfully created with signature.');
                    onClose();
                } catch (error) {
                    alert.warning('Failed to create disposition. Please try again.');
                    onClose();
                } finally {
                    setIsProcessing(false);
                }

                resolve();
            });
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="border border-gray-300 rounded-lg mb-4 bg-white"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
                <div className="flex justify-end gap-2 w-full">
                    <Button label="Bersihkan" onClick={clearCanvas}/>
                    <Button
                        label={isProcessing ? "Processing..." : "Buat Disposisi"}
                        onClick={handleSaveSignature}
                        disabled={isProcessing}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default SignatureModal;
