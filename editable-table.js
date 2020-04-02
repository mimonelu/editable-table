const FocusType = {
  None: 0,
  Table: 1,
  Listbox: 2
}

class EditableTable {
  constructor (params) {
    this.params = params
    this.params.headers = this.params.headers || []
    this.params.bodies = this.params.bodies || []
    this.params.forceConversion = !!this.params.forceConversion
    this.focus = !!this.params.focus ? FocusType.Table : FocusType.None
    this.regulations = []
    this.containerNode = null
    this.tableNode = null
    this.theadNode = null
    this.tbodyNode = null
    this.cursor = { x: 0, y: 0 }
    this.isInputting = false
    this.listboxNode = null
    this.listboxSelectedIndex = 0
    this.clipboard = {
      type: null,
      regulation: null,
      value: null,
    }
    this.appendTable()
    this.setupLlistbox()
  }

  appendTable () {
    this.containerNode = document.createElement('div')
    this.tableNode = document.createElement('table')
    this.theadNode = document.createElement('thead')
    this.tbodyNode = document.createElement('tbody')
    this.containerNode.setAttribute('class', 'editable-table__container')
    this.resetRegulations()
    this.updateHeaders()
    this.updateBodies()
    this.tableNode.appendChild(this.theadNode)
    this.tableNode.appendChild(this.tbodyNode)
    this.containerNode.appendChild(this.tableNode)
    this.params.containerNode.appendChild(this.containerNode)
    this.setFocus(this.focus)
    window.addEventListener('click', this.onClick.bind(this), false)
    window.addEventListener('dblclick', this.onDoubleClick.bind(this), false)
    window.addEventListener('keydown', this.onKeyDown.bind(this), false)
    window.addEventListener('keyup', this.onKeyUp.bind(this), false)
  }

