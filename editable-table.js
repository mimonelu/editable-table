import './editable-table.scss'

class EditableTable {
  constructor (params) {
    this.params = params
    this.params.headers = this.params.headers || []
    this.params.bodies = this.params.bodies || []
    this.params.focus = !!this.params.focus
    this.params.forceConversion = !!this.params.forceConversion
    this.containerNode = null
    this.tableNode = null
    this.theadNode = null
    this.tbodyNode = null
    this.cursor = { x: 0, y: 0 }
    this.isEditing = false
    this.appendTable()
  }

  appendTable () {
    this.containerNode = document.createElement('div')
    this.tableNode = document.createElement('table')
    this.theadNode = document.createElement('thead')
    this.tbodyNode = document.createElement('tbody')
    this.containerNode.setAttribute('class', 'editable-table')
    this.updateHeaders()
    this.updateBodies()
    this.tableNode.appendChild(this.theadNode)
    this.tableNode.appendChild(this.tbodyNode)
    this.containerNode.appendChild(this.tableNode)
    this.params.containerNode.appendChild(this.containerNode)
    this.setFocus(this.params.focus)
    window.addEventListener('click', this.onClick.bind(this), false)
    window.addEventListener('dblclick', this.onDoubleClick.bind(this), false)
    window.addEventListener('keydown', this.onKeyDown.bind(this), false)
  }

  updateHeaders () {
    if (this.params.headers.length > 0) {
      const trNode = document.createElement('tr')
      this.appendHeader(trNode, '')
      for (let i = 0; i < this.params.headers.length; i ++) {
        this.appendHeader(trNode, this.params.headers[i])
      }
      this.theadNode.appendChild(trNode)
    }
  }

  appendHeader (trNode, text) {
    const thNode = document.createElement('th')
    const textNode = document.createTextNode(text)
    thNode.appendChild(textNode)
    trNode.appendChild(thNode)
  }

  updateBodies () {
    const height = this.getHeight()
    for (let y = 0; y < height; y ++) {
      const trNode = document.createElement('tr')
      this.appendBodyHeader(trNode, y)
      for (let x = 0; x < this.params.bodies[y].length; x ++) {
        const tdNode = document.createElement('td')
        this.updateCell(x, y, tdNode)
        tdNode.setAttribute('data-x', x)
        tdNode.setAttribute('data-y', y)
        trNode.appendChild(tdNode)
      }
      this.tbodyNode.appendChild(trNode)
    }
    this.setCursor(0, 0)
  }

  appendBodyHeader (trNode, y) {
    const thNode = document.createElement('th')
    const textNode = document.createTextNode(y + 1)
    thNode.setAttribute('data-y', y)
    thNode.appendChild(textNode)
    trNode.appendChild(thNode)
  }

  updateCell (x, y, tdNode) {
    if (!tdNode) {
      tdNode = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
    }
    if (tdNode) {
      const type = typeof this.params.bodies[y][x]
      tdNode.setAttribute('data-type', type)
      tdNode.innerHTML = ''
      if (type === 'boolean') {
        tdNode.setAttribute('data-checked', this.params.bodies[y][x].toString())
      } else {
        const textNode = document.createTextNode(this.params.bodies[y][x])
        tdNode.appendChild(textNode)
      }
    }
  }

  setSampleData (rowNumber, columnNumber) {
    this.params.headers.splice(0)
    for (let i = 0; i < columnNumber; i ++) {
      const value = String.fromCharCode(65 + i)
      this.params.headers.push(value)
    }
    this.params.bodies.splice(0)
    for (let y = 0; y < rowNumber; y ++) {
      this.params.bodies[y] = []
      for (let x = 0; x < columnNumber; x ++) {
        const value = (x % 3) === 0 ? (Math.random() >= 0.5) :
          (x % 3) === 1 ? (Math.floor(Math.random() * 201) - 100) :
          (String.fromCharCode(65 + x) + y)
        this.params.bodies[y].push(value)
      }
    }
    this.updateHeaders()
    this.updateBodies()
  }

  setFocus (value) {
    this.params.focus = value
    this.containerNode.setAttribute('data-focus', this.params.focus)
  }

  setEditing (value) {
    this.isEditing = value
    this.containerNode.setAttribute('data-editing', this.isEditing)
  }

  edit (x, y, selected) {
    if (!this.isEditing) {
      const node = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
      if (node) {

        const type = node.getAttribute('data-type')
        if (type === 'boolean') {
          this.params.bodies[y][x] = !this.params.bodies[y][x]
          this.updateCell(x, y)
        } else {
          this.setEditing(true)
          this.setFocus(false)
          node.innerHTML = ''
          const inputNode = document.createElement('input')
          inputNode.setAttribute('type', 'text')
          inputNode.setAttribute('value', this.params.bodies[y][x])

          inputNode.addEventListener('keydown', (event) => {
            // TODO: Safari で常に false の疑い
            if (!event.isComposing) {
              if (event.code === 'Enter' || event.code === 'Tab') {
                event.preventDefault()
                event.stopPropagation()
                this.setFocus(true)
                this.setEditing(false)
                if (this.params.forceConversion) {
                  const value = type === 'boolean' ? Boolean(inputNode.value) : type === 'number' ? Number(inputNode.value) : inputNode.value
                  this.params.bodies[y][x] = value
                } else {
                  this.params.bodies[y][x] = inputNode.value
                }
                this.updateCell(x, y)
                if (event.code === 'Enter') {
                  this.setCursorToDown()
                } else if (event.code === 'Tab') {
                  if (event.shiftKey) {
                    this.setCursorToLeft()
                  } else {
                    this.setCursorToRight()
                  }
                }
              } else if (event.code === 'Escape') {
                event.stopPropagation()
                this.setFocus(true)
                this.setEditing(false)
                this.updateCell(x, y)
              }
            }
          })
          inputNode.addEventListener('blur', (event) => {
            this.setFocus(true)
            this.setEditing(false)
            this.updateCell(x, y)
          }, false)

          node.appendChild(inputNode)
          // NOTICE: DOM ツリー追加後であること
          if (selected) {
            inputNode.addEventListener('focus', inputNode.select, false)
          } else {
            const length = String(this.params.bodies[y][x]).length
            inputNode.setSelectionRange(length, length)
          }
          inputNode.focus()
        }
      }
    }
  }

