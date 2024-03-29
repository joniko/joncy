import fs from "fs";

import * as React from "react";
import {GetStaticProps} from "next";
import Head from "next/head";

import {Job} from "../job/types";
import api from "../job/api";
import JobsScreen from "../job/screens/Jobs";
import {buildSitemap} from "../app/utils/sitemap";

// Set revalidation every 6 hours
const REVALIDATION_SECONDS = 3600 * 6;

interface Props {
  jobs: Job[];
  builtAt: number;
  revalidatedAt: number;
}

const IndexRoute: React.FC<Props> = ({jobs, builtAt, revalidatedAt}) => {
  console.info(`Joncy has build and revalidation times set at: `, builtAt, revalidatedAt);

  return (
    <>
      <Head>
        <title>Joncy - Trabajos IT</title>
        <meta content="initial-scale=1.0, width=device-width" name="viewport" />
        {/* Start meta tags */}
        <meta content="goncy" name="author" />
        <meta content="Gonzalo Pozzo" name="copyright" />
        <meta
          content="Joncy es un portal de empleos relevantes para la comunidad, con beneficios para empresas con búsquedas para primer trabajo o minorías"
          name="description"
        />
        <meta content="purple" name="theme-color" />
        <meta content="trabajo,frontend,backend,trainee,junior,semisenior,senior" name="keywords" />
        <meta content="Joncy - Trabajos IT" property="og:site_name" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="@goncy" name="twitter:creator" />
        <meta content="@goncy" name="twitter:site" />
        <meta content="Joncy - Trabajos IT" name="twitter:title" />
        <meta
          content="Joncy es un portal de empleos relevantes para la comunidad, con beneficios para empresas con búsquedas para primer trabajo o minorías"
          property="og:description"
        />
        <meta content={`${process.env.NEXT_PUBLIC_URL}/assets/banner.jpg`} property="og:image" />
        <meta
          content={`${process.env.NEXT_PUBLIC_URL}/assets/banner.jpg`}
          property="og:image:secure"
        />
        <meta
          content={`${process.env.NEXT_PUBLIC_URL}/assets/banner.jpg`}
          property="og:image:url"
        />
        <meta content="image/jpeg" property="og:image:type" />
        <meta content="1920" property="og:image:width" />
        <meta content="200" property="og:image:height" />
        <meta content="Joncy - Trabajos IT" property="og:image:alt" />
        {/* End meta tags */}
      </Head>
      <JobsScreen jobs={jobs} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Get jobs list
  const jobs = await api.list();

  if (process.env.NODE_ENV === "production") {
    // Build sitemap for all the jobs only in production
    fs.writeFileSync("public/sitemap.xml", buildSitemap(jobs));
  }

  return {
    // Revalidate every 6 hours
    revalidate: REVALIDATION_SECONDS,
    props: {
      jobs,
      // Get when the page was built
      builtAt: +new Date(),
      // Multiply revalidation seconds * 1000 so we get milliseconds back
      revalidatedAt: +new Date() + REVALIDATION_SECONDS * 1000,
    },
  };
};

export default IndexRoute;
