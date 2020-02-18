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

const inquirer = require('inquirer')
const moment = require('moment')

const Process = require('./Process')
const Scheduler = require('./Scheduler')

const logger = require('./util/logger')
const questions = require('./config/questions')

const secToMs = (sec) => moment.duration(sec, 'seconds').asMilliseconds()

inquirer.prompt(questions).then(({ matrix, strategy }) => {
  const scheduler = new Scheduler(strategy)
  const [names, durations, startTimes] = JSON.parse(matrix.replace(/'/g, '"'))
  const processes = names.map((name, idx) => {
    return new Process(name, secToMs(durations[idx]))
  })

  processes.forEach((process, idx) => {
    const startTime = startTimes[idx] || -1

    if (startTimes[idx] < 0) {
      throw new Error('Invalid start time for process: ' + process.name)
    }
    setTimeout(() => scheduler.addProcess(process), secToMs(startTime))
  })

  return scheduler.start()
}).catch((error) => logger.error(error.message))

// [['A', 'B', 'C'], [3, 2, 4], [1, 0, 2]]
