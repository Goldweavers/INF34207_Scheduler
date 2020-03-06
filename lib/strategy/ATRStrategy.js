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

const logger = require('../util/logger')

class ATRStrategy {
  /**
   * Quantum of time in ms
   * @type {number}
   * @private
   */
  _quantum = 1000

  /**
   *
   * @param {Scheduler} scheduler
   */
  constructor (scheduler) {
    this._scheduler = scheduler

    logger.info(`ATR: quantum of time = ${this._quantum} ms`)
  }

  /**
   *
   * @param {Process} process
   */
  getExecutionTime (process) {
    return this._quantum
  }

  getNextProcess() {
    const [process, ...processes] = this._scheduler.processes.ready.toList()

    return processes.reduce((selected, current) => {
      return selected.getWaitTime() > current.getWaitTime() ? selected : current
    }, process)
  }
}

module.exports = ATRStrategy
