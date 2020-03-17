import '../styles/global.css'
import ExtLink from '../components/ext-link'

export default ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <footer>
      Powered by Now.sh & Notion, Theme by <ExtLink href="https://shud.in">Shu Ding</ExtLink>.
    </footer>
  </>
)
