const authService = require("../../services/auth");
const { username, password, user_id } = require("./constants");

describe("Auth Service", () => {
    describe("Login", () => {
        it("Login successful", async () => {
            const data = await authService.login(username, password);

            expect(data.user.username).toBe(username);
        });
        it("Incorrect username", async () => {
            try {
                await authService.login("username", password);
            }
            catch (err) {
                expect(err.message).toBe("Username does not exist");
            }
        });
        it("Incorrect password", async () => {
            try {
                await authService.login(username, "password1");
            }
            catch (err) {
                expect(err.message).toBe("Password is incorrect");
            }
        });
    });
    describe("Register", () => {
        it("Register successful", async () => {
            const data = await authService.register("username", password);

            expect(data.user.username).toBe("username");
        });
        it("Username taken", async () => {
            try {
                await authService.register(username, password);
            }
            catch (err) {
                expect(err.message).toBe("Username is already taken");
            }
        });
    });
    describe("Change Password", () => {
        it("Change Password successful", async () => {
            const data = await authService.updatePassword(user_id, { current_password: password, password: password, confirm_password: password });

            expect(data.status).toBeTruthy();
        });
        it("New passwords are not same", async () => {
            try {
                await authService.updatePassword(user_id, { current_password: password, password: password, confirm_password: "1password" });
            }
            catch (err) {
                expect(err.message).toBe("New passwords must be same.");
            }
        });
        it("Current password is not correct", async () => {
            try {
                await authService.updatePassword(user_id, { current_password: "password1", password: password, confirm_password: password });
            }
            catch (err) {
                expect(err.message).toBe("Current password is incorrect.");
            }
        });
    });
});