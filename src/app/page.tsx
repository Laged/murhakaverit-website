import { Hero } from '@/components/hero/Hero';
import { CrimeScene } from '@/components/hero/CrimeScene';
import { Summary } from '@/components/Summary';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CrimeScene />
      <Summary />
    </>
  );
}
