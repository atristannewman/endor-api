/* eslint-disable no-useless-catch */
module.exports = ({ validate }) => {
    return (args) => {
      try {
        console.log("notification model")
        validate(args);
        console.log("forming notification return object")
        const returnObject = Object.freeze({
          getTopic: () => args.topic,
          getDeviceTokenQueue: () => {
            const deviceTokenQueueArgs = JSON.parse(JSON.stringify(args.deviceTokenQueue));
            return deviceTokenQueueArgs;
          },
          getSubscriberDeviceTokens: () => {
            const subscriberDeviceTokensArgs = JSON.parse(JSON.stringify(args.subscriberDeviceTokens));
            return subscriberDeviceTokensArgs;
          },
          getTopicId: () => args.topicId
        });

        return returnObject;
      } catch (error) {
        throw error;
      }
    };
};
  