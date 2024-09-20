import {Disposisi, DetailLetterIn, UserWithRead, DisposisiLevel2, DisposisiLevel3} from "@/interfaces/LetterIn";
import {useDateFormatter} from "@/utils/useDateFormatter";

const renderRecipient = (recipient: UserWithRead) => `
    <span style="background: #f0f0f0; padding: 0 10px 20px; border-radius: 5px;">
        ${recipient.name}
    </span>
`;

const renderRecipients = (recipients: UserWithRead[]) =>
    recipients.map(renderRecipient).join("");

const renderSignature = (signatureUrl: string | null) =>
    signatureUrl
        ? `<img src="${signatureUrl}" alt="Signature" style="height: 200px; width: auto;"/>`
        : "";

export const generateDispositionHTML = (
    letter: DetailLetterIn,
    disposition: Disposisi | DisposisiLevel2 | DisposisiLevel3,
    status: string,
    qrCodeUrl: string
): string => {
    if (!disposition) return "";

    const formattedDate = useDateFormatter(disposition.created_at);

    return `
    <div style="font-family: Arial, sans-serif; padding: 40px; width: 100%; height: 100%; font-size: 24px;">
        <span style="font-weight: bold; color: #007bff; font-size: 28px;">${status}</span>
        <div style="display: flex; justify-content: space-between; margin-top: 20px; margin-bottom: 100px; border-bottom: gray; border-bottom-width: medium">
            <div>
                <div style="margin-bottom: 25px;">
                    <label style="font-weight: bold; font-size: 26px;">No Surat:</label>
                    <div style="font-size: 24px;">${letter.no_surat}</div>
                </div>
                <div style="margin-bottom: 50px;">
                    <label style="font-weight: bold; font-size: 26px;">Tanggal Pembuatan:</label>
                    <div style="font-size: 24px;">${formattedDate}</div>
                </div>
            </div>
            <div style="text-align: right;">
                <label style="font-weight: bold; font-size: 26px;">Pembuat Disposisi:</label>
                <div style="font-size: 24px;">${disposition.created_by.name}</div>
            </div>
        </div>
        <div style="margin-bottom: 25px;">
            <label style="font-weight: bold; font-size: 26px;">Isi Disposisi:</label>
            <div style="font-size: 24px;">${disposition.isi.map((isi) => isi.isi).join(", ")}</div>
        </div>
        <div style="margin-bottom: 25px;">
            <label style="font-weight: bold; font-size: 26px; margin-bottom: 20px;">Penerima:</label>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 24px; margin-top: 20px;">
                ${renderRecipients(disposition.penerima)}
            </div>
        </div>
        <div style="margin-bottom: 25px;">
            <label style="font-weight: bold; font-size: 26px;">Catatan:</label>
               <div style="font-size: 24px;">${disposition.catatan}</div>
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 50px 50px 0;">
            ${renderSignature(disposition.tanda_tangan)}
            <img src="${qrCodeUrl}" alt="QR Code" style="height: 200px; width: auto;"/>
        </div>
    </div>
  `;
};
