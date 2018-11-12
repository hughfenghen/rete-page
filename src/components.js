import Rete from 'rete'

const actSocket = new Rete.Socket('Action')
const dataSocket = new Rete.Socket('Data')

function sleep (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

async function ajax () {
  await sleep(2000)
  return {
    code: 200,
    data: {
      t: Math.random()
    }
  }
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
    console.log(333, 'input init')
    document.querySelector('#input')
      .addEventListener('input', (e) => {
        task.run(e.target.value)
        task.reset()
      })
  }

  builder (node, ...args) {
    node.addOutput(new Rete.Output('evtAct', 'option', actSocket))
    node.addOutput(new Rete.Output('out', 'input str', dataSocket))
  }

  worker (node, inputs, data) {
    console.log('------input worker:', inputs, data)
    return { out: data }
  }
}

export class AjaxComp extends Rete.Component {
  constructor () {
    super('Ajax')
    this.task = {
      outputs: {
        evtAct: 'option',
        ajaxData: 'output'
      },
      init (task) {
        console.log(3333, 'ajax init')
      }
    }
  }

  builder (node) {
    node
      .addInput(new Rete.Input('evtAct', 'option', actSocket))
      .addInput(new Rete.Input('inputStr', 'input str', dataSocket))
      .addOutput(new Rete.Output('evtAct', 'option', actSocket))
      .addOutput(new Rete.Output('ajaxData', 'ajax data', dataSocket))
  }

  async worker (node, inputs, data) {
    console.log('------ajax worker:', inputs, data)

    const rs = await ajax()
    console.log('------ajax result:', rs)
    return { ajaxData: rs }
  }
}

export class TextComp extends Rete.Component {
  constructor () {
    super('Text')
    this.task = {
      outputs: {},
      init (task) {
        console.log(3333, 'text init')
      }
    }
  }

  builder (node) {
    node.addInput(new Rete.Input('evtAct', 'option', actSocket))
      .addInput(new Rete.Input('text', 'data', dataSocket))
  }

  async worker (node, inputs, outputs) {
    console.log('-----text worker:', inputs, outputs)
  }
}
