import { TimeStamp } from "@/interfaces/TimeStamp";
import {LetterIn} from "@/interfaces/LetterIn";

export interface Log extends TimeStamp {
    uuid: string;
    user_id: string;
    surat_masuk_id: string;
    read_at: string | null;
    pelaksanaan_at: string | null;
    created_at: string;
    updated_at: string;
    surat_masuk: LetterIn;
}

export interface DispositionLog extends TimeStamp {
    uuid: string;
    surat_id: string;
    disposisi_asal: string | null;
    catatan: string;
    tanda_tangan: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}
