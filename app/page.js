import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Work from './components/Work'
import Contact from './components/Contact'
import CustomCursor from './components/CustomCursor'

export default function Page() {
  return (
    <>
      <Navigation />
      <main className="relative overflow-hidden">
        <Hero />
        <About />
        <Work />
        <Contact />
        <CustomCursor />
      </main>
    </>
  )
}
