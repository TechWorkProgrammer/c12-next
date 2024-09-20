import React, { useRef, useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignatureSubmit: (file: File | null) => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSignatureSubmit }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

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

    const handleSaveSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'signature.png', { type: 'image/png' });
                onSignatureSubmit(file);
                onClose();
            }
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
                    <Button label="Bersihkan" onClick={clearCanvas} variant="secondary" />
                    <Button label="Buat Disposisi" onClick={handleSaveSignature} />
                </div>
            </div>
        </Modal>
    );
};

export default SignatureModal;
