import Navigation from '../components/Navigation'
import Skills from '../components/Skills'
import PageShell from '../components/PageShell'

export default function SkillsPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <PageShell
          eyebrow="Skills"
          title="The practical toolkit behind the look"
          description="This page highlights your capabilities in a calm, readable grid that works well on every screen."
          accent="#FFD166"
        >
          <Skills />
        </PageShell>
      </main>
    </>
  )
}
