import Rete from 'rete'
import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from 'rete-vue-render-plugin'
import ContextMenuPlugin from 'rete-context-menu-plugin'
import TaskPlugin from 'rete-task-plugin'
import { TextComp, InputComp, AjaxComp } from './components'
import rpb from './rete-page-bridge'

import './style.css'

const container = document.querySelector('#rete')
const editor = new Rete.NodeEditor('demo@0.1.0', container)
const engine = new Rete.Engine('demo@0.1.0')

editor.use(ConnectionPlugin)
editor.use(VueRenderPlugin)
editor.use(ContextMenuPlugin)
editor.use(TaskPlugin) // or engine.use(TaskPlugin)

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

  editor.on(
    'process nodecreated noderemoved connectioncreated connectionremoved',
    async () => {
      await engine.abort()
      await engine.process(editor.toJSON())
    }
  )

  // editor.trigger('process')

  const nodeData = JSON.parse('{"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":{"elmId":"input-a"},"inputs":{},"outputs":{"evtAct":{"connections":[{"node":3,"input":"evtAct","data":{}}]},"out":{"connections":[{"node":2,"input":"inputStr","data":{}}]}},"position":[41,238],"name":"Input"},"2":{"id":2,"data":{},"inputs":{"evtAct":{"connections":[]},"inputStr":{"connections":[{"node":1,"output":"out","data":{}},{"node":4,"output":"out","data":{}}]}},"outputs":{"evtAct":{"connections":[]},"ajaxData":{"connections":[{"node":3,"input":"text","data":{}}]}},"position":[295,347],"name":"Ajax"},"3":{"id":3,"data":"#text","inputs":{"evtAct":{"connections":[{"node":1,"output":"evtAct","data":{}},{"node":4,"output":"evtAct","data":{}}]},"text":{"connections":[{"node":2,"output":"ajaxData","data":{}}]}},"outputs":{},"position":[547,263],"name":"Text"},"4":{"id":4,"data":{"elmId":"input-b"},"inputs":{},"outputs":{"evtAct":{"connections":[{"node":3,"input":"evtAct","data":{}}]},"out":{"connections":[{"node":2,"input":"inputStr","data":{}}]}},"position":[1,510],"name":"Input"}}}')
  await editor.fromJSON(nodeData)
  await engine.process(nodeData)

  window.engine = engine

  rpb.init(engine)
  setTimeout(() => {
    Array.from(document.querySelectorAll('input'))
      .forEach((it) => {
        console.log(9999, it.id)
        const emit = rpb.bindPageElement(it.id)
        it.oninput = (evt) => {
          emit(evt.target.value)
        }
      })
  }, 1000)

  document.querySelector('#to-json').addEventListener('click', () => {
    console.log(JSON.stringify(editor.toJSON()))
  })
})()
