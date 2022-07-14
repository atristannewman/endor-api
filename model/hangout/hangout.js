module.exports = ({ validate }) => {
  return (args) => {
    try {
      validate(args);
      const returnObject = Object.freeze({
        getName: () => args.name,
        getAddress: () => args.address,
        getStartTime: () => args.startTime,
        getEndTime: () => args.endTime,
        getHost: () => args.host,
        getTags: () => {
          const tagArgs = JSON.parse(args.tags);
          return Array(tagArgs);
        }
      });

      console.log(`return object: ${returnObject.tags}`);
      

      return returnObject;
    } catch (error) {
      throw error;
    }
  };
};