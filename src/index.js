import Rete from 'rete'
import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from 'rete-vue-render-plugin'
import ContextMenuPlugin from 'rete-context-menu-plugin'
import TaskPlugin from 'rete-task-plugin'
import { TextComp, InputComp, AjaxComp } from './components'

import './style.css'

const container = document.querySelector('#rete')
const editor = new Rete.NodeEditor('demo@0.1.0', container)
const engine = new Rete.Engine('demo@0.1.0')

editor.use(ConnectionPlugin)
editor.use(VueRenderPlugin)
editor.use(ContextMenuPlugin)
editor.use(TaskPlugin)

;(async () => {
  const coms = {
    textComp: new TextComp(),
    inputComp: new InputComp(),
    ajaxComp: new AjaxComp()
  }

  Object.values(coms).forEach((c) => {
    editor.register(c)
    engine.register(c)
  })

  const n1 = await coms.inputComp.createNode('#input')
  n1.position = [100, 100]
  editor.addNode(n1)

  const n2 = await coms.ajaxComp.createNode()
  n2.position = [200, 200]
  editor.addNode(n2)

  const n3 = await coms.textComp.createNode('#text')
  n3.position = [300, 300]
  editor.addNode(n3)

  editor.on(
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      await engine.abort()
      await engine.process(editor.toJSON())
    }
  )

  // editor.trigger('process')
  // await editor.fromJSON(JSON.parse('{"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":"#input","inputs":{},"outputs":{"evtAct":{"connections":[{"node":3,"input":"evtAct","data":{}}]},"out":{"connections":[{"node":2,"input":"inputStr","data":{}}]}},"position":[41,238],"name":"Input"},"2":{"id":2,"data":{},"inputs":{"inputStr":{"connections":[{"node":1,"output":"out","data":{}}]}},"outputs":{"ajaxData":{"connections":[{"node":3,"input":"text","data":{}}]}},"position":[295,347],"name":"Ajax"},"3":{"id":3,"data":"#text","inputs":{"evtAct":{"connections":[{"node":1,"output":"evtAct","data":{}}]},"text":{"connections":[{"node":2,"output":"ajaxData","data":{}}]}},"outputs":{},"position":[547,263],"name":"Text"}}}'))
  await editor.fromJSON(JSON.parse('{"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":"#input","inputs":{},"outputs":{"evtAct":{"connections":[{"node":2,"input":"evtAct","data":{}}]},"out":{"connections":[{"node":2,"input":"inputStr","data":{}}]}},"position":[41,238],"name":"Input"},"2":{"id":2,"data":{},"inputs":{"evtAct":{"connections":[{"node":1,"output":"evtAct","data":{}}]},"inputStr":{"connections":[{"node":1,"output":"out","data":{}}]}},"outputs":{"evtAct":{"connections":[{"node":3,"input":"evtAct","data":{}}]},"ajaxData":{"connections":[{"node":3,"input":"text","data":{}}]}},"position":[295,347],"name":"Ajax"},"3":{"id":3,"data":"#text","inputs":{"evtAct":{"connections":[{"node":2,"output":"evtAct","data":{}}]},"text":{"connections":[{"node":2,"output":"ajaxData","data":{}}]}},"outputs":{},"position":[547,263],"name":"Text"}}}'))
  await engine.process(editor.toJSON())

  document.querySelector('#to-json').addEventListener('click', () => {
    console.log(JSON.stringify(editor.toJSON()))
  })
})()
