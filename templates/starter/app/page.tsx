import { Container, EditorialList, SectionHeading } from '@/components/common/primitives';
import { Reveal } from '@/components/common/motion';
import { Hero, ProofLine } from '@/components/home/hero';
import { RequestForm } from '@/components/home/request-form';

// site-kit starter copy: every section below is sample content for the site-build step to replace.
const work = [
  { title: 'Harbor Noodle Bar', body: 'A 9-metre line with drawer fridges under the pass, fitted over two Sunday closures.' },
  { title: 'Oak & Ember Bakery', body: 'Flour bins that roll out from under the bench, and a proofing cabinet built to the oven door height.' },
  { title: 'Sixth Street Café', body: 'A back bar reorganized around one barista’s reach, so the morning rush needs one fewer person.' },
];

const process = [
  { title: 'Site measure', body: 'A builder measures your kitchen during service and watches how the line actually moves.' },
  { title: 'Fixed quote in five days', body: 'Drawings and one price. The price does not change once we cut the first board.' },
  { title: 'Built off-site', body: 'Cabinetry is made in our shop while you keep cooking.' },
  { title: 'Two-day install', body: 'We fit everything across a closure you choose, and leave the kitchen ready for service.' },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofLine />

      <section id="work" className="scroll-mt-24 pt-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Finished kitchens" title="Recent fit-outs, and what changed for the cooks." />
            <EditorialList items={work} />
          </Reveal>
        </Container>
      </section>

      <section id="process" className="scroll-mt-24 pt-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal>
            <SectionHeading eyebrow="How a fit-out runs" title="Six weeks, two closed days." className="mb-0" />
          </Reveal>
          <Reveal>
            <EditorialList items={process} />
          </Reveal>
        </Container>
      </section>

      <section id="contact" className="scroll-mt-24 pt-32">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Book a measure" title="Tell us where the kitchen is. We will bring the tape." description="A builder calls you within one working day to set a time that suits service." />
            <RequestForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
