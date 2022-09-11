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
          
          const tagArgs = JSON.parse(JSON.stringify(args.tags));
          return tagArgs;
          
        },
        getHost: () => args.host
      });

      console.log(`return object: ${returnObject}`);
      

      return returnObject;
    } catch (error) {
      throw error;
    }
  };
};