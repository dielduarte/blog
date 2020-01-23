export { default } from "../components/BlogIndex"

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        siteUrl
        config: pt_br {
          rootPath
          title
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "//pt-br/" } }
    ) {
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
