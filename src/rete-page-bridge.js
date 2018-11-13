let reteEngine = null

export function init (engine) {
  reteEngine = engine
}

export function bindPageElement (id) {
  const node = Object.values(reteEngine.data.nodes).find(({ data: { elmId } }) => id === elmId)
  if (!node) throw new Error('找不到对应的node')

  return node._run
}

export default {
  init,
  bindPageElement
}
