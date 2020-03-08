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

module.exports = sigstop

let registerCallback = null

////////////

function sigstop (callback) {
  if (!registerCallback) {
    if (process.platform !== "linux") {
      process.openStdin().on('keypress', (chunk, key) => {
        if (key && key.name === 'c' && key.ctrl) {
          registerCallback('SIGINT')
          return process.exit(0)
        }
      })
      process.stdin.setRawMode(true)
    } else {
      registerClosingSignals()
    }
  }

  registerCallback = callback

  ////////////

  function registerClosingSignals () {
    const signals = [
      'SIGABRT',
      'SIGALRM',
      'SIGBUS',
      'SIGFPE',
      'SIGHUP',
      'SIGILL',
      'SIGINT',
      'SIGQUIT',
      'SIGSEGV',
      'SIGTERM',
      'SIGUSR1',
      'SIGUSR2',
      'SIGSYS',
      'SIGTRAP',
      'SIGVTALRM',
      'SIGXFSZ',
    ]

    signals.forEach((signal) => process.on(signal, () => {
      if (registerCallback) {
        registerCallback(signal)
      }
    }))
  }
}
