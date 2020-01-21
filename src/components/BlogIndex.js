import React from "react"

import PostList from "./PostList"

class BlogIndex extends React.Component {
  render() {
    const { data, location } = this.props
    const { title, siteUrl, config } = data.site.siteMetadata

    return (
      <PostList
        posts={data.allMarkdownRemark.edges}
        location={location}
        title={title}
        siteUrl={siteUrl}
        config={config}
      />
    )
  }
}

export default BlogIndex
