import Rete from 'rete'

const actSocket = new Rete.Socket('Action')
const dataSocket = new Rete.Socket('Data')

function sleep (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

function ajax () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          t: Math.random()
        }
      })
    }, 2000)
  })
}

export class InputComp extends Rete.Component {
  constructor () {
    super('Input')
    this.task = {
      outputs: { evtAct: 'option', 'out': 'output' },
      init: this.init
    }
  }

  init (task, node) {
    node._run = (value) => {
      node.data.elmValue = value
      task.run(value, true)
    }
  }

  builder (node, ...args) {
    node.addOutput(new Rete.Output('evtAct', 'option', actSocket))
    node.addOutput(new Rete.Output('out', 'input str', dataSocket))
  }

  worker (node, inputs, data) {
    console.log('------input worker:', data)
    return { out: node.data.elmValue }
  }
}

export class AjaxComp extends Rete.Component {
  constructor () {
    super('Ajax')
    this.task = {
      outputs: {
        evtAct: 'option',
        ajaxData: 'output'
      }
    }
  }

  builder (node) {
    node
      // .addInput(new Rete.Input('evtAct', 'option', actSocket, true))
      .addInput(new Rete.Input('inputStr', 'input str', dataSocket, true))
      // .addOutput(new Rete.Output('evtAct', 'option', actSocket, true))
      .addOutput(new Rete.Output('ajaxData', 'ajax data', dataSocket, true))
  }

  async worker (node, inputs, data) {
    console.log('------ajax worker:', inputs, data)

    return {
      ajaxData: ajax().then(({ data }) => data)
    }
  }
}

export class TextComp extends Rete.Component {
  constructor () {
    super('Text')
    this.task = {
      outputs: {},
      init: this.init
    }
  }

  init (task, node) {
    node._run = task.run
  }

  builder (node) {
    node.addInput(new Rete.Input('evtAct', 'option', actSocket, true))
      .addInput(new Rete.Input('text', 'data', dataSocket))
  }

  async worker (node, inputs, outputs) {
    console.log('-----text worker:', inputs, outputs)
    document.querySelector(node.data).innerHTML = JSON.stringify(inputs.text[0])
  }
}
