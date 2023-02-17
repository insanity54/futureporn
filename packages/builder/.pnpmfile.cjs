module.exports = {
  hooks: {
    readPackage: (pkg) => {
      if (pkg.name === "winston") {
        pkg.dependencies['logform'] = '^5.2.1';
      }
      return pkg;
    }
  }
};