  removeCursor () {
    const cellOnCursor = this.tableNode.querySelector('[data-cursor="true"]')
    if (cellOnCursor) {
      cellOnCursor.removeAttribute('data-cursor')
    }
  }

  setCursor (x, y, enableScroll = true) {
    if (this.isCursorValid(x, y)) {
      this.removeCursor()
      const cell = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
      if (cell) {
        cell.setAttribute('data-cursor', true)
        if (enableScroll) {
          cell.scrollIntoView({
            block: 'center',
            inline: 'center'
          })
        }
        this.cursor.x = x
        this.cursor.y = y
      }
    }
  }

  setCursorToLeft () {
    this.setCursor(this.cursor.x - 1, this.cursor.y)
  }

  setCursorToRight () {
    this.setCursor(this.cursor.x + 1, this.cursor.y)
  }

  setCursorToUp () {
    this.setCursor(this.cursor.x, this.cursor.y - 1)
  }

  setCursorToDown () {
    this.setCursor(this.cursor.x, this.cursor.y + 1)
  }

  setCursorToLeftEnd () {
    this.setCursor(0, this.cursor.y)
  }

  setCursorToRightEnd () {
    this.setCursor(this.getWidth() - 1, this.cursor.y)
  }

  setCursorToTop () {
    this.setCursor(this.cursor.x, 0)
  }

  setCursorToBottom () {
    this.setCursor(this.cursor.x, this.getHeight() - 1)
  }

  setCursorToNext () {
    const { x, y } = this.cursor
    if (this.isCursorValid(x - 1, y)) {
      this.setCursor(x - 1, y)
    } else if (this.isCursorValid(this.getWidth() - 1, y - 1)) {
      this.setCursor(this.getWidth() - 1, y - 1)
    } else {
      this.setCursor(this.getWidth() - 1, this.getHeight() - 1)
    }
  }

  setCursorToPrevious () {
    const { x, y } = this.cursor
    if (this.isCursorValid(x + 1, y)) {
      this.setCursor(x + 1, y)
    } else if (this.isCursorValid(0, y + 1)) {
      this.setCursor(0, y + 1)
    } else {
      this.setCursor(0, 0)
    }
  }

  isCursorValid (x, y) {
    return x >= 0 && y >= 0 && x < this.getWidth() && y < this.getHeight()
  }

  getWidth () {
    return this.params.bodies.length > 0 ? this.params.bodies[0].length : 0
  }

  getHeight () {
    return this.params.bodies.length
  }

  onClick (event) {
    if (event.target.closest('.editable-table')) {
      this.setFocus(true)
      if (event.target.closest('td')) {
        const x = parseInt(event.target.getAttribute('data-x'), 10)
        const y = parseInt(event.target.getAttribute('data-y'), 10)
        if (this.cursor.x !== x || this.cursor.y !== y) {
          this.setCursor(x, y, false)
        }
      }
    } else {
      this.setFocus(false)
    }
  }

  onDoubleClick (event) {
    this.edit(this.cursor.x, this.cursor.y, false)
  }

  onKeyDown (event) {
    if (!this.params.focus) {
      return
    }
    const type = typeof this.params.bodies[this.cursor.y][this.cursor.x]
    switch (event.code) {
      case 'ArrowLeft': {
        if (event.metaKey) {
          this.setCursorToLeftEnd()
        } else {
          this.setCursorToLeft()
        }
        event.preventDefault()
        break
      }
      case 'ArrowRight': {
        if (event.metaKey) {
          this.setCursorToRightEnd()
        } else {
          this.setCursorToRight()
        }
        event.preventDefault()
        break
      }
      case 'ArrowUp': {
        if (event.metaKey) {
          this.setCursorToTop()
        } else {
          this.setCursorToUp()
        }
        event.preventDefault()
        break
      }
      case 'ArrowDown': {
        if (event.metaKey) {
          this.setCursorToBottom()
        } else {
          this.setCursorToDown()
        }
        event.preventDefault()
        break
      }
      case 'Tab': {
        if (event.shiftKey) {
          this.setCursorToNext()
        } else {
          this.setCursorToPrevious()
        }
        event.preventDefault()
        break
      }
      case 'Enter': {
        this.edit(this.cursor.x, this.cursor.y, false)
        break
      }
      case 'Space': {
        if (type === 'boolean') {
          this.edit(this.cursor.x, this.cursor.y, false)
          event.preventDefault()
        } else {
          this.onEtceteraKeyDown(event)
        }
        break
      }
      case 'Escape': {
        this.setFocus(false)
        break
      }
      default: {
        this.onEtceteraKeyDown(event)
        break
      }
    }
  }

  onEtceteraKeyDown (event) {
    if (event.key.length === 1) {
      const charCode = event.key.charCodeAt(0)
      if (charCode >= 32 && charCode <= 126) {
        this.edit(this.cursor.x, this.cursor.y, true)
        return
      }
    }
  }
}

module.exports = EditableTable
