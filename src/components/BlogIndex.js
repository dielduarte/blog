import React from "react"

import PostList from "./PostList"
import Layout from "./layout"

class BlogIndex extends React.Component {
  render() {
    const { data, location } = this.props
    const { title, siteUrl, config } = data.site.siteMetadata

    return (
      <Layout location={location} title={title} siteUrl={siteUrl} config={config}>
        <PostList
          posts={data.allMarkdownRemark.edges}
          location={location}
          title={title}
          siteUrl={siteUrl}
          config={config}
        />
      </Layout>
    )
  }
}

export default BlogIndex
