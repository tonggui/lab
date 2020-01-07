export default class Module {
  constructor (api = {}, defaultState = {}) {
    this.api = api
    this.initState = { ...defaultState }
  }
}
