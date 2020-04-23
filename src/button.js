export default {
  type: 'button',

  onBackspaceKeyDown () {
    return false
  },

  onEdit (instance, extension, x, y, tdNode) {
    if (extension.callback != null) {
      extension.callback(x, y)
    }
    return false
  },

  onUpdateCell (instance, extension, x, y, tdNode) {
    const buttonNode = document.createElement('div')
    const textNode = document.createTextNode(instance.params.bodies[y][x])
    buttonNode.addEventListener('click', () => {
      instance.setCursor(x, y, false)
      if (extension.callback != null) {
        extension.callback(x, y)
      }
    }, false)
    buttonNode.appendChild(textNode)
    tdNode.appendChild(buttonNode)
    return false
  }
}
