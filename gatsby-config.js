module.exports = {
  pathPrefix: "/blog",
  siteMetadata: {
    title: `Diel Duarte blog`,
    author: `Diel Duarte`,
    description: `Diel Duarte personal blog`,
    siteUrl: `https://dielduarte.dev`,
    social: {
      twitter: `@diel_duarte`,
    },
    pt_br: {
      rootPath: "/blog/pt-br",
      title: "Bem vindo ao meu blog!",
    },
    en: {
      rootPath: "/blog/",
      title: "Welcome to my blog!",
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-144025823-1`,
      },
    },
    `gatsby-plugin-feed`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Diel Duarte - blog`,
        short_name: `Diel Duarte`,
        start_url: `/`,
        background_color: `#000`,
        theme_color: `#fff`,
        display: `minimal-ui`,
        icon: `static/images/avatar.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Press Start 2P`,
            subsets: [`latin`],
          },
          {
            family: `Roboto`,
            subsets: [`latin`],
          },
          {
            family: `Fira Code`,
            subsets: [`latin`],
          },
        ],
      },
    },
    "gatsby-plugin-remove-serviceworker",
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `dielduarte`
      }
    },
  ],
}
