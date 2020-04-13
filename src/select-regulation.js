export default {
  type: 'select',

  onSetup (instance) {
    this.listboxNode = null
    this.listboxSelectedIndex = 0
    this.setupLlistbox(instance)
  },

  onClick (instance, regulation, targetNode) {
    if (!targetNode.closest('.editable-table__listbox')) {
      this.closeListbox(instance)
    }
  },

  onEdit (instance, regulation, x, y, tdNode) {
    this.listboxSelectedIndex = 0
    for (let i = 0; i < regulation.options.length; i ++) {
      if (regulation.options[i] === instance.params.bodies[y][x]) {
        this.listboxSelectedIndex = i
        break
      }
    }
    if (regulation.options.length > 0) {
      this.openListbox(instance, tdNode, regulation.options)
    }
    return false
  },

  onKeyDown (instance, regulation, keyCode) {
    if (instance.focusType === 'Listbox') {
      const regulation = instance.cellRegulations[instance.cursor.y][instance.cursor.x] || instance.columnRegulations[instance.cursor.x] || {}
      switch (keyCode) {
        case 'ArrowUp': {
          event.preventDefault()
          this.addListboxSelectedIndex(instance, - 1, regulation.options)
          break
        }
        case 'ArrowDown': {
          event.preventDefault()
          this.addListboxSelectedIndex(instance, 1, regulation.options)
          break
        }
        case 'Tab': {
          event.preventDefault()
          this.closeListbox(instance)
          if (event.shiftKey) {
            instance.setCursorToLeft()
          } else {
            instance.setCursorToRight()
          }
          break
        }
        case ' ':
        case 'Space': {
          event.preventDefault()
          this.updateListboxToCell(instance, instance.cursor.x, instance.cursor.y)
          this.closeListbox(instance)
          break
        }
        case 'Escape': {
          this.closeListbox(instance)
          break
        }
      }
    }
  },

  onKeyUp (instance, regulation, keyCode) {
    if (instance.focusType === 'Listbox') {
      switch (keyCode) {
        case 'Enter': {
          this.updateListboxToCell(instance, instance.cursor.x, instance.cursor.y)
          this.closeListbox(instance)
          instance.setCursorToDown()
          break
        }
      }
    }
  },

  onPasteCell (instance, regulation, x, y) {
    return regulation.options.indexOf(instance.clipboard.value) !== - 1
  },

  setupLlistbox (instance) {
    this.listboxNode = document.createElement('ol')
    this.listboxNode.setAttribute('class', 'editable-table__listbox')
    this.listboxNode.style['display'] = 'none'
    instance.containerNode.appendChild(this.listboxNode)
  },

  openListbox (instance, targetNode, options) {
    let selectedItemNode = this.updateListboxChildren(instance, options)
    this.adjustListboxIntoView(instance, targetNode)
    instance.scrollIntoView(this.listboxNode, selectedItemNode, 0, 0)
    instance.setFocus('Listbox')
  },

  updateListboxChildren (instance, options) {
    let selectedItemNode = null
    this.listboxNode.innerHTML = ''
    for (let i = 0; i < options.length; i ++) {
      const itemNode = document.createElement('li')
      const textNode = document.createTextNode(options[i])
      if (i === this.listboxSelectedIndex) {
        selectedItemNode = itemNode
      }
      itemNode.setAttribute('data-selected', i === this.listboxSelectedIndex)
      itemNode.addEventListener('click', (event) => {
        this.listboxSelectedIndex = i
        this.updateListboxToCell(instance, instance.cursor.x, instance.cursor.y)
        this.closeListbox(instance)
      }, false)
      itemNode.appendChild(textNode)
      this.listboxNode.appendChild(itemNode)
    }
    return selectedItemNode
  },

  closeListbox (instance) {
    this.listboxNode.style['display'] = 'none'
    instance.setFocus('Table')
  },

  addListboxSelectedIndex (instance, adding, options) {
    this.listboxNode.children[this.listboxSelectedIndex].setAttribute('data-selected', 'false')
    this.listboxSelectedIndex += adding
    this.listboxSelectedIndex = Math.max(0, Math.min(options.length - 1, this.listboxSelectedIndex))
    this.listboxNode.children[this.listboxSelectedIndex].setAttribute('data-selected', 'true')
    instance.scrollIntoView(this.listboxNode, this.listboxNode.children[this.listboxSelectedIndex], 0, 0)
  },

  updateListboxToCell (instance, x, y) {
    const regulation = instance.cellRegulations[y][x] || instance.columnRegulations[x] || {}
    const value = regulation.options[this.listboxSelectedIndex]
    instance.params.bodies[y][x] = value
    instance.updateCell(x, y)
  },

  adjustListboxIntoView (instance, targetNode) {
    this.listboxNode.style['opacity'] = '0'
    this.listboxNode.style['display'] = ''
    this.listboxNode.style['max-height'] = ''
    let { left, top } = targetNode.getBoundingClientRect()
    const maxHeight = Math.min(this.listboxNode.clientHeight, document.documentElement.clientHeight) - (instance.params.listboxMargin || 0) * 2
    top -= Math.abs(Math.min(document.documentElement.clientHeight - (top + maxHeight + (instance.params.listboxMargin || 0)), 0))
    this.listboxNode.style['left'] = `${left}px`
    this.listboxNode.style['top'] = `${top}px`
    this.listboxNode.style['max-height'] = `${maxHeight}px`
    this.listboxNode.style['opacity'] = ''
  }
}
