import {User} from "@/interfaces/user";
import {TimeStamp} from "@/interfaces/timeStamp";

export interface LetterIn extends TimeStamp {
    file_surat: string;
    no_surat: string;
    klasifikasi_surat: Klasifikasi;
    tanggal_surat: string;
    pengirim: User;
    created_by: User;
    perihal: string;
    read_at: string;
    penerima: User;
    disposisi: Disposisi[];
}

export interface addLetterIn {
    file_surat: File | null;
    klasifikasi_surat: Klasifikasi;
    tanggal_surat: string;
    created_by: User;
    perihal: string;
    penerima: User;
}

export interface Disposisi extends TimeStamp {
    disposisi_asal: Disposisi | null;
    isi: IsiDisposisi[];
    catatan: string;
    tanda_tangan: string
    created_by: User;
    penerima: UserWithRead[];
}

export interface UserWithRead extends User {
    read_at: string | null;
    pelaksanaan_at: string | null;
}

export interface Klasifikasi extends TimeStamp {
    name: 'rahasia' | 'biasa' | 'segera';
}

export interface IsiDisposisi extends TimeStamp {
    isi: string;
}
