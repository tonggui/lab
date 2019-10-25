export const fetching = (commit, fetch) => async (...args) => {
  try {
    commit('loading', true)
    const data = await fetch(...args)
    commit('error', false)
    return data
  } catch (err) {
    console.error(err)
    commit('error', true)
  } finally {
    commit('loading', false)
  }
}
