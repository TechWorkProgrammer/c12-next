import React from 'react';
import {DetailLetterIn, Disposisi, DisposisiLevel2, DisposisiLevel3} from "@/interfaces/LetterIn";
import Image from "next/image";
import {useTranslation} from "@/utils/useTranslation";

interface DispositionProps {
    letter: DetailLetterIn;
    disposition: Disposisi | DisposisiLevel2 | DisposisiLevel3;
    status: string;
    qrCodeUrl: string;
    date: string;
    kopSuratUrl: string;
}

const DispositionPage: React.FC<DispositionProps> = ({letter, disposition, status, qrCodeUrl, date, kopSuratUrl}) => {
    const text = useTranslation();
    return (
        <div className="w-full mx-auto bg-white p-8">
            <div className="flex flex-row items-center justify-center">
                <Image src={kopSuratUrl} alt="Kop Surat" className="w-[100px] h-auto mb-4" width={200}
                       height={200}/>
            </div>
            <hr className="border border-gray-700"/>
            <p className="font-bold text-blue-800 text-center text-2xl pt-0 pb-4">{text(status)}</p>
            <hr className="border border-gray-700 mb-2"/>
            <table className="w-full mb-4">
                <tbody>
                <tr>
                    <td className="text-lg font-bold">{text('letter_number')}</td>
                    <td className="text-lg text-left">:</td>
                    <td className="text-lg text-left">{letter.nomor_surat}</td>
                </tr>
                <tr>
                    <td className="text-lg font-bold">{text('letter_date')}</td>
                    <td className="text-lg text-left">:</td>
                    <td className="text-lg text-left">{date}</td>
                </tr>
                <tr>
                    <td className="text-lg font-bold">{text('creator')}</td>
                    <td className="text-lg text-left">:</td>
                    <td className="text-lg text-left">{disposition.creator.name}</td>
                </tr>
                </tbody>
            </table>
            <hr className="border border-gray-700 mb-2"/>
            <div className="mb-4">
                <p className="font-bold text-lg mb-2">{text('disposition_number')}</p>
                <p className="text-lg">
                    {disposition.isi_disposisis.map((isi) => isi.isi_disposisi.isi).join(', ')}
                </p>
            </div>
            <div className="mb-4">
                <p className="font-bold text-lg mb-4">{text('recipient')}</p>
                <div className="flex flex-wrap gap-1">
                    {disposition.log_disposisis.map((log, index) => (
                        <span key={index} className="bg-gray-200 text-lg pt-0 pb-4 px-4 rounded-lg">
                            {log.penerima_user.name} ({text(log.penerima_user.role)})
                        </span>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <p className="font-bold text-lg mb-4">{text('note')}</p>
                <p className="text-lg w-full border border-gray-700 pt-0 pb-4 px-2 rounded min-h-40">{disposition.catatan}</p>
            </div>

            <div className="flex justify-end mt-6 mx-8">
                <Image src={qrCodeUrl} alt="QR Code" className="h-[150px] w-auto" width={300} height={300}/>
            </div>

            <div className="text-center mt-6 text-lg">
                <p className="text-lg">{text('generate_by_sparti')}</p>
            </div>
        </div>
    );
};

export default DispositionPage;
