import React from "react"
import { Link } from "gatsby"

import globalStyles from '../global.module.css'
import PostList from "./PostList"
import Layout from "./layout"

function BlogIndex(props) {
  const { data, location } = props
  const { title, siteUrl, config } = data.site.siteMetadata

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
