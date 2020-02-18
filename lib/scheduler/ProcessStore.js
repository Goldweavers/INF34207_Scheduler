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

const ReadyProcessQueue = require('./ReadyProcessQueue')
const logger = require('../util/logger')

class ProcessStore {
  /**
   * Ready processes queue
   * @type {ReadyProcessQueue}
   */
  ready = new ReadyProcessQueue()

  residenceTimes = []
  waitingTimes = []

  /**
   * Processes list
   * @type {Map<string, Object>}
   * @private
   */
  _processes = new Map()

  /**
   * Scheduler start date
   * @type {*|moment.Moment}
   * @private
   */
  _createdAt = moment()

  push (process) {
    logger.debug(`Scheduler: process ${process.name} added`)

    this._processes.set(process.name, {
      instance: process,
      createdAt: moment().diff(this._createdAt, 'second')
    })
    this.ready.push(process)
  }

  run (process) {
    this.ready.delete(process)

    return process.run()
  }

  /**
   *
   * @param {Process} process
   */
  delete (process) {
    const residenceTime = this._feedStatistics(process)

    this._processes.delete(process.name)
    process.terminate()

    logger.debug(`Scheduler: process ${process.name} removed (residence time ${residenceTime} sec)`)
  }

  _feedStatistics (process) {
    const { createdAt } = this._processes.get(process.name)
    const endTime = moment().diff(this._createdAt, 'second')
    const residenceTime = endTime - createdAt

    this.residenceTimes.push(residenceTime)
    this.waitingTimes.push(process.totalWaitTime)
    return residenceTime
  }

  toList () {
    return Array.from(this._processes.values()).map(({ instance }) => instance)
  }
}

module.exports = ProcessStore
