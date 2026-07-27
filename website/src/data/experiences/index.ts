import temple from './temple.json';
import forest from './forest.json';
import ocean from './ocean.json';

export const experiences = [
  {
    ...temple,
    href: '/studio/experiences/temple/',
  },
  {
    ...forest,
    href: '/studio/experiences/forest/',
  },
  {
    ...ocean,
    href: '/studio/experiences/ocean/',
  },
];

export type Experience = (typeof experiences)[number];
