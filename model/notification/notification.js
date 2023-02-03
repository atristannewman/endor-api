/* eslint-disable no-useless-catch */
module.exports = ({ validate }) => {
    return (args) => {
      try {
        validate(args);
        console.log("forming notification return object")
        const returnObject = Object.freeze({
          getTopic: () => args.topic,
          getDeviceTokenQueue: () => {
            const deviceTokenQueueArgs = JSON.parse(JSON.stringify(args.deviceTokenQueue));
            return deviceTokenQueueArgs;
          },
          getSubscriberDeviceTokens: () => {
            const subscriberDeviceTokensArgs = JSON.parse(JSON.stringify(args.deviceTokenQueue));
            return subscriberDeviceTokensArgs;
          }
        });

        return returnObject;
      } catch (error) {
        throw error;
      }
    };
};
  