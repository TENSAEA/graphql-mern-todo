import Todo from "../models/todo.model.js";

const resolvers = {
  Query: {
    todos: async () => {
      return await Todo.find();
    },
    todo: async (_, { id }) => {
      return await Todo.findById(id);
    },
  },
  Mutation: {
    createTodo: async (_, { title }) => {
      const newTodo = new Todo({ title });
      await newTodo.save();
      return newTodo;
    },
    updateTodo: async (_, { id, title, completed }) => {
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { title, completed, updatedAt: new Date() },
        { new: true }
      );
      return updatedTodo;
    },
    deleteTodo: async (_, { id }) => {
      const deletedTodo = await Todo.findByIdAndRemove(id);
      return deletedTodo;
    },
  },
};

export default resolvers;
