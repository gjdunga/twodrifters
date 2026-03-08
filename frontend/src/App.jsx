import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import Journey from './pages/Journey'
import TempleChildren from './pages/TempleChildren'
import TempleAncestors from './pages/TempleAncestors'
import Contact from './pages/Contact'

export default function App() {
  const location = useLocation()

  return (
    <>
      <div className="noise-overlay" />
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/temple-of-children" element={<TempleChildren />} />
            <Route path="/temple-of-ancestors" element={<TempleAncestors />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  )
}
