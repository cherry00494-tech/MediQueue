import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueueProvider } from './features/queue/QueueProvider'
import { AppLayout } from './layouts/AppLayout'
import { OverviewPage } from './pages/OverviewPage'
import { QueuePage } from './pages/QueuePage'
import { WorkspacePage } from './pages/WorkspacePage'

function App() {
  return (
    <BrowserRouter>
      <QueueProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="queue" element={<QueuePage />} />
            <Route path=":section" element={<WorkspacePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </QueueProvider>
    </BrowserRouter>
  )
}

export default App
