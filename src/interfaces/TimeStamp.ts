import {Identifiable} from "@/interfaces/identifiable";

export interface TimeStamp extends Identifiable {
    created_at: string;
    updated_at: string;
}

