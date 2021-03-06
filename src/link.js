export default {
  type: 'link',

  onBackspaceKeyDown () {
    return false
  },

  onEtceteraKeyDown () {
    return false
  },

  onEdit (instance, extension, x, y, tdNode) {
    tdNode.firstChild.click()
    return false
  },

  onUpdateCell (instance, extension, x, y, tdNode) {
    const linkNode = document.createElement('a')
    linkNode.setAttribute('href', instance.params.bodies[y][x])
    linkNode.setAttribute('target', '_blank')
    linkNode.setAttribute('rel', 'noreferrer')
    const textNode = document.createTextNode(instance.params.bodies[y][x])
    linkNode.appendChild(textNode)
    tdNode.appendChild(linkNode)
    return false
  }
}
