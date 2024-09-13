import {TimeStamp} from "@/interfaces/TimeStamp";

//  ada surat diterima entah dari tu atau disposisi, lsg dapet email.

export interface User extends TimeStamp, Role {
    name: string;
    email: string;
    password?: string | null; // abaikan null, buat ga keliatan aja pw nya
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
