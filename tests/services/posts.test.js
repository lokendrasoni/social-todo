const postService = require("../../services/post");
const { user_id } = require("./constants");

describe("Posts Service", () => {
    describe("List", () => {
        it("Post list", async () => {
            const data = await postService.list({ user_id, page: 1, limit: 10, sortField: "created_at", sortOrder: "desc" });

            expect(data.data).toBeDefined();
        });
        it("Post list - Ascending Sort", async () => {
            const data = await postService.list({ user_id, page: 1, limit: 10, sortField: "created_at", sortOrder: "asc" });

            expect(data.data).toBeDefined();
        });
        it("Post list - No parameters", async () => {
            const data = await postService.list({ });

            expect(data.data).toBeDefined();
        });
    });
});