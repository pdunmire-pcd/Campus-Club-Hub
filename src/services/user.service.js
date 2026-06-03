import db from "../db/db.js";
import bcrypt from "bcrypt";

export const findUserByUsername = async (username) => {
    const [results] = await db.query(
        "SELECT userId, username, password, role FROM users WHERE username = ? LIMIT 1",
        [username]
    );
    return results[0];
};

export async function createUser(username, password, role = "user") {
    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashedPassword, role]
    );

    return {
        userId: result.insertId,
        username,
        role
    };
};

export async function validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}