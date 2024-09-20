import {TimeStamp} from "@/interfaces/TimeStamp";


export interface User extends TimeStamp, Role {
    name: string;
    email: string;
    password?: string | null;
    jabatan?: string;
}

export interface UserStatus extends TimeStamp {
    user_id: string | null;
    read_at: string | null;
    pelaksanaan_at: string | null;
}

export interface EditUser {
    password: string;
    new_password: string;
    repeat_new_password: string;
}

export interface CreateUser extends Role {
    name: string;
    email: string;
    password: string;
}

export interface Role {
    role: "Tata usaha" | "Pejabat" | "Pelaksana" | "Administrator" | "External";
    pejabat?: Pejabat | null;
}

export interface Pejabat extends TimeStamp {
    name: string;
    atasan_id?: Pejabat | null;
}
