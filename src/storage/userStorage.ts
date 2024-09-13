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

export function loginUser(email: string, password: string): User | null {
    const users = getUsers();
    const user = users.find(
        (user) => user.email === email && user.password === password
    );
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        return user;
    } else {
        return null;
    }
}

export function getCurrentUser(): User | null {
    if (typeof window !== "undefined") {
        const currentUser = localStorage.getItem("currentUser");
        return currentUser ? JSON.parse(currentUser) : null;
    }
    return null;
}

export function logoutUser(): void {
    localStorage.removeItem("currentUser");
}
