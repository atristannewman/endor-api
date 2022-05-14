module.exports = ({ validate }) => {
  return (args) => {
    try {
      validate(args);
      return Object.freeze({
        getName: () => args.name,
        getLocation: () => args.location,
        isActive: () => args.isActive,
        getAccessUrl: () => args.accessUrl,
        getAccessCode: () => args.accessCode,
        getEntryInstruction: () => args.entryInstruction,
      });
    } catch (error) {
      throw error;
    }
  };
};
