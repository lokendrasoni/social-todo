const userService = require("../../services/user");
const { user_id, todo_id} = require("./constants");

describe("Users Service", () => {
    describe("List", () => {
        it("User list", async () => {
            const data = await userService.list({ page: 1, limit: 10, sortField: "created_at", sortOrder: "desc" });

            expect(data.data).toBeDefined();
        });
        it("User list - Ascending Sort", async () => {
            const data = await userService.list({ page: 1, limit: 10, sortField: "created_at", sortOrder: "asc" });

            expect(data.data).toBeDefined();
        });
        it("User list - No parameters", async () => {
            const data = await userService.list({});

            expect(data.data).toBeDefined();
        });
    });
    describe("Get User", () => {
        it("Get User", async () => {
            const data = await userService.get(user_id);

            expect(data.id).toBe(user_id);
        });
        it("User not found", async () => {
            try {
                await userService.get(todo_id);
            }
            catch (err) {
                expect(err.message).toBe("User does not exist");
            }
        });
    });
});