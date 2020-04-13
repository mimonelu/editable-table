export default {
  type: 'button',

  onEdit (instance, regulation, x, y, tdNode) {
    if (regulation.callback != null) {
      regulation.callback(x, y)
    }
    return false
  },

  onUpdateCell (instance, regulation, x, y, tdNode) {
    const buttonNode = document.createElement('div')
    const textNode = document.createTextNode(instance.params.bodies[y][x])
    buttonNode.addEventListener('click', () => {
      instance.setCursor(x, y, false)
      if (regulation.callback != null) {
        regulation.callback(x, y)
      }
    }, false)
    buttonNode.appendChild(textNode)
    tdNode.appendChild(buttonNode)
    return false
  }
}
