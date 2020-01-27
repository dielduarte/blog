import React from "react"
import { graphql, Link } from "gatsby"
import styles from "./blog-post.module.css"
import { Disqus } from 'gatsby-plugin-disqus'

import Layout from "../components/layout"
import SEO from "../components/seo"
import globalStyles from '../global.module.css'

class BlogPostTemplate extends React.Component {
  render() {
    const { markdownRemark: post, site } = this.props.data
    const config = site.siteMetadata[post.frontmatter.languageKey]
    let disqusConfig = {
      url: `${site.siteMetadata.siteUrl+window.location.pathname}`,
      identifier: post.id,
      title: post.frontmatter.title,
    }

    return (
      <Layout
        location={this.props.location}
        title={post.frontmatter.title}
        config={config}
        languageLink={post.frontmatter.languageLink}
      >
        <Link
          to={post.frontmatter.languageLink}
          className={globalStyles.prefetchLink}
        >
          {post.frontmatter.languageLink}
        </Link>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <div
          dangerouslySetInnerHTML={{ __html: post.html }}
          className={styles.content}
        />
        <Disqus config={disqusConfig} />
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
        languageLink
      }
    }
  }
`
