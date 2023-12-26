import { HomeFeature } from './homefeature';
import { HomeHero } from './homehero';
import { usePageData } from '../../../runtime';
export const Home = () => {
  const { frontmatter } = usePageData();
  const { hero, features } = frontmatter ?? {};
  return (
    <div className="fish-background flex flex-col">
      <HomeHero hero={hero} />
      <HomeFeature features={features} />
    </div>
  );
};
