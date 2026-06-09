import Navigation from '../components/Navigation'
import Contact from '../components/Contact'
import PageShell from '../components/PageShell'

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <PageShell
          eyebrow="Contact"
          title="A simple next step for your next launch"
          description="Keep the path direct and welcoming with one clean call to action."
          accent="#2EC4B6"
        >
          <Contact />
        </PageShell>
      </main>
    </>
  )
}
