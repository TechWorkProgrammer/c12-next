import {TimeStamp} from "@/interfaces/TimeStamp";
import {User} from "@/interfaces/User";
import {Klasifikasi} from "@/interfaces/LetterIn";

export interface LetterOut extends TimeStamp {
    file_surat: string;
    klasifikasi_surat: Klasifikasi;
    status: "waiting" | "rejected" | "accepted";
    tanggal_surat: string;
    created_by: User;
    perihal: string;
    penerima: PenerimaLetterOut;
}

export interface addLetterOut extends TimeStamp {
    file_surat: File | null;
    tanggal_surat: string;
    perihal: string;
    penerima: User;
}

export interface PenerimaLetterOut extends User {
    read_at?: string | null;
    catatan?: string | null;
    tanda_tangan?: string | null;
}
