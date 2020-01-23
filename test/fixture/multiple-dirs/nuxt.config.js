module.exports = {
  rootDir: __dirname,
  render: {
    resourceHints: false
  },
  modules: [
    { handler: require('../../../') }
  ],
  globalComponents: {
    dir: ['libs', 'external']
  }
}
