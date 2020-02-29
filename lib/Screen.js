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

const blessed = require('blessed')
const contrib = require('blessed-contrib')
const moment = require('moment')

const LineGraph = require('./GUI/LineGraph')
const Table = require('./GUI/Table')

const secToMs = (sec) => moment.duration(sec, 'second').asMilliseconds()

const states = ['NEW', 'READY', 'RUNNING', 'TERMINATED']

class Screen {
  _screen = blessed.screen()

  grid = new contrib.grid({ rows: 4, cols: 4, screen: this._screen })

  charts = {
    diagram: new LineGraph(this, {
      x: 1,
      y: 0,
    }, {
      width: 3,
      height: 4,
    }, 'Processes Gantt diagram'),
    statistics: new Table(this, {
      x: 0,
      y: 0,
    }, {
      width: 1,
      height: 2,
    }, 'Statistics'),
  }

  /**
   * Initialize UI
   * @param {Scheduler} scheduler
   */
  constructor (scheduler) {
    this._scheduler = scheduler
    this.start = moment.duration()

    setInterval(this._refreshDiagram.bind(this), secToMs(0.1))
    setInterval(this._refreshStatistics.bind(this), secToMs(1))
    this._screen.key(['escape', 'q', 'C-c'], (ch, key) => process.exit(0))
  }

  _refreshDiagram () {
    const processes = this._scheduler.processes.toList()

    this.charts.diagram.setData(
      processes.map((process, idx) => ({
        title: process.name,
        style: {
          line: process.getStatus() === "RUNNING"
            ? 'green'
            : 'black'
        },
        x: [moment().format('ss')], // timestamps
        y: [process.getStatus() === "RUNNING" ? idx : 0],
      })),
    )
  }

  _refreshStatistics () {
    const { processes: { residenceTimes, waitingTimes } } = this._scheduler

    this.charts.statistics.setData({
      headers: ['average times'],
      data: [
        ['residence (sec)', calculateAverage(residenceTimes)],
        ['waiting (ms)', calculateAverage(waitingTimes)],
      ],
    })
  }

  render () {
    this._screen.render()
  }

  get grid () {
    return this._screen.grid
  }
}

/**
 *
 * @param {number} seed
 * @return {number[]}
 */
function getRandomColor (seed) {
  return [
    Math.pow(seed, 6),
    Math.pow(seed + 1, 6),
    Math.pow(seed + 2, 6),
  ].map((color) => color % 255)
}

/**
 *
 * @param {number[]} numbers
 * @return {string}
 */
function calculateAverage (numbers) {
  let average = 0

  if (numbers.length > 0) {
    average = numbers.reduce(
      (sum, number) => sum + number,
      0,
    ) / numbers.length
  }
  return average.toFixed(2)
}

module.exports = Screen