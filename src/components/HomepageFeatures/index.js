import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Img: require('@site/static/img/bravo.png').default,
    description: (
      <>
       Biosero Data Services APIs are designed with developers in mind. The APIs provide a consistent, well-structured interface to get you up and running quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Img: require('@site/static/img/plug.png').default,
    description: (
      <>
        Our APIs handle order management, identity tracking, event logging, and more—so you can concentrate on creating solutions that accelerate discovery.
      </>
    ),
  },
  {
    title: 'Powered by Flexibility',
    Img: require('@site/static/img/Flask.png').default,
    description: (
      <>
        Biosero Data Services APIs extend seamlessly into your environment. Use them directly, or through our Python and C# SDKs, to integrate with lab automation platforms, ELNs, and informatics systems.
      </>
    ),
  },
];

function Feature({Svg, Img, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {Svg && <Svg className={styles.featureSvg} role="img" />}
        {Img && <img src={Img} className={styles.featureSvg} alt={title} />}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
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
