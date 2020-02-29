/**
 * inf34207_scheduler
 * Copyright (c) Julien Sarriot 2020.
 * All rights reserved.
 *
 * This code is licensed under the MIT License.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files(the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions :
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const contrib = require('blessed-contrib')

const logger = require('../util/logger')

class LineGraph {
  _data = new Map()

  /**
   * Line chart options
   * @type {Object}
   * @private
   */
  _options = {
    minY: 0,
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    wholeNumbersOnly: true
  }

  /**
   *
   * @param {Screen} screen
   * @param {{y, x}} positions
   * @param {{height, width}} size
   * @param {string} title
   */
  constructor (screen, positions, size, title) {
    const { height, width } = size
    const { y, x } = positions

    this._line = screen.grid.set(y, x, height, width, contrib.line, {
      ...this._options, label: title
    })
    this._screen = screen
  }

  /**
   *
   * @param {Object[]} lines
   */
  setData (lines) {
    lines.forEach((line) => {
      if (this._data.has(line.title) === true) {
        const pastLine = this._data.get(line.title)
        const x = [...new Set([...pastLine.x, ...line.x])]
        const y = [...pastLine.y, ...line.y]

        pastLine.x = x.slice(x.length - 10)
        pastLine.y = y.slice(y.length - 10)
        this._data.set(line.title, {
          ...pastLine,
          style: line.style
        })
      } else
        this._data.set(line.title, line)
    })
    this._line.setData(
      Array.from(this._data.values())
    )
    this._screen.render()
  }
}

module.exports = LineGraph
