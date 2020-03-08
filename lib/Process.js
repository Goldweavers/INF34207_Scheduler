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

const moment = require('moment')

const logger = require('./util/logger')

class Process {
  /**
   * Process total waiting time
   * @type {number}
   */
  totalWaitTime = 0

  createdAt = null

  /**
   * Process current state
   * @type {{status: string, updatedAt: (*|moment.Moment)}}
   * @private
   */
  _state = { updatedAt: moment(), status: 'NEW' }

  /**
   *
   * @param {string} name
   * @param {number} duration
   */
  constructor (name, duration) {
    this._validateParameters(name, duration)

    this.name = name
    this.duration = duration
  }

  _validateParameters (name, duration) {
    if (!name || !name.length) {
      throw new Error('Invalid process name: ' + name)
    }
    if (!duration || isNaN(duration)) {
      throw new Error('Invalid duration for process named: ' + name)
    }
  }

  getWaitTime () {
    return moment().diff(this._state.updatedAt, 'ms')
  }

  setStatus(status) {
    const state = this._state
    const waitingTime = this.getWaitTime()

    switch (status) {
      case 'READY':
        if (state.status === 'NEW') {
          this.createdAt = moment()
        }
        break;
      case 'RUNNING':
        if (state.status === 'READY') {
          this.totalWaitTime += waitingTime
        }
        break;
    }
    logger.debug(`Process: ${this.name} switching from ${state.status} to ${status}`)
    state.status = status
    state.updatedAt = moment()

    const screen = global.screen
    if (screen) {
      setImmediate(screen._refreshDiagram.bind(screen));
    }
    return waitingTime
  }

  getStatus() {
    return this._state.status
  }

  run () {
    if (this.duration > 0) {
      logger.debug(`Process: ${this.name} is running...`)
      return true
    }
    this.terminate()
    return false
  }

  terminate () {
    this.setStatus('TERMINATED')
  }
}

module.exports = Process
