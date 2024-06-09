import './styles/GlobalStyles.css'

import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { persistor, store } from './store/store.ts'
import App from './App.tsx'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Toaster position='top-right' reverseOrder={false} containerClassName='overflow-auto' />
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
