import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import TaskPlugin from 'rete-task-plugin';
import { TextComp, InputComp } from './components'

import './style.css'

const numSocket = new Rete.Socket("Number value");

class NumComponent extends Rete.Component {
  constructor() {
    super("Number");
    this.task = {
      outputs: {}
    }
  }

  builder(node) {
    console.log(999, node)
    let out = new Rete.Output("key", "Number", numSocket);

    node.addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs[0] = node.data.num;
  }
}

const container = document.querySelector("#rete");
const editor = new Rete.NodeEditor("demo@0.1.0", container);
const engine = new Rete.Engine('demo@0.1.0');

editor.use(ConnectionPlugin);
editor.use(VueRenderPlugin);
editor.use(ContextMenuPlugin);
editor.use(TaskPlugin);

(async () => {
  const coms = {
    textComp: new TextComp(),
    inputComp: new InputComp(),
  }

  Object.values(coms).forEach((c) => {
    editor.register(c)
    engine.register(c)
  })

  console.log('--------c2')
  const n2 = await coms.inputComp.createNode('#input')
  n2.position = [200, 340]
  editor.addNode(n2)


  console.log('--------c3')
  const n3 = await coms.textComp.createNode('#text')
  n3.position = [300, 440]
  editor.addNode(n3)

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.trigger("process");
})()
