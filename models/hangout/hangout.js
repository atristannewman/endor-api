/* eslint-disable no-useless-catch */
module.exports = ({ validate }) => {
  return (args) => {
    try {
      validate(args);
      const returnObject = Object.freeze({
        getName: () => args.name,
        getAddress: () => args.address,
        getStartTime: () => args.startTime,
        getEndTime: () => args.endTime,
        getTags: () => {
          console.log('args.tags: ', args.tags);
          const tagArgs = args.tags
            ? JSON.parse(JSON.stringify(args.tags))
            : [];
          return tagArgs;
        },
        getHost: () => args.host,
        getType: () => args.type,
        getUserId: () => args.userId,
      });

      return returnObject;
    } catch (error) {
      throw error;
    }
  };
};
