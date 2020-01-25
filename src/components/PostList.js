import React from "react"
import { Link } from "gatsby"

import SEO from "../components/seo"

import styles from "./PostList.module.css"

function PostList({ location, title, siteUrl, posts, config }) {
  return (
    <>
      <SEO title="All posts" />
      <section className={styles.posts}>
        {posts.map(({ node }, index) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <Link
              to={node.fields.slug}
              className={styles.post}
              title="title"
              key={index}
            >
              <article key={node.fields.slug}>
                <h3 className={styles.title}>{title}</h3>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                  className={styles.description}
                />
              </article>
            </Link>
          )
        })}
      </section>
    </>
  )
}

export default PostList
