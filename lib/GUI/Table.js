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

class Table {

  /**
   * Initialise le tableau
   * @param {Screen} screen
   * @param {{y, x}} positions
   * @param {{height, width}} size
   * @param {string} title
   */
  constructor (screen, positions, size, title) {
    /**
     * Paramètres du tableau
     * @type {Object}
     * @private
     */
    this._options = {
      keys: true,
      interactive: false,
      border: { type: 'line', fg: 'cyan' },
      columnSpacing: 1,
      columnWidth: [16, 8, 10],
    }

    //////////////////////////////////////

    const { height, width } = size
    const { y, x } = positions

    this._table = screen.grid.set(y, x, height, width, contrib.table, {
      ...this._options, label: title,
    })
    this._screen = screen
  }

  /**
   * Défini les données du tableau
   * @param data
   */
  setData (data) {
    this._table.setData(data)
    this._screen.render()
  }
}

module.exports = Table
