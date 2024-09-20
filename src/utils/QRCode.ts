import QRCode from 'qrcode';

export const generateQRCode = async (value: string): Promise<string> => {
    try {
        return await QRCode.toDataURL(value, { width: 200, margin: 2 });
    } catch (error) {
        console.error("Error generating QR code:", error);
        return '';
    }
};
