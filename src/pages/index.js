import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';
import Link from "@docusaurus/core/lib/client/exports/Link";
import 'animate.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
          <img className={styles.tagline}  src="img/202108231635263.jpeg" alt="头像"/>
          <h1 className="hero__title animate__animated animate__fadeInDownBig">{siteConfig.title}</h1>
          <p className="animate__animated animate__heartBeat" style={{ fontWeight:"bold"}} >Keep Working</p>
          <div className={styles.buttons}>
              <Link
                  className="button button--secondary button--lg animate__animated animate__heartBeat"
                  to="/docs/Home">
                  Blog →
              </Link>
          </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`你好啊${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
