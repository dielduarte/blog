import React from "react"
import { graphql } from "gatsby"
import styles from "./blog-post.module.css"

import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogPostTemplate extends React.Component {
  render() {
    const { markdownRemark: post, site } = this.props.data
    const config = site.siteMetadata[post.frontmatter.languageKey]

    return (
      <Layout
        location={this.props.location}
        title={post.frontmatter.title}
        config={config}
      >
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <div
          dangerouslySetInnerHTML={{ __html: post.html }}
          className={styles.content}
        />
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
        pt_br {
          rootPath
          title
        }
        en {
          rootPath
          title
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        languageKey
      }
    }
  }
`
