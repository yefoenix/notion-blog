import '../styles/global.css'
import ExtLink from '../components/ext-link'

export default ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <footer>
      Powered by Now.sh & Notion, Theme by <abbr title="https://shud.in">Shu Ding</abbr>.
    </footer>
  </>
)
