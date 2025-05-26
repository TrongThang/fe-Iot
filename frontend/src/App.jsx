import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index'
import './index.css'

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
