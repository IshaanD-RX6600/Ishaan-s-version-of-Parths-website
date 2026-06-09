import Navigation from '../components/Navigation'
import About from '../components/About'
import PageShell from '../components/PageShell'

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <PageShell
          eyebrow="About"
          title="Sunny, calm, and easy to navigate"
          description="This route keeps the portfolio aligned with a simple, supportive visual voice and a lighter runtime path."
          accent="#2EC4B6"
        >
          <About />
        </PageShell>
      </main>
    </>
  )
}
