module.exports = ({ validate }) => {
  return (args) => {
    try {
      validate(args);
      return Object.freeze({
        getName: () => args.name,
        getAddress: () => args.address,
        getStartTime: () => args.startTime,
        getEndTime: () => args.endTime,
        getHost: () => args.host,
        getTags: () => args.tags
      });
    } catch (error) {
      throw error;
    }
  };
};
