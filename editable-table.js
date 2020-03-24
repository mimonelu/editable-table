import './editable-table.scss'

class EditableTable {
  constructor (params) {
    this.params = params
    this.params.headers = this.params.headers || []
    this.params.bodies = this.params.bodies || []
    this.params.focus = this.params.focus || false
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
    window.addEventListener('click', this.onClick.bind(this), false)
    window.addEventListener('dblclick', this.onDoubleClick.bind(this), false)
    window.addEventListener('keydown', this.onKeyDown.bind(this), false)
    this.updateHeaders()
    this.updateBodies()
    this.tableNode.appendChild(this.theadNode)
    this.tableNode.appendChild(this.tbodyNode)
    this.containerNode.appendChild(this.tableNode)
    this.params.containerNode.appendChild(this.containerNode)
    this.setFocus(this.params.focus)
  }

  updateHeaders () {
    if (this.params.headers.length > 0) {
      const trNode = document.createElement('tr')
      for (let i = 0; i < this.params.headers.length; i ++) {
        const thNode = document.createElement('th')
        const textNode = document.createTextNode(this.params.headers[i])
        thNode.appendChild(textNode)
        trNode.appendChild(thNode)
      }
      this.theadNode.appendChild(trNode)
    }
  }

  updateBodies () {
    if (this.params.bodies.length > 0) {
      for (let y = 0; y < this.params.bodies.length; y ++) {
        const trNode = document.createElement('tr')
        for (let x = 0; x < this.params.bodies[y].length; x ++) {
          const tdNode = document.createElement('td')
          this.updateCell(x, y, tdNode)
          tdNode.setAttribute('data-x', x)
          tdNode.setAttribute('data-y', y)
          trNode.appendChild(tdNode)
        }
        this.tbodyNode.appendChild(trNode)
      }
    }
    this.setCursor(0, 0)
  }

  updateCell (x, y, tdNode) {
    if (!tdNode) {
      tdNode = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
    }
    if (tdNode) {
      tdNode.innerHTML = ''
      const textNode = document.createTextNode(this.params.bodies[y][x])
      tdNode.appendChild(textNode)
    }
  }

  setSampleData (rowNumber, columnNumber) {
    this.params.headers.splice(0)
    for (let i = 0; i < columnNumber; i ++) {
      this.params.headers.push(String.fromCharCode(65 + i))
    }
    this.params.bodies.splice(0)
    for (let y = 0; y < rowNumber; y ++) {
      this.params.bodies[y] = []
      for (let x = 0; x < columnNumber; x ++) {
        this.params.bodies[y].push(String.fromCharCode(65 + x) + y)
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

  onClick (event) {
    if (event.target.closest('.editable-table')) {
      this.setFocus(true)
      if (event.target.closest('td')) {
        const x = parseInt(event.target.getAttribute('data-x'), 10)
        const y = parseInt(event.target.getAttribute('data-y'), 10)
        if (this.cursor.x !== x || this.cursor.y !== y) {
          this.setCursor(x, y)
        }
      }
    } else {
      this.setFocus(false)
    }
  }

  onDoubleClick (event) {
    this.startEdit(this.cursor.x, this.cursor.y)
  }

  onKeyDown (event) {
    if (this.params.focus) {

      if (event.key.length === 1) {
        const charCode = event.key.charCodeAt(0)
        if (charCode >= 32 && charCode <= 126) {
          this.startEdit(this.cursor.x, this.cursor.y)
          return
        }
      }

      switch (event.key) {
        case 'ArrowUp': {
          this.setCursor(this.cursor.x, this.cursor.y - 1)
          event.preventDefault()
          break
        }
        case 'ArrowDown': {
          this.setCursor(this.cursor.x, this.cursor.y + 1)
          event.preventDefault()
          break
        }
        case 'ArrowLeft': {
          this.setCursor(this.cursor.x - 1, this.cursor.y)
          event.preventDefault()
          break
        }
        case 'ArrowRight': {
          this.setCursor(this.cursor.x + 1, this.cursor.y)
          event.preventDefault()
          break
        }
        case 'Enter': {
          this.startEdit(this.cursor.x, this.cursor.y)
          break
        }
        case 'Space': {
          event.preventDefault()
          break
        }
        case 'Escape': {
          this.setFocus(false)
          break
        }
      }
    }
  }

  startEdit (x, y, defaultText) {
    if (!this.isEditing) {
      const node = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
      if (node) {
        this.setEditing(true)
        this.setFocus(false)
        node.innerHTML = ''
        const inputNode = document.createElement('input')
        inputNode.setAttribute('type', 'text')
        inputNode.setAttribute('value', defaultText != null ? defaultText : this.params.bodies[y][x])

        let isComposing = false
        inputNode.addEventListener('compositionstart', () => {
          isComposing = true
        }, false)
        inputNode.addEventListener('compositionend', () => {
          isComposing = false
        }, false)

        inputNode.addEventListener('keydown', (event) => {
          if (!isComposing && event.key === 'Enter') {
            event.stopPropagation()
            this.setFocus(true)
            this.setEditing(false)
            this.params.bodies[y][x] = inputNode.value
            this.updateCell(x, y)
          }
        })
        inputNode.addEventListener('blur', (event) => {
          this.setFocus(true)
          this.setEditing(false)
          this.updateCell(x, y)
        }, false)

        node.appendChild(inputNode)
        // NOTICE: DOM ツリー追加後であること
        if (defaultText == null) {
          inputNode.addEventListener('focus', inputNode.select, false)
        } else {
          const length = defaultText.length
          inputNode.setSelectionRange(length, length)
        }
        inputNode.focus()
      }
    }
  }

  removeCursor () {
    const cellOnCursor = this.tableNode.querySelector('[data-cursor="true"]')
    if (cellOnCursor) {
      cellOnCursor.removeAttribute('data-cursor')
    }
  }

  setCursor (x, y) {
    if (this.params.bodies.length > 0 && x >= 0 && y >= 0 && x < this.params.bodies[0].length && y < this.params.bodies.length) {
      this.removeCursor()
      const cell = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
      if (cell) {
        cell.setAttribute('data-cursor', true)
        cell.scrollIntoView(false)
        this.cursor.x = x
        this.cursor.y = y
      }
    }
  }
}

module.exports = EditableTable
