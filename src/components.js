import Rete from "rete";

var actionSocket = new Rete.Socket("Action");
var dataSocket = new Rete.Socket("Data");

var eventHandlers = {
  list: [],
  remove() {
    this.list.forEach(([evtName, h]) => {
      document.removeEventListener(evtName, h);
    });
    this.list = [];
  },
  add(evtName, h) {
    document.addEventListener(evtName, h, false);
    this.list.push([evtName, h]);
  }
};

export class InputComp extends Rete.Component {
  constructor() {
    super("Input");
    this.task = {
      outputs: {inputEvt: 'option'},
      init: this.init,
    };
  }

  init(task, node) {
    document.querySelector('#input')
      .oninput = (e) => {
        task.run(e.target.value);
        task.reset();
      }
  }

  builder(node, ...args) {
    node.addOutput(new Rete.Output('inputEvt', "inputEvt", dataSocket));
  }

  worker(node, inputs, data) {
    console.log('user input:', data)
  }
}

export class TextComp extends Rete.Component {
  constructor() {
    super("Text");
    this.task = {
      outputs: {}
    };
  }

  builder(node) {
    node.addInput(new Rete.Input('input', "input", dataSocket));
  }

  worker(node, inputs, data) {
    console.log("text receive:", data);
  }
}

class EnterPressComp extends Rete.Component {
  constructor() {
    super("Enter pressed");
    this.task = {
      outputs: ["option", "option"]
    };
  }

  builder(node) {
    node.addInput(new Rete.Input("", actionSocket));
    node.addInput(new Rete.Input("Key code", dataSocket));
    node.addOutput(new Rete.Output("Tren", actionSocket));
    node.addOutput(new Rete.Output("Else", actionSocket));
  }

  worker(node, inputs) {
    if (inputs[0][0] == 13) this.closed = [1];
    else this.closed = [0];
    console.log("Print", node.id, inputs);
  }
}

class MessageControl extends Rete.Control {
  constructor(emitter, msg) {
    super();
    this.emitter = emitter;
    this.template = '<input :value="msg" @input="change($event)"/>';

    this.scope = {
      msg,
      change: this.change.bind(this)
    };
  }

  change(e) {
    this.scope.value = +e.target.value;
    this.update();
  }

  update() {
    this.putData("msg", this.scope.value);
    this.emitter.trigger("process");
    this._alight.scan();
  }

  mounted() {
    this.scope.value = this.getData("msg") || 0;
    this.update();
  }

  setValue(val) {
    this.scope.value = val;
    this._alight.scan();
  }
}

class AlertComp extends Rete.Component {
  constructor() {
    super("Alert");
    this.task = {
      outputs: []
    };
  }

  builder(node) {
    var ctrl = new MessageControl(this.editor, node.data.msg);

    node.addControl(ctrl);
    node.addInput(new Rete.Input("ff", actionSocket));
  }

  worker(node, inputs) {
    console.log("Alert", node.id, node.data);
    alert(node.data.msg);
  }
}
