import Navigation from '../components/Navigation'
import Projects from '../components/Projects'
import PageShell from '../components/PageShell'

export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <PageShell
          eyebrow="Projects"
          title="Case studies and launch-ready ideas"
          description="A clean, route-based layout for your highlights without the old 3D runtime complexity."
          accent="#FF6B6B"
        >
          <Projects />
        </PageShell>
      </main>
    </>
  )
}
