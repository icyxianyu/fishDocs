import { Feature } from 'shared/types';

interface Props {
  features: Feature[];
}

export const HomeFeature = ({ features }: Props) => {
  return (
    <div className="pt-20 flex px-10 max-w-screen-2xl m-auto flex-wrap justify-between">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="w-3/10 mb-15 fish-card p-6 box-border rounded-xl"
        >
          <div className="flex flex-col">
            <div className="text-6xl font-black mb-5">{feature.icon}</div>
            <div className="text-xl font-black">{feature.title}</div>
            <div className="text-xl font-medium mt-6">{feature.details}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
