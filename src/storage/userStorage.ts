import {User} from "@/interfaces/User";
import usersData from "@/data/users.json";

function initializeUsers() {
    if (typeof window !== "undefined") {
        localStorage.setItem("users", JSON.stringify(usersData));
    }
}

initializeUsers();

export function getUsers(): User[] {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
}
