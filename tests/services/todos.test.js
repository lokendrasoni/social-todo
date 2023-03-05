const todoService = require("../../services/todo");
const { user_id, todo_id, todo_id1 } = require("./constants");

describe("Todos Service", () => {
    describe("List", () => {
        it("Todo list", async () => {
            const data = await todoService.list({ user_id, page: 1, limit: 10, sortField: "created_at", sortOrder: "desc" });

            expect(data.data).toBeDefined();
        });
        it("Todo list - Ascending Sort", async () => {
            const data = await todoService.list({ user_id, page: 1, limit: 10, sortField: "created_at", sortOrder: "asc" });

            expect(data.data).toBeDefined();
        });
        it("Todo list - No parameters", async () => {
            const data = await todoService.list({});

            expect(data.data).toBeDefined();
        });
    });
    describe("Get Todo", () => {
        it("Get Todo", async () => {
            const data = await todoService.get(todo_id);

            expect(data.id).toBe(todo_id);
        });
        it("Todo not found", async () => {
            try {
                await todoService.get(user_id);
            }
            catch (err) {
                expect(err.message).toBe("Todo does not exist");
            }
        });
    });
    describe("Create todo", () => {
        it("Create Todo", async () => {
            const data = await todoService.create({ user_id, title: "new todo", body: "from jest" });

            expect(data.title).toBe("new todo");
        });
    });
    describe("Edit todo", () => {
        it("Edit todo title", async () => {
            const data = await todoService.editTodo({ todo_id: todo_id, user_id: user_id, title: "edited title", user_type: "user" });

            expect(data.title).toBe("edited title");
        });
        it("Edit todo body", async () => {
            const data = await todoService.editTodo({ todo_id: todo_id, user_id: user_id, body: "edited body", user_type: "user" });

            expect(data.body).toBe("edited body");
        });
        it("Edit todo status", async () => {
            const data = await todoService.editTodo({ todo_id: todo_id, user_id: user_id, status: "completed", user_type: "user" });

            expect(data.status).toBe("completed");
        });
        it("Edit todo - Not admin/user", async () => {
            try {
                await todoService.editTodo({ todo_id: todo_id, user_id: todo_id, user_type: "user" });
            }
            catch (err) {
                expect(err.message).toBe("User is not allowed to edit the todo");
            }
        });
        it("Todo not found - FOR EDIT POST", async () => {
            try {
                await todoService.editTodo({ todo_id: user_id });
            }
            catch (err) {
                expect(err.message).toBe("Todo does not exist");
            }
        });
    });
    describe("Delete todo", () => {
        it("Delete todo title", async () => {
            const data = await todoService.deleteTodo({ todo_id: todo_id1, user_id: user_id});

            expect(data).toBeTruthy();
        });
        it("Delete todo - Not admin/user", async () => {
            try {
                await todoService.deleteTodo({ todo_id: todo_id, user_id: todo_id, body: "edited body", user_type: "user" });
            }
            catch (err) {
                expect(err.message).toBe("User is not allowed to edit the todo");
            }
        });
        it("Todo not found - FOR DELETE POST", async () => {
            try {
                await todoService.deleteTodo({ todo_id: user_id });
            }
            catch (err) {
                expect(err.message).toBe("Todo does not exist");
            }
        });
    });
});