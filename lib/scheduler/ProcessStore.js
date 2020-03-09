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
   * Initialise la liste
   */
  constructor () {
    /**
     * File des procéssus en attente d'éxécution
     * @type {ReadyProcessQueue}
     */
    this.ready = new ReadyProcessQueue()

    /**
     * Tableau des temps de résidences
     * @type {number[]}
     */
    this.residenceTimes = []

    /**
     * Tableau des temps d'attentes
     * @type {number[]}
     */
    this.waitingTimes = []

    /**
     * Liste des procéssus
     * @type {Map<string, Object>}
     * @private
     */
    this._processes = new Map()

    /**
     * Date de démarrage de l'orchestrateur
     * @type {moment.Moment}
     * @private
     */
    this._createdAt = moment()
  }

  /**
   * Ajoute un procéssus
   * @param {Process} process
   */
  push (process) {
    logger.debug(`Scheduler: process ${process.name} added`)

    this._processes.set(process.name, {
      instance: process,
      createdAt: moment().diff(this._createdAt, 'second')
    })
    this.ready.push(process)
  }

  /**
   * Enlève un procéssus en attente et l'exécute
   * @param {Process} process
   * @return {*}
   */
  run (process) {
    this.ready.delete(process)

    return process.run()
  }

  /**
   * Supprime un procèssus
   * @param {Process} process
   */
  delete (process) {
    const residenceTime = this._feedStatistics(process)

    process.terminate()
    //this._processes.delete(process.name)

    logger.debug(`Scheduler: process ${process.name} removed (residence time ${residenceTime} sec)`)
  }

  /**
   * Actualise les statistiques
   * @param {Process} process
   * @return {number}
   * @private
   */
  _feedStatistics (process) {
    const { createdAt } = this._processes.get(process.name)
    const endTime = moment().diff(this._createdAt, 'second')
    const residenceTime = endTime - createdAt

    this.residenceTimes.push(residenceTime)
    this.waitingTimes.push(process.totalWaitTime)
    return residenceTime
  }

  /**
   * Récupère un tableau des procéssus
   * @return {Object.instance[]}
   */
  toList () {
    return Array.from(this._processes.values()).map(({ instance }) => instance)
  }
}

module.exports = ProcessStore
