const BuiltinRegulations = [
  {
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
  },
  {
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
]

class EditableTable {
  constructor (params) {
    this.params = params
    this.setupProperties()
    this.addRegulations(BuiltinRegulations)
    this.addRegulations(this.params.regulations)
    this.setColumnRegulations(this.params.columnRegulations)
    this.setCellRegulations()
    this.setupTable()
    this.setupListeners()
    this.callRegulation('all', 'onSetup')
  }

  setupProperties () {
    this.focusType = !!this.params.autofocus ? 'Table' : 'None'
    this.regulations = []
    this.columnRegulations = []
    this.cellRegulations = []
    this.containerNode = null
    this.scrollerNode = null
    this.tableNode = null
    this.theadNode = null
    this.tbodyNode = null
    this.cursor = { x: 0, y: 0 }
    this.isInputting = false
    this.clipboard = { type: null, regulation: null, value: null }
  }

  setupTable () {
    this.containerNode = document.createElement('div')
    this.containerNode.setAttribute('class', 'editable-table')
    this.scrollerNode = document.createElement('div')
    this.scrollerNode.setAttribute('class', 'editable-table__scroller')
    this.tableNode = document.createElement('table')
    this.theadNode = document.createElement('thead')
    this.tbodyNode = document.createElement('tbody')
    this.setHeaders(this.params.headers)
    this.setHeaderSpans(this.params.headerSpans)
    this.setBodies(this.params.bodies)
    this.tableNode.appendChild(this.theadNode)
    this.tableNode.appendChild(this.tbodyNode)
    this.scrollerNode.appendChild(this.tableNode)
    this.containerNode.appendChild(this.scrollerNode)
    this.params.containerNode.appendChild(this.containerNode)
    this.updateHeaderPositions()
    this.setFocus(this.focusType)
  }

  getWidth () {
    return this.params.bodies == null ? 0 : (this.params.bodies.length > 0 ? this.params.bodies[0].length : 0)
  }

  getHeight () {
    return this.params.bodies == null ? 0 : this.params.bodies.length
  }

  addRegulations (regulations) {
    if (regulations != null) {
      for (let i = 0; i < regulations.length; i ++) {
        this.addRegulation(regulations[i])
      }
    }
  }

  addRegulation (regulation) {
    this.regulations.push(regulation)
  }

  setColumnRegulations (regulations) {
    this.columnRegulations.splice(0)
    if (regulations != null) {
      for (let i = 0; i < regulations.length; i ++) {
        this.columnRegulations[i] = regulations[i]
      }
    }
    const xLength = this.getWidth()
    for (let x = 0; x < xLength; x ++) {
      this.columnRegulations[x] = this.columnRegulations[x] || null
    }
  }

  setCellRegulations () {
    this.cellRegulations.splice(0)
    const xLength = this.getWidth()
    const yLength = this.getHeight()
    for (let y = 0; y < yLength; y ++) {
      this.cellRegulations[y] = []
      for (let x = 0; x < xLength; x ++) {
        this.cellRegulations[y][x] = null
      }
    }
  }

  setCellRegulation (x, y, regulation) {
    if (regulation != null) {
      this.cellRegulations[y][x] = {}
      for (let key in regulation) {
        this.cellRegulations[y][x][key] = regulation[key]
      }
    } else {
      this.cellRegulations[y][x] = null
    }
  }

  setHeaders (headers) {
    this.theadNode.innerHTML = ''
    if (headers != null && headers.length > 0) {
      let leftTopNode = null
      for (let y = 0; y < headers.length; y ++) {
        const trNode = document.createElement('tr')
        if (y === 0 && this.params.bodyHeaderType !== 'none') {
          leftTopNode = this.appendHeader(trNode, '')
        }
        for (let x = 0; x < headers[y].length; x ++) {
          this.appendHeader(trNode, headers[y][x])
        }
        this.theadNode.appendChild(trNode)
      }
      if (leftTopNode !== null) {
        leftTopNode.setAttribute('rowspan', '2')
      }
    }
  }

  appendHeader (trNode, text) {
    const thNode = document.createElement('th')
    const textNode = document.createTextNode(text)
    thNode.appendChild(textNode)
    trNode.appendChild(thNode)
    return thNode
  }

  setHeaderSpans (spans) {
    if (spans != null && this.params.headers != null) {
      for (let y = 0; y < this.params.headers.length; y ++) {
        for (let x = 0; x < this.params.headers[y].length; x ++) {
          if (spans[y] != null && spans[y][x] != null) {
            if (spans[y][x].x != null) {
              this.setHeaderAttribute(x, y, 'colspan', spans[y][x].x)
            }
            if (spans[y][x].y != null) {
              this.setHeaderAttribute(x, y, 'rowspan', spans[y][x].y)
            }
          }
        }
      }
    }
  }

  setHeaderAttribute (x, y, name, value) {
    this.theadNode.children[y].children[x + (this.params.bodyHeaderType !== 'none' ? 1 : 0)].setAttribute(name, value)
  }

  updateHeaderPositions () {
    let top = 0
    const trNodes = this.theadNode.children
    for (let y = 0; y < trNodes.length; y ++) {
      const thNodes = trNodes[y].children
      for (let x = 0; x < thNodes.length; x ++) {
        thNodes[x].style['top'] = `${top}px`
      }
      if (y < trNodes.length - 1) {
        top += trNodes[y].clientHeight
      }
    }
  }

  setBodies (bodies) {
    const height = this.getHeight()
    this.tbodyNode.innerHTML = ''
    for (let y = 0; y < height; y ++) {
      const trNode = document.createElement('tr')
      if (this.params.bodyHeaderType !== 'none') {
        const value = this.params.bodyHeaderType === 'value' ? bodies[y][0] : y + 1
        this.appendBodyHeader(trNode, y, value)
      }
      const offsetX = this.params.bodyHeaderType === 'value' ? 1 : 0
      for (let x = offsetX; x < bodies[y].length; x ++) {
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

  appendBodyHeader (trNode, y, value) {
    const thNode = document.createElement('th')
    const textNode = document.createTextNode(value)
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
      const regulation = this.cellRegulations[y][x] || this.columnRegulations[x] || {}
      tdNode.setAttribute('data-type', type)
      tdNode.setAttribute('data-cursor', x === this.cursor.x && y === this.cursor.y)
      tdNode.setAttribute('data-regulation', regulation.type || '')
      tdNode.innerHTML = ''
      if (!this.callRegulation(regulation, 'onUpdateCell', x, y, tdNode)) {
        if (type === 'boolean') {
          tdNode.setAttribute('data-checked', this.params.bodies[y][x].toString())
        } else if (this.params.bodies[y][x] != null) {
          const textNode = document.createTextNode(this.params.bodies[y][x])
          tdNode.appendChild(textNode)
        }
      }
    }
  }

  setCellValue (x, y, value) {
    const node = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
    const type = node.getAttribute('data-type')
    const v = type === 'boolean' ? Boolean(value) : type === 'number' ? (value === '' ? null : Number(value)) : value
    this.params.bodies[y][x] = v
    this.updateCell(x, y, node)
  }

  setFocus (value) {
    this.focusType = value
    this.containerNode.setAttribute('data-focus', this.focusType === 'Table')
  }

  setInputting (value) {
    this.isInputting = value
    this.containerNode.setAttribute('data-inputting', this.isInputting)
  }

  setupListeners () {
    window.addEventListener('click', this.onClick.bind(this), false)
    window.addEventListener('dblclick', this.onDoubleClick.bind(this), false)
    window.addEventListener('keydown', this.onKeyDown.bind(this), false)
    window.addEventListener('keyup', this.onKeyUp.bind(this), false)
    window.addEventListener('resize', this.onResize.bind(this), false)
  }

  edit (x, y, selected) {
    if (this.isInputting) {
      return
    }
    const tdNode = this.tableNode.querySelector(`[data-x="${x}"][data-y="${y}"]`)
    if (!tdNode) {
      return
    }
    const type = tdNode.getAttribute('data-type')
    const regulation = this.cellRegulations[y][x] || this.columnRegulations[x] || {}

    if (!this.callRegulation(regulation, 'onEdit', x, y, tdNode)) {
      if (type === 'boolean') {
        this.params.bodies[y][x] = !this.params.bodies[y][x]
        this.updateCell(x, y)
      } else {
        this.setInputting(true)
        this.setFocus('None')
        tdNode.innerHTML = ''
        let inputNode = null
        if (type === 'number') {
          inputNode = document.createElement('input')
          inputNode.setAttribute('size', '1')
          inputNode.setAttribute('spellcheck', 'false')
          inputNode.setAttribute('type', 'text')
          inputNode.setAttribute('value', this.params.bodies[y][x] == null ? '' : this.params.bodies[y][x])
          tdNode.appendChild(inputNode)
        } else {
          inputNode = document.createElement('textarea')
          inputNode.setAttribute('cols', '1')
          inputNode.setAttribute('rows', '1')
          inputNode.setAttribute('spellcheck', 'false')
          inputNode.setAttribute('wrap', 'off')
          inputNode.value = this.params.bodies[y][x]
          tdNode.appendChild(inputNode)
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
          const keyCode = event.code || event.key
          // TODO: Safari で常に false の疑い
          if (event.isComposing) {
            if (keyCode === 'Enter') {
              isComposed = true
            }
          } else {
            switch (keyCode) {
              case 'Enter': {
                if (type === 'string') {
                  // 文章内改行
                  // NOTICE: Chrome では onKeyDown で ⌘ ＋ Enter をキャッチできない模様
                  event.preventDefault()
                  if (event.ctrlKey || event.metaKey) {
                    const pos = inputNode.selectionStart
                    const before = inputNode.value.substr(0, pos)
                    const word = '\n'
                    const after = inputNode.value.substr(pos, inputNode.value.length)
                    inputNode.value = before + word + after
                    inputNode.setSelectionRange(pos + 1, pos + 1)
                  }
                }
                break
              }
              case 'Tab': {
                event.preventDefault()
                event.stopPropagation()
                this.setFocus('Table')
                this.setInputting(false)
                this.setCellValue(x, y, inputNode.value)
                if (event.shiftKey) {
                  this.setCursorToLeft()
                } else {
                  this.setCursorToRight()
                }
                break
              }
              case 'Escape': {
                event.stopPropagation()
                this.setFocus('Table')
                this.setInputting(false)
                this.updateCell(x, y)
                break
              }
            }
          }
        }, false)
        inputNode.addEventListener('keyup', (event) => {
          const keyCode = event.code || event.key
          switch (keyCode) {
            case 'Enter': {
              // 編集完了
              if (!isComposed && !event.ctrlKey && !event.metaKey) {
                event.preventDefault()
                event.stopPropagation()
                this.setFocus('Table')
                this.setInputting(false)
                this.setCellValue(x, y, inputNode.value)
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
          this.setFocus('Table')
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
          const bodyHeaderNode = this.tbodyNode.querySelector('tr th')
          const offsetLeft = bodyHeaderNode !== null ? bodyHeaderNode.clientWidth : 0
          const offsetTop = this.theadNode.clientHeight
          this.scrollIntoView(this.scrollerNode, cell, offsetLeft, offsetTop)
        }
        this.cursor.x = x
        this.cursor.y = y
      }
    }
  }

  scrollIntoView (scrollNode, targetNode, offsetLeft = 0, offsetTop = 0) {
    if (scrollNode != null && targetNode != null) {
      const scrollLeft = scrollNode.scrollLeft
      const scrollWidth = scrollNode.clientWidth
      const targetLeft = targetNode.offsetLeft
      const targetWidth = targetNode.clientWidth
      const scrollTop = scrollNode.scrollTop
      const scrollHeight = scrollNode.clientHeight
      const targetTop = targetNode.offsetTop
      const targetHeight = targetNode.clientHeight
      if (scrollLeft > targetLeft - offsetLeft) {
        scrollNode.scrollLeft = targetLeft - offsetLeft
      } else if (scrollLeft + scrollWidth < targetLeft + targetWidth) {
        scrollNode.scrollLeft = targetLeft + targetWidth - scrollWidth
      }
      if (scrollTop > targetTop - offsetTop) {
        scrollNode.scrollTop = targetTop - offsetTop
      } else if (scrollTop + scrollHeight < targetTop + targetHeight) {
        scrollNode.scrollTop = targetTop + targetHeight - scrollHeight
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
    const offsetX = this.params.bodyHeaderType === 'value' ? 1 : 0
    this.setCursor(offsetX, this.cursor.y)
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
    const offsetX = this.params.bodyHeaderType === 'value' ? 1 : 0
    return x >= offsetX && y >= 0 && x < this.getWidth() && y < this.getHeight()
  }

  onClick (event) {
    this.callRegulation('all', 'onClick', event.target)
    if (event.target.closest('.editable-table')) {
      this.setFocus('Table')
      if (event.target.closest('td')) {
        const x = parseInt(event.target.getAttribute('data-x'), 10)
        const y = parseInt(event.target.getAttribute('data-y'), 10)
        this.setCursor(x, y, false)
      }
    } else {
      this.setFocus('None')
    }
  }

  onDoubleClick (event) {
    if (this.focusType === 'Table' && event.target.closest('td')) {
      this.edit(this.cursor.x, this.cursor.y, false)
    }
  }

  onKeyDown (event) {
    const keyCode = event.code || event.key
    if (this.focusType === 'Table') {
      if (this.isCursorValid(this.cursor.x, this.cursor.y)) {
        const type = typeof this.params.bodies[this.cursor.y][this.cursor.x]
        const regulation = this.cellRegulations[this.cursor.y][this.cursor.x] || this.columnRegulations[this.cursor.x] || {}
        switch (keyCode) {
          case 'ArrowLeft': {
            event.preventDefault()
            // TODO: `ctrlKey` + `ArrowLeft` を機能させる
            if (event.ctrlKey || event.metaKey) {
              this.setCursorToLeftEnd()
            } else {
              this.setCursorToLeft()
            }
            break
          }
          case 'ArrowRight': {
            event.preventDefault()
            // TODO: `ctrlKey` + `ArrowRight` を機能させる
            if (event.ctrlKey || event.metaKey) {
              this.setCursorToRightEnd()
            } else {
              this.setCursorToRight()
            }
            break
          }
          case 'ArrowUp': {
            event.preventDefault()
            if (event.ctrlKey || event.metaKey) {
              this.setCursorToTop()
            } else {
              this.setCursorToUp()
            }
            break
          }
          case 'ArrowDown': {
            event.preventDefault()
            if (event.ctrlKey || event.metaKey) {
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
          case ' ':
          case 'Space': {
            event.preventDefault()
            this.edit(this.cursor.x, this.cursor.y, type !== 'boolean')
            break
          }
          case 'Backspace': {
            event.preventDefault()

            if (regulation.type == null) {
              this.setCellValue(this.cursor.x, this.cursor.y, '')
            }
            break
          }
          case 'Escape': {
            event.preventDefault()
            this.setFocus('None')
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
      } else {
        switch (keyCode) {
          case 'Escape': {
            event.preventDefault()
            this.setFocus('None')
            break
          }
        }
      }
    } else {
      this.callRegulation('all', 'onKeyDown', keyCode)
    }
  }

  onEtceteraKeyDown (type, regulation, event) {
    if (type !== 'boolean' && regulation.type == null) {
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
    const keyCode = event.code || event.key
    if (this.focusType === 'Table') {
      switch (keyCode) {
        case 'Enter': {
          this.edit(this.cursor.x, this.cursor.y, false)
          break
        }
      }
    } else {
      this.callRegulation('all', 'onKeyUp', keyCode)
    }
  }

  copyCell (x, y, type, regulation) {
    if (!this.callRegulation(regulation, 'onCopyCell', x, y)) {
      this.clipboard.type = type
      this.clipboard.regulation = regulation
      this.clipboard.value = this.params.bodies[y][x]
    }
  }

  pasteCell (x, y, type, regulation) {
    if (this.clipboard.type === type && this.clipboard.regulation.type === regulation.type) {
      if (!this.callRegulation(regulation, 'onPasteCell', x, y)) {
        this.params.bodies[y][x] = this.clipboard.value
        this.updateCell(x, y)
      }
    }
  }

  onResize () {
    this.updateHeaderPositions()
  }

  callRegulation (regulation, eventName, ...params) {
    for (let i = 0; i < this.regulations.length; i ++) {
      if ((regulation === 'all' || this.regulations[i].type === regulation.type) && this.regulations[i][eventName] != null) {
        if (!this.regulations[i][eventName](this, regulation, ...params)) {
          return true
        }
      }
    }
    return false
  }
}

module.exports = EditableTable
