import Rete from 'rete'
import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from 'rete-vue-render-plugin'
import ContextMenuPlugin from 'rete-context-menu-plugin'
import TaskPlugin from 'rete-task-plugin'
import { TextComp, InputComp, AjaxComp, TemplateComp } from './components'
import rpb from './rete-page-bridge'

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
    ajaxComp: new AjaxComp(),
    tplComp: new TemplateComp()
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

  const nodeData = JSON.parse('{"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":{"elmId":"input-a","elmValue":"1"},"inputs":{},"outputs":{"evtAct":{"connections":[{"node":3,"input":"evtAct","data":{}}]},"out":{"connections":[{"node":2,"input":"inputStr","data":{}}]}},"position":[-89.59327156363327,224.07005103321245],"name":"Input"},"2":{"id":2,"data":{},"inputs":{"evtAct":{"connections":[]},"inputStr":{"connections":[{"node":1,"output":"out","data":{}},{"node":4,"output":"out","data":{}}]}},"outputs":{"evtAct":{"connections":[]},"ajaxData":{"connections":[{"node":5,"input":"scope","data":{}}]}},"position":[259.92805833452667,331.0743368895329],"name":"Ajax"},"3":{"id":3,"data":"text","inputs":{"evtAct":{"connections":[{"node":1,"output":"evtAct","data":{}},{"node":4,"output":"evtAct","data":{}}]},"text":{"connections":[{"node":5,"output":"elements","data":{}}]}},"outputs":{},"position":[808.55299005313,40.96220988295448],"name":"Text"},"4":{"id":4,"data":{"elmId":"input-b","elmValue":"1"},"inputs":{},"outputs":{"evtAct":{"connections":[{"node":3,"input":"evtAct","data":{}}]},"out":{"connections":[{"node":2,"input":"inputStr","data":{}}]}},"position":[-85.1912496176552,377.8052984470413],"name":"Input"},"5":{"id":5,"data":{"elmId":"list-tpl"},"inputs":{"scope":{"connections":[{"node":2,"output":"ajaxData","data":{}}]},"evtAct":{"connections":[]}},"outputs":{"elements":{"connections":[{"node":3,"input":"text","data":{}}]},"evtAct":{"connections":[]}},"position":[477.34346662405625,327.6910478168817],"name":"Template"}}}')
  // const nodeData = JSON.parse('{"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":{"elmId":"input-a"},"inputs":{},"outputs":{"evtAct":{"connections":[{"node":3,"input":"evtAct","data":{}}]},"out":{"connections":[{"node":2,"input":"inputStr","data":{}}]}},"position":[41,238],"name":"Input"},"2":{"id":2,"data":{},"inputs":{"evtAct":{"connections":[]},"inputStr":{"connections":[{"node":1,"output":"out","data":{}},{"node":4,"output":"out","data":{}}]}},"outputs":{"evtAct":{"connections":[]},"ajaxData":{"connections":[{"node":3,"input":"text","data":{}}]}},"position":[295,347],"name":"Ajax"},"3":{"id":3,"data":"#text","inputs":{"evtAct":{"connections":[{"node":1,"output":"evtAct","data":{}},{"node":4,"output":"evtAct","data":{}}]},"text":{"connections":[{"node":2,"output":"ajaxData","data":{}}]}},"outputs":{},"position":[547,263],"name":"Text"},"4":{"id":4,"data":{"elmId":"input-b"},"inputs":{},"outputs":{"evtAct":{"connections":[{"node":3,"input":"evtAct","data":{}}]},"out":{"connections":[{"node":2,"input":"inputStr","data":{}}]}},"position":[1,510],"name":"Input"}}}')
  await editor.fromJSON(nodeData)
  await engine.process(nodeData)

  window.engine = engine

  rpb.init(engine)
  setTimeout(() => {
    Array.from(document.querySelectorAll('input'))
      .forEach((it) => {
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
