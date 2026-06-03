import { createUser, findUserByUsername, validatePassword } from "../services/user.service.js";

const loginPage = (req, res) => {
    res.render("login", {
        title: "Login",
        errors: req.query.errors || null
    });
};

const registerPage = (req, res) => {
    res.render("register", {
        title: "Register",
        errors: req.query.errors || null
    });
};

const register = async (req, res) => {
    const { username, password, confirm, role } = req.body;

    if (!username || !password || password !== confirm) {
        return res.redirect("/register?errors=Invalid registration details");
    }

    await createUser(username, password, role);
    return res.redirect("/login");
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);

    if (!user || !(await validatePassword(password, user.password))) {
        return res.redirect("/login?errors=Invalid credentials");
    }
    req.session.user = { userId: user.userId, username: user.username, role: user.role };

    return res.redirect("/dashboard");
};

const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    return next();
};

const hasRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.redirect("/dashboard");
    }
    return next();
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};

export default { loginPage, registerPage, register, login, isLoggedIn, hasRole, logout };
