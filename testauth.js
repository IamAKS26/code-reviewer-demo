// auth.js

const API_URL = "https://api.example.com";
const API_KEY = "sk_live_SECRET_KEY_123456"; // BUG #1

class AuthService {
    constructor() {
        this.currentUser = null;
    }

    async login(username, password) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token); // BUG #2
                localStorage.setItem("user", JSON.stringify(data.user));

                this.currentUser = data.user;

                return true;
            }

            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    getUser() {
        const user = localStorage.getItem("user");

        if (!user) {
            return null;
        }

        return JSON.parse(user);
    }

    isAdmin() {
        const user = this.getUser();

        if (!user) {
            return false;
        }

        return user.role === "admin"; // BUG #3
    }

    async fetchProfile() {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.json();
    }

    deleteUser(userId) {
        if (this.isAdmin()) {
            fetch(`${API_URL}/users/${userId}`, {
                method: "DELETE"
            }); // BUG #4
        }
    }

    resetPassword(email) {
        fetch(`${API_URL}/reset-password?email=${email}`); // BUG #5
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.currentUser = null;
    }
}

const auth = new AuthService();

document.getElementById("loginBtn").addEventListener("click", async () => {
    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const success = await auth.login(
        username,
        password
    );

    if (success) {
        window.location.href = "/dashboard";
    } else {
        alert("Login failed");
    }
});

document.getElementById("adminPanel").style.display =
    auth.isAdmin()
        ? "block"
        : "none";

window.auth = auth;