export default (source, defaultValue, handler, options = { needSourceLoaded: false }) => ({
  source,
  defaultValue,
  handler,
  ...options
})
