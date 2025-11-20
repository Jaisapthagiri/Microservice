// Store socket instance and user mapping
export const userSocketMap = {};
export let io = null;

export const setIO = (ioInstance) => {
  io = ioInstance;
};
