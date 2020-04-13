export default {
  type: 'link',

  onEdit (instance, regulation, x, y, tdNode) {
    tdNode.firstChild.click()
    return false
  },

  onUpdateCell (instance, regulation, x, y, tdNode) {
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
