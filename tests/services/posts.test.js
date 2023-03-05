const postService = require("../../services/post");
const { user_id, post_id, post_id1 } = require("./constants");

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
            const data = await postService.list({});

            expect(data.data).toBeDefined();
        });
    });
    describe("Get Post", () => {
        it("Get Post", async () => {
            const data = await postService.get({ id: post_id, page: 1, limit: 10, sortField: "created_at", sortOrder: "desc" });

            expect(data.id).toBe(post_id);
        });
        it("Post not found", async () => {
            try {
                await postService.get({ id: user_id });
            }
            catch (err) {
                expect(err.message).toBe("Post does not exist");
            }
        });
    });
    describe("Create post", () => {
        it("Create Post", async () => {
            const data = await postService.create({ user_id, title: "new post", body: "from jest" });

            expect(data.title).toBe("new post");
        });
    });
    describe("Create comment", () => {
        it("Post a comment", async () => {
            const data = await postService.createComment({ post_id: post_id, user_id: user_id, body: "Comment from jest" });

            expect(data.comment).toBe("Comment from jest");
        });
        it("Post not found - FOR COMMENT", async () => {
            try {
                await postService.createComment({ post_id: user_id });
            }
            catch (err) {
                expect(err.message).toBe("Post does not exist");
            }
        });
    });
    describe("Edit post", () => {
        it("Edit post title", async () => {
            const data = await postService.editPost({ post_id: post_id, user_id: user_id, title: "edited title", user_type: "user" });

            expect(data.title).toBe("edited title");
        });
        it("Edit post body", async () => {
            const data = await postService.editPost({ post_id: post_id, user_id: user_id, body: "edited body", user_type: "user" });

            expect(data.body).toBe("edited body");
        });
        it("Edit post - Not admin/user", async () => {
            try {
                await postService.editPost({ post_id: post_id, user_id: post_id, body: "edited body", user_type: "user" });
            }
            catch (err) {
                expect(err.message).toBe("User is not allowed to edit the post");
            }
        });
        it("Post not found - FOR EDIT POST", async () => {
            try {
                await postService.editPost({ post_id: user_id });
            }
            catch (err) {
                expect(err.message).toBe("Post does not exist");
            }
        });
    });
    describe("Delete post", () => {
        it("Delete post title", async () => {
            const data = await postService.deletePost({ post_id: post_id1, user_id: user_id});

            expect(data).toBeTruthy();
        });
        it("Delete post - Not admin/user", async () => {
            try {
                await postService.deletePost({ post_id: post_id, user_id: post_id, body: "edited body", user_type: "user" });
            }
            catch (err) {
                expect(err.message).toBe("User is not allowed to edit the post");
            }
        });
        it("Post not found - FOR DELETE POST", async () => {
            try {
                await postService.deletePost({ post_id: user_id });
            }
            catch (err) {
                expect(err.message).toBe("Post does not exist");
            }
        });
    });
});