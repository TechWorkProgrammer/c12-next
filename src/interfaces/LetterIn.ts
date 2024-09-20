import {User, UserStatus} from "@/interfaces/User";
import {TimeStamp} from "@/interfaces/TimeStamp";

export interface DetailLetterIn extends TimeStamp {
    file_surat: string;
    nomor_surat: string;
    klasifikasi_surat: Klasifikasi;
    tanggal_surat: string;
    pengirim: string;
    creator: User;
    perihal: string;
    read_at: string;
    penerima: User;
    user_status: UserStatus;
}

export interface addLetterIn {
    file_surat: File | null;
    klasifikasi_surat: Klasifikasi;
    tanggal_surat: string | null;
    pengirim: string;
    perihal: string;
    penerima: User;
}

export interface DetailLetterIn extends DetailLetterIn {
    disposisi: Disposisi | null;
    log_status: UserStatus[];
}

export interface Disposisi extends TimeStamp {
    disposisi_asal: null;
    isi_disposisi: IsiDisposisi[];
    catatan: string;
    tanda_tangan: string
    creator: User;
    disposisi_level2: DisposisiLevel2[];
    log_disposisis: LogDisposisi[];
}

export interface DisposisiLevel2 extends TimeStamp {
    disposisi_asal: Disposisi | null;
    isi_disposisi: IsiDisposisi[];
    catatan: string;
    tanda_tangan: string;
    creator: User;
    disposisi_level3: DisposisiLevel3[];
    log_disposisis: LogDisposisi[];
}

export interface DisposisiLevel3 extends TimeStamp {
    disposisi_asal: DisposisiLevel2 | null;
    isi_disposisi: IsiDisposisi[];
    catatan: string;
    tanda_tangan: string;
    creator: User;
    log_disposisis: LogDisposisi[];
}

export interface LogDisposisi extends TimeStamp {
    uuid: string;
    pengirim: string;
    penerima: string;
    disposisi_id: string;
    penerima_user: User;
}

export interface UserWithRead extends User {
    read_at: string | null;
    pelaksanaan_at: string | null;
}

export interface Klasifikasi extends TimeStamp {
    name: string;
}

export interface IsiDisposisi extends TimeStamp {
    isi: string;
}
