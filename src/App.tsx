import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import { SKDB } from 'skdb'
import dump from './skdb-1682625202006.sql?raw'
import './App.css'

function App() {
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const runSKDB = async () => {
      const skdb = await SKDB.create()

      // @ts-ignore
      window.skdb = skdb

      // TODO - comment in -> will fail with "invariant violation: Chr called on invalid Unicode code point: 55356"
      // const res2 = skdb.sqlRaw(dump)

      const stmnts = dump
        .split(';\n')
        .filter((_) => _.trim() !== '')
        .map((_) => _ + ';')

      console.log(`Running ${stmnts.length} statements...`)

      let i = 0
      for (const stmnt of stmnts) {
        i++
        const progress = (i / stmnts.length) * 100

        const res = skdb.sql(stmnt)
        // console.log(stmnt)
        // console.log(res)

        if (i % 1000 === 0) {
          printProgress(progress)
          await new Promise((resolve) => setTimeout(resolve, 0))
        }
      }
    }

    runSKDB()
  }, [])

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React + SKDB</h1>
      <div className="card">
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  )
}

export default App

/** Print as:
 * ===_________________
 * =========___________
 */
const printProgress = (progress: number) => {
  const width = 40
  const percent = progress.toFixed(2).padStart(6, ' ')
  const bar = '='.repeat((progress / 100) * width).padEnd(width, '_')
  console.log(`${bar} ${percent}%`)
}
