import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '68 GTM Projects',
    Svg: require('@site/static/img/icon-projects.svg').default,
    description: (
      <>
        Battle-tested playbooks covering the full GTM lifecycle—from growth modeling
        and lead routing to CRM migrations and commission planning.
      </>
    ),
  },
  {
    title: 'Execution-Ready',
    Svg: require('@site/static/img/icon-execution.svg').default,
    description: (
      <>
        Step-by-step procedures, not just strategy. Each playbook includes
        detailed tasks, time estimates, and success metrics.
      </>
    ),
  },
  {
    title: 'Built for Scale',
    Svg: require('@site/static/img/icon-scale.svg').default,
    description: (
      <>
        Frameworks designed for B2B tech startups ready to professionalize
        their RevOps and accelerate revenue growth.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
