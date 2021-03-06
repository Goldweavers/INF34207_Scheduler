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

const StrategyFactory = require('./scheduler/StrategyFactory')
const ProcessStore = require('./scheduler/ProcessStore')

const sigstop = require('./util/sigstop')
const logger = require('./util/logger')

class Scheduler {

  /**
   * Initialise l'orchestrateur
   * @param {string} strategy
   */
  constructor (strategy) {
    /**
     * Liste des procéssus
     * @type {ProcessStore}
     */
    this.processes = new ProcessStore()

    /**
     * Usine des stratégies d'ordonnancement
     * @type {StrategyFactory}
     * @private
     */
    this._strategyFactory = new StrategyFactory(this)

    /**
     * Etat de l'orchestrateur
     * @type {boolean}
     * @private
     */
    this._running = false

    /////////////////////////////////

    this._strategy = this._strategyFactory.create(strategy)
  }

  /**
   * Ajoute un procéssus à l'orchestrateur
   * @param {Process} process
   */
  addProcess (process) {
    if (process) {
      return this.processes.push(process)
    }
    throw new Error('Scheduler: Added invalid process')
  }

  /**
   * Exécute le procéssus choisi
   * @param {Process} process
   */
  async run (process) {
    const duration = this._strategy.getExecutionTime(process)
    const processes = this.processes

    if (processes.run(process) === true) {
      await new Promise((resolve) => setTimeout(() => {
        process.duration -= duration

        if (process.duration === 0) {
          processes.delete(process)
        } else {
          processes.ready.push(process)
        }
        return resolve()
      }, duration))
    } else
      processes.delete(process)
  }

  /**
   * Démarre l'orchestrateur
   * @return {Promise<void>}
   */
  async start () {
    sigstop(this.stop.bind(this));
    this._running = true

    logger.debug(`Scheduler: starting...`)
    while (this._running === true) {
      const process = this._strategy.getNextProcess()

      if (process) {
        await this.run(process)
      }

      await new Promise((resolve) => process
        ? setImmediate(resolve)
        : setTimeout(resolve, 100)
      )
    }
    return process.exit(0);
  }

  /**
   * Lance la procédure d'arrêt de l'orchestrateur
   */
  stop () {
    const avgResidenceTime = calcAvg(this.processes.residenceTimes)
    const avgWaitingTime = calcAvg(this.processes.waitingTimes)

    logger.debug(`Scheduler: average residence time = ${avgResidenceTime} sec`)
    logger.debug(`Scheduler: average waiting time = ${avgWaitingTime} ms`)
    logger.debug(`Scheduler: exiting...`)

    this._running = false
  }
}

/**
 * Cacul une moyenne avec les nombres passés en paramètre
 * @param {number[]} numbers
 * @return {string}
 */
function calcAvg (numbers) {
  const average = numbers.reduce(
    (sum, number) => sum + number,
    0,
  ) / numbers.length

  return average.toFixed(2)
}

module.exports = Scheduler
