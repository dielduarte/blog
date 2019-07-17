import React from "react"
import { graphql } from "gatsby"
import styles from "./blog-post.module.css"
import "highlight.js/styles/default.css"
import "highlight.js/styles/androidstudio.css"
import hljs from "highlight.js/lib/highlight"
import javascript from "highlight.js/lib/languages/javascript"

import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark

    return (
      <Layout location={this.props.location} title={post.frontmatter.title}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <p
          dangerouslySetInnerHTML={{ __html: post.html }}
          className={styles.content}
        />
      </Layout>
    )
  }

  componentDidMount() {
    hljs.registerLanguage("javascript", javascript)
    hljs.initHighlighting()
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
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
      }
    }
  }
`
