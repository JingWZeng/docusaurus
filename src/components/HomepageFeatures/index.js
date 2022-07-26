import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Supports Me',
    description: (
      <>
          Give me a star at here <a href="https://github.com/JingWZeng" target="_blank">GitHub</a>
      </>
    ),
  },
  {
    title: 'About Me',
    description: (
      <>
          Now looking for a good job
      </>
    ),
  },
  {
    title: 'Contact Me',
    description: (
      <>
          Wechat: 19129210905
      </>
    ),
  },
];

function Feature({ title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3 className='animate__animated animate__heartBeat'>{title}</h3>
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
