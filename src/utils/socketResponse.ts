const socketResponse = async (status: boolean, data: any, message: string) => {
  return {
    status: status,
    data: data,
    message: message,
  };
};

export { socketResponse };
