import {Identifiable} from "@/interfaces/Identifiable";

export interface TimeStamp extends Identifiable {
    created_at: string;
    updated_at: string;
}

