import React, { useEffect } from "react"
import { Link } from "gatsby"

import globalStyles from '../global.module.css'
import PostList from "./PostList"
import Layout from "./layout"

const getUniqueId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const UNIQUE_ID_KEY = 'uniqueId'

function BlogIndex(props) {
  const { data, location } = props
  const { title, siteUrl, config } = data.site.siteMetadata

  useEffect(() => {
    const identify = () => {
      const uniqueId = localStorage.getItem('uniqueId')

      if(uniqueId && window.Appcues) {
        window.Appcues.identify(uniqueId)
      } else if(uniqueId && !window.Appcues) {
        setTimeout(identify, 300)
      } else {
        localStorage.setItem(UNIQUE_ID_KEY, getUniqueId())
        identify();
      };
    }

    identify();
  }, [])

  return (
    <Layout
      location={location}
      title={title}
      siteUrl={siteUrl}
      config={config}
    >
      <Link
        to="/"
        className={globalStyles.prefetchLink}
      >
        Home
      </Link>
      <Link
        to="/pt-br"
        className={globalStyles.prefetchLink}
      >
        pt-br
      </Link>
      <PostList
        posts={data.allMarkdownRemark.edges}
      />
    </Layout>
  )
}

export default BlogIndex