  updateHeaders () {
    this.theadNode.innerHTML = ''
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
    this.tbodyNode.innerHTML = ''
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
      const type = this.params.bodies[y][x] == null ? 'number' : typeof this.params.bodies[y][x]
      const regulation = this.regulations[y][x]
      tdNode.setAttribute('data-type', type)
      tdNode.setAttribute('data-cursor', x === this.cursor.x && y === this.cursor.y)
      tdNode.setAttribute('data-regulation', regulation.type || '')
      tdNode.innerHTML = ''
      if (regulation.type === 'button') {
        const buttonNode = document.createElement('div')
        const textNode = document.createTextNode(this.params.bodies[y][x])
        buttonNode.addEventListener('click', () => {
          this.setCursor(x, y, false)
          regulation.callback(x, y)
        }, false)
        buttonNode.appendChild(textNode)
        tdNode.appendChild(buttonNode)
      } else if (type === 'boolean') {
        tdNode.setAttribute('data-checked', this.params.bodies[y][x].toString())
      } else if (this.params.bodies[y][x] != null) {
        const textNode = document.createTextNode(this.params.bodies[y][x])
        tdNode.appendChild(textNode)
      }
    }
  }

  setCell (x, y, value) {
    const node = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
    const type = node.getAttribute('data-type')
    if (this.params.forceConversion) {
      const v = type === 'boolean' ? Boolean(value) : type === 'number' ? (value === '' ? null : Number(value)) : value
      this.params.bodies[y][x] = v
    } else {
      this.params.bodies[y][x] = value
    }
    this.updateCell(x, y, node)
  }

  traverse (callback) {
    const xLength = this.getWidth()
    const yLength = this.getHeight()
    for (let y = 0; y < yLength; y ++) {
      for (let x = 0; x < xLength; x ++) {
        callback(x, y)
      }
    }
  }

  setSampleData (rowNumber, columnNumber) {
    const options = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
    this.params.headers.splice(0)
    for (let i = 0; i < columnNumber; i ++) {
      const value = String.fromCharCode(65 + i)
      this.params.headers.push(value)
    }
    this.params.bodies.splice(0)
    for (let y = 0; y < rowNumber; y ++) {
      this.params.bodies[y] = []
      for (let x = 0; x < columnNumber; x ++) {
        const value = (x % 5) === 0 ? (Math.random() >= 0.5) :
          (x % 5) === 1 ? (Math.floor(Math.random() * 201) - 100) :
          (x % 5) === 2 ? (String.fromCharCode(65 + x) + y) :
          (x % 5) === 3 ? options[Math.floor(Math.random() * options.length)] :
          'Button'
        this.params.bodies[y].push(value)
      }
    }
    this.resetRegulations()
    for (let y = 0; y < rowNumber; y ++) {
      for (let x = 0; x < columnNumber; x ++) {
        if ((x % 5) === 3) {
          this.setCellRegulation(x, y, {
            type: 'select',
            options
          })
        } else if ((x % 5) === 4) {
          this.setCellRegulation(x, y, {
            type: 'button',
            callback: (x, y) => {
              alert(`[ ${x + 1}, ${y + 1} ] clicked!`)
            }
          })
        }
      }
    }
    this.updateHeaders()
    this.updateBodies()
  }

  resetRegulations () {
    this.regulations.splice(0)
    const xLength = this.getWidth()
    const yLength = this.getHeight()
    for (let y = 0; y < yLength; y ++) {
      this.regulations[y] = []
      for (let x = 0; x < xLength; x ++) {
        this.regulations[y][x] = []
      }
    }
  }

  setupLlistbox () {
    this.listboxNode = document.createElement('ol')
    this.listboxNode.setAttribute('class', 'editable-table__listbox')
    this.listboxNode.style['display'] = 'none'
    this.params.containerNode.appendChild(this.listboxNode)
  }

  openListbox (targetNode, options) {
    let selectedItemNode = null
    this.setFocus(FocusType.Listbox)
    this.listboxNode.innerHTML = ''
    for (let i = 0; i < options.length; i ++) {
      const itemNode = document.createElement('li')
      const textNode = document.createTextNode(options[i])
      if (i === this.listboxSelectedIndex) {
        selectedItemNode = itemNode
      }
      itemNode.setAttribute('data-selected', i === this.listboxSelectedIndex)
      itemNode.addEventListener('click', (event) => {
        this.onClickListboxItem(i)
      }, false)
      itemNode.appendChild(textNode)
      this.listboxNode.appendChild(itemNode)
    }
    this.listboxNode.style['max-height'] = ''
    this.listboxNode.style['opacity'] = '0'
    this.listboxNode.style['display'] = ''

    // TODO: ポジショニングを改善する
    const box = targetNode.getBoundingClientRect()
    const margin = 16
    let left = box.left - 1
    let top = 0
    let maxHeight = - 1
    if (this.listboxNode.clientHeight < document.documentElement.clientHeight) {
      if (this.listboxNode.clientHeight + (targetNode.offsetTop - this.containerNode.scrollTop) < document.documentElement.clientHeight) {
        top = box.top - 1
      } else {
        top = document.documentElement.clientHeight - this.listboxNode.clientHeight - margin
      }
    } else {
      top = margin
      maxHeight = document.documentElement.clientHeight - margin * 2
    }
    this.listboxNode.style['left'] = `${left}px`
    this.listboxNode.style['top'] = `${top}px`
    if (maxHeight !== - 1) {
      this.listboxNode.style['max-height'] = `${maxHeight}px`
    }

    this.listboxNode.style['opacity'] = ''
    selectedItemNode.scrollIntoView({
      block: 'center',
      inline: 'center'
    })
  }

  onClickListboxItem (index) {
    this.listboxSelectedIndex = index
    this.updateListboxToCell(this.cursor.x, this.cursor.y)
  }

  closeListbox () {
    this.listboxNode.style['display'] = 'none'
    this.setFocus(FocusType.Table)
  }

  addListboxSelectedIndex (adding, options) {
    this.listboxNode.children[this.listboxSelectedIndex].setAttribute('data-selected', 'false')
    this.listboxSelectedIndex += adding
    this.listboxSelectedIndex = Math.max(0, Math.min(options.length - 1, this.listboxSelectedIndex))
    this.listboxNode.children[this.listboxSelectedIndex].setAttribute('data-selected', 'true')
    this.listboxNode.children[this.listboxSelectedIndex].scrollIntoView({
      block: 'center',
      inline: 'center'
    })
  }

  updateListboxToCell (x, y) {
    const regulation = this.regulations[y][x]
    const value = regulation.options[this.listboxSelectedIndex]
    this.params.bodies[y][x] = value
    this.updateCell(x, y)
  }

  setCellRegulation (x, y, params) {
    this.regulations[y][x].type = params.type
    if (params.callback != null) {
      this.regulations[y][x].callback = params.callback
    }
    if (params.options != null) {
      this.regulations[y][x].options = params.options
    }
  }

  setFocus (value) {
    this.focus = value
    this.containerNode.setAttribute('data-focus', this.focus === FocusType.Table)
  }

  setInputting (value) {
    this.isInputting = value
    this.containerNode.setAttribute('data-inputting', this.isInputting)
  }

  edit (x, y, selected) {
    if (this.isInputting) {
      return
    }
    const node = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
    if (!node) {
      return
    }
    const type = node.getAttribute('data-type')
    const regulation = this.regulations[y][x]
    if (regulation.type === 'button') {
      regulation.callback(x, y)
    } else if (regulation.type === 'select') {
      this.listboxSelectedIndex = 0
      for (let i = 0; i < regulation.options.length; i ++) {
        if (regulation.options[i] === this.params.bodies[y][x]) {
          this.listboxSelectedIndex = i
          break
        }
      }
      this.openListbox(node, regulation.options)
    } else if (type === 'boolean') {
      this.params.bodies[y][x] = !this.params.bodies[y][x]
      this.updateCell(x, y)
    } else {
      this.setInputting(true)
      this.setFocus(FocusType.None)
      node.innerHTML = ''
      let inputNode = null
      if (type === 'number') {
        inputNode = document.createElement('input')
        inputNode.setAttribute('size', '1')
        inputNode.setAttribute('spellcheck', 'false')
        inputNode.setAttribute('type', 'text')
        inputNode.setAttribute('value', this.params.bodies[y][x] == null ? '' : this.params.bodies[y][x])
        node.appendChild(inputNode)
      } else {
        inputNode = document.createElement('textarea')
        inputNode.setAttribute('cols', '1')
        inputNode.setAttribute('rows', '1')
        inputNode.setAttribute('spellcheck', 'false')
        inputNode.setAttribute('wrap', 'off')
        inputNode.value = this.params.bodies[y][x]
        node.appendChild(inputNode)
      }

      // テキストエリアのサイズを内容に合わせる
      this.resizeNodeToFitContent(inputNode)
      inputNode.addEventListener('keydown', () => {
        setTimeout(() => {
          this.resizeNodeToFitContent(inputNode)
        }, 0)
      }, false)

      let isComposed = false

      inputNode.addEventListener('keydown', (event) => {
        // TODO: Safari で常に false の疑い
        if (event.isComposing) {
          if (event.code === 'Enter') {
            isComposed = true
          }
        } else {
          switch (event.code) {
            case 'Enter': {
              if (type === 'string') {
                // 文章内改行
                // NOTICE: Chrome では onKeyDown で ⌘ ＋ Enter をキャッチできない模様
                if (event.metaKey) {
                  const pos = inputNode.selectionStart
                  const before = inputNode.value.substr(0, pos)
                  const word = '\n'
                  const after = inputNode.value.substr(pos, inputNode.value.length)
                  inputNode.value = before + word + after
                  inputNode.setSelectionRange(pos + 1, pos + 1)
                } else {
                  event.preventDefault()
                }
              }
              break
            }
            case 'Tab': {
              event.preventDefault()
              event.stopPropagation()
              this.setFocus(FocusType.Table)
              this.setInputting(false)
              this.setCell(x, y, inputNode.value)
              if (event.shiftKey) {
                this.setCursorToLeft()
              } else {
                this.setCursorToRight()
              }
              break
            }
            case 'Escape': {
              event.stopPropagation()
              this.setFocus(FocusType.Table)
              this.setInputting(false)
              this.updateCell(x, y)
              break
            }
          }
        }
      }, false)
      inputNode.addEventListener('keyup', (event) => {
        switch (event.code) {
          case 'Enter': {
            // 編集完了
            if (!isComposed && !event.metaKey) {
              event.preventDefault()
              event.stopPropagation()
              this.setFocus(FocusType.Table)
              this.setInputting(false)
              this.setCell(x, y, inputNode.value)
              this.setCursorToDown()
            }
            if (isComposed) {
              isComposed = false
            }
            break
          }
        }
      }, false)
      inputNode.addEventListener('blur', (event) => {
        this.setFocus(FocusType.Table)
        this.setInputting(false)
        this.updateCell(x, y)
      }, false)

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

  resizeNodeToFitContent (node) {
    if (node.parentNode) {
      node.style['width'] = 'auto'
      node.style['width'] = `${Math.max(node.scrollWidth, node.parentNode.clientWidth) + 32}px`
      node.style['height'] = 'auto'
      node.style['height'] = `${Math.max(node.scrollHeight, node.parentNode.clientHeight)}px`
    }
  }

  setCursor (x, y, enableScroll = true) {
    if (this.isCursorValid(x, y)) {
      const cellOnCursor = this.tableNode.querySelector('[data-cursor="true"]')
      if (cellOnCursor) {
        cellOnCursor.setAttribute('data-cursor', 'false')
      }
      const cell = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
      if (cell) {
        cell.setAttribute('data-cursor', 'true')
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
    if (event.target.closest('.editable-table__container') || event.target.closest('.editable-table__listbox')) {
      this.setFocus(FocusType.Table)
      this.closeListbox()
      if (event.target.closest('td')) {
        const x = parseInt(event.target.getAttribute('data-x'), 10)
        const y = parseInt(event.target.getAttribute('data-y'), 10)
        this.setCursor(x, y, false)
      }
    } else {
      this.setFocus(FocusType.None)
    }
  }

  onDoubleClick (event) {
    if (this.focus === FocusType.Table) {
      this.edit(this.cursor.x, this.cursor.y, false)
    }
  }

  onKeyDown (event) {
    if (this.focus === FocusType.Table) {
      const type = typeof this.params.bodies[this.cursor.y][this.cursor.x]
      const regulation = this.regulations[this.cursor.y][this.cursor.x]
      switch (event.code) {
        case 'ArrowLeft': {
          event.preventDefault()
          if (event.metaKey) {
            this.setCursorToLeftEnd()
          } else {
            this.setCursorToLeft()
          }
          break
        }
        case 'ArrowRight': {
          event.preventDefault()
          if (event.metaKey) {
            this.setCursorToRightEnd()
          } else {
            this.setCursorToRight()
          }
          break
        }
        case 'ArrowUp': {
          event.preventDefault()
          if (event.metaKey) {
            this.setCursorToTop()
          } else {
            this.setCursorToUp()
          }
          break
        }
        case 'ArrowDown': {
          event.preventDefault()
          if (event.metaKey) {
            this.setCursorToBottom()
          } else {
            this.setCursorToDown()
          }
          break
        }
        case 'Tab': {
          event.preventDefault()
          if (event.shiftKey) {
            this.setCursorToLeft()
          } else {
            this.setCursorToRight()
          }
          break
        }
        case 'Space': {
          event.preventDefault()
          this.edit(this.cursor.x, this.cursor.y, type !== 'boolean')
          break
        }
        case 'Backspace': {
          event.preventDefault()
          if ((type === 'boolean' || type === 'number' || type === 'string') && (regulation.type !== 'button' && regulation.type !== 'select')) {
            this.setCell(this.cursor.x, this.cursor.y, '')
          }
          break
        }
        case 'Escape': {
          event.preventDefault()
          this.setFocus(FocusType.None)
          break
        }
        case 'KeyC': {
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            this.copyCell(this.cursor.x, this.cursor.y, type, regulation)
          } else {
            this.onEtceteraKeyDown(type, regulation, event)
          }
          break
        }
        case 'KeyV': {
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            this.pasteCell(this.cursor.x, this.cursor.y, type, regulation)
          } else {
            this.onEtceteraKeyDown(type, regulation, event)
          }
          break
        }
        default: {
          this.onEtceteraKeyDown(type, regulation, event)
          break
        }
      }
    } else if (this.focus === FocusType.Listbox) {
      const regulation = this.regulations[this.cursor.y][this.cursor.x]
      switch (event.code) {
        case 'ArrowUp': {
          event.preventDefault()
          this.addListboxSelectedIndex(- 1, regulation.options)
          break
        }
        case 'ArrowDown': {
          event.preventDefault()
          this.addListboxSelectedIndex(1, regulation.options)
          break
        }
        case 'Tab': {
          event.preventDefault()
          this.closeListbox()
          if (event.shiftKey) {
            this.setCursorToLeft()
          } else {
            this.setCursorToRight()
          }
          break
        }
        case 'Space': {
          event.preventDefault()
          this.updateListboxToCell(this.cursor.x, this.cursor.y)
          this.closeListbox()
          break
        }
        case 'Escape': {
          this.closeListbox()
          break
        }
      }
    }
  }

  onEtceteraKeyDown (type, regulation, event) {
    if (type !== 'boolean' && regulation.type !== 'button' && regulation.type !== 'select') {
      if (event.key.length === 1) {
        const charCode = event.key.charCodeAt(0)
        if (charCode >= 32 && charCode <= 126) {
          this.edit(this.cursor.x, this.cursor.y, true)
          return
        }
      }
    }
  }

  onKeyUp (event) {
    if (this.focus === FocusType.Table) {
      switch (event.code) {
        case 'Enter': {
          this.edit(this.cursor.x, this.cursor.y, false)
          break
        }
      }
    } else if (this.focus === FocusType.Listbox) {
      switch (event.code) {
        case 'Enter': {
          this.updateListboxToCell(this.cursor.x, this.cursor.y)
          this.closeListbox()
          this.setCursorToDown()
          break
        }
      }
    }
  }

  copyCell (x, y, type, regulation) {
    if (regulation.type === 'button') {
      return
    }

    this.clipboard.type = type
    this.clipboard.regulation = regulation
    this.clipboard.value = this.params.bodies[y][x]
  }

  pasteCell (x, y, type, regulation) {
    if (this.clipboard.type === type && this.clipboard.regulation.type === regulation.type) {

      if (regulation.type === 'select') {
        if (regulation.options.indexOf(this.clipboard.value) === - 1) {
          return
        }
      }

      this.params.bodies[y][x] = this.clipboard.value
      this.updateCell(x, y)
    }
  }
}

module.exports = EditableTable
