import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import styles from "./index.module.css"
import getRandomBg from "../utils/getRandomBg"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const { title, siteUrl } = data.site.siteMetadata

    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={title} siteUrl={siteUrl}>
        <SEO title="All posts" />
        <section className={styles.posts}>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <Link to={node.fields.slug} className={styles.post}>
                <article key={node.fields.slug}>
                  <h3 className={styles.title}>{title}</h3>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.frontmatter.description || node.excerpt,
                    }}
                    className={styles.description}
                  />
                  <small
                    className={styles.date}
                    style={{ backgroundColor: getRandomBg() }}
                  >
                    {node.frontmatter.date}
                  </small>
                </article>
              </Link>
            )
          })}
        </section>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
