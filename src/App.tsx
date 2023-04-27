import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import { SKDB } from 'skdb'
import dump from './dump.sql?raw'
import './App.css'

function App() {
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const runSKDB = async () => {
      const skdb = await SKDB.create()

      // @ts-ignore
      window.skdb = skdb

      const stmnts = dump
        .split(';\n')
        .filter((_) => _.trim() !== '')
        .map((_) => _ + ';')

      for (const stmnt of stmnts) {
        const res = skdb.sql(stmnt)
        // console.log(stmnt)
        // console.log(res)
      }

      const testStmt = `\
      select id, name, ownerId, ownerName, colorsString, imageUrl, 'LibraryPlaylist' as _tag, trackCount
      from view__playlists_with_track_counts
      order by name ASC;`

      // ERROR -> this returns a "null row" but should only return a single row
      // 0: {id: null, name: null, ownerId: null, ownerName: null, colorsString: null, …}
      // 1: {id: 'podcast:playlist:clgz9riqw000d3b6emzyjak9r', name: 'VISION Radio', ownerId: 'TODO', ownerName: 'TODO', colorsString: null, …}

      const res = skdb.sql(testStmt)
      console.log(res)
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
