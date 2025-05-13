import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header'
import WorkSpace from './components/WorkSpace/WorkSpace'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='app-main-div'>
        <Header />
        <WorkSpace />
      </div>
    </>
  )
}

export default App
