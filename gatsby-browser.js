require("prismjs/themes/prism-tomorrow.css")
const React = require("react")
const SettingsLayout = require("./src/components/SettingsLayout").default

exports.wrapPageElement = ({ element, props }) => {
  return <SettingsLayout {...props}>{element}</SettingsLayout>
}