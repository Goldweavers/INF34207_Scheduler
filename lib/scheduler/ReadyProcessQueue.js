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

class ReadyProcessQueue {

  /**
   * Initialise la liste
   */
  constructor () {
    /**
     * Liste des procéssus en attente
     * @type {Map<string, Process>}
     * @private
     */
    this._processes = new Map()
  }

  /**
   * Ajoute un procéssus
   * @param {Process} process
   */
  push (process) {
    process.setStatus('READY')

    this._processes.set(process.name, process)
  }

  /**
   * Supprime un procéssus
   * @param {Process} process
   * @return {Process}
   */
  delete (process) {
    if (process) {
      const waitingTime = process.setStatus('RUNNING')

      logger.debug(`Scheduler: process ${process.name} waited ${waitingTime} ms`)
      this._processes.delete(process.name)
    }
    return process
  }

  /**
   * Récupère un tableau des procéssus
   * @return {Process[]}
   */
  toList () {
    return Array.from(this._processes.values())
  }
}

module.exports = ReadyProcessQueue
