import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <div className="site">
      <header
        className="site-header relative bg-neutral-100 h-[3rem]"
      >
        <nav className="site-nav flex justify-between w-full absolute bottom-[-1.35rem] items-center">
          <div className="basis-1/5 text-xs text-neutral-500 leading-tight pl-3">
            <span className="">Stories and Songs</span>
          </div>
          <div className="basis-3/5">
            <a
              className="flex justify-center site-nav-logo"
              href="/"
            >
              <img className="w-[200px] h-[44px]" src="https://s3.us-east-2.amazonaws.com/www.jayaresee.com/jayaresee-dark.svg" alt="JAY ARE SEE" />
            </a>
          </div>
          <div className="basis-1/5 text-xs text-neutral-500 leading-tight text-right pr-3">
            <span className="">New Orleans, Louisiana</span>
          </div>
        </nav>
      </header>
      <Component {...pageProps} />
      <footer 
        className="bg-neutral-800"
        style={{ height: "40rem" }}
      >
        <iframe 
          src="https://jayaresee.substack.com/embed" 
          width="480" 
          height="320" 
          className="newsletter-signup"
        >
        </iframe>
      </footer>
    </div>
  </> 
}
