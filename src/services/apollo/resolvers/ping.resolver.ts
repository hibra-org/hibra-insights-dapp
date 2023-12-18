const pingResolvers = {
  Query: {
    ping: () => {
      return {
        status: true,
      };
    },
  },
};

export { pingResolvers };
