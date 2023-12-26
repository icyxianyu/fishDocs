import { Hero } from 'shared/types';

interface Props {
  hero: Hero;
}
export const HomeHero = ({ hero }: Props) => {
  return (
    <div className="pt-20 flex px-10 max-w-screen-xl m-auto w-[100%]">
      <div>
        {/*  */}
        <div className="flex flex-col mb-5">
          <div className="text-8xl font-black">{hero.name}</div>
          <div className="text-6xl font-black mt-2">{hero.tagline}</div>
          <div className="text-3xl font-medium mt-6">{hero.text}</div>
        </div>
        {/*  */}
        <div className="flex fish-button-group">
          {hero.actions.map((action) => (
            <div key={action.text} className="p-3 cursor-pointer">
              <a
                className="inline-block text-xl fish-button
                px-5  rounded-3xl leading-12"
                href={action.link}
              >
                {action.text}
              </a>
            </div>
          ))}
        </div>
      </div>
      {/*  */}
      <div className="w-1/3 ml-10 b-10 flex">
        <img
          className="m-auto w-100%"
          src={hero.image.src}
          alt={hero.image.alt}
        />
      </div>
    </div>
  );
};
