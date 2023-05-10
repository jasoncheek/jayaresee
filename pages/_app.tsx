import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Link from 'next/link'
import { ReactEventHandler, useState, useCallback } from 'react'
import getRandomIndex from '../helpers/getRandomIndex';

export default function App({ Component, pageProps }: AppProps) {
  const random_post_index = getRandomIndex(pageProps !== undefined && pageProps !== null ? pageProps.tumblr_posts !== undefined && pageProps.tumblr_posts !== null ? pageProps.tumblr_posts.length : 0 : 0);
  const tumblr_post = pageProps !== undefined && pageProps !== null ? pageProps.tumblr_posts !== null && pageProps.tumblr_posts !==undefined ? pageProps.tumblr_posts[random_post_index] : {} : {};
  const image = tumblr_post.photos !== undefined && tumblr_post.photos.length > 0 ? tumblr_post.photos[0].original_size : {};
  const imgURL = image.url;

  const [ emailSubmitted, setEmailSubmitted ] = useState(false);
  const [ emailLoading, setEmailLoading ] = useState(false);
  
  const handleNewsletterSubmit = async (event: any) => {
    event.preventDefault();
    //console.log(event.target[0].value);
    setEmailLoading(true);
    try {
      await fetch("https://jayaresee.us21.list-manage.com/subscribe/post?u=bbd1f95dfd57c8af9d4fa43ef&amp;id=55f8733376&amp;f_id=00cfbfe1f0", {
        method: "POST",
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          `EMAIL=${event.target[0].value}`
      });
      setEmailLoading(false);
      setEmailSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  }
  
  const router = useRouter()
  if (!router.isFallback && !pageProps) {
      return <ErrorPage statusCode={404} />
  }
  
  return (
    <>
      <div className="site">
        <header
          className="site-header relative bg-neutral-100 h-[3rem]"
        >
          <nav className="site-nav flex justify-between w-full absolute bottom-[-1.35rem] items-center">
            <div className="basis-1/5 text-xs text-neutral-500 leading-tight pl-3">
              <span className="">stories and songs</span>
            </div>
            <div className="basis-3/5">
              <Link
                className="flex justify-center site-nav-logo"
                href="/"
              >
                <img className="w-[200px] h-[44px]" src="https://s3.us-east-2.amazonaws.com/www.jayaresee.com/jayaresee-dark.svg" alt="jay are see" />
              </Link>
            </div>
            <div className="basis-1/5 text-xs text-neutral-500 leading-tight text-right pr-3">
              <span className="">new orleans, louisiana</span>
            </div>
          </nav>
        </header>
        <Component {...pageProps} />
        <div className="jayaresee-tumblr">
          <Link 
            href="https://jayaresee.tumblr.com" 
            target="_blank"
            className="jayaresee-tumblr-overlay"
          >
          </Link>
          <div 
            style={{
              background: imgURL !== undefined ? `no-repeat top center fixed url("${imgURL}")` : "url(https://64.media.tumblr.com/d82a88833605efd82a53b781c37913d9/b3648c69bb01eac5-89/s1280x1920/4ca1f55b97920660a290732857f841c8de887149.jpg) no-repeat top center fixed", 
            }}
            className="block h-[9rem]" 
          >
          </div>
        </div>
        <footer 
          className="relative bg-neutral-800 text-neutral-400"
          style={{ height: "40rem" }}
        >
          <div id="mc_embed_signup" className="w-full absolute bottom-24">
            <form onSubmit={handleNewsletterSubmit} id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_self">
              <div id="mc_embed_signup_scroll" className="flex flex-col items-center text-center">
                <h2 className="w-48 mb-4 text-sm leading-normal">Sign up for my newsletter, and I&apos;ll send you a new song.</h2>
                {/* <div className="indicates-required"><span className="asterisk">*</span> indicates required</div> */}
                <div className="">
                  <div className="mc-field-group">
                    {/*<label htmlFor="mce-EMAIL">Email Address  <span className="asterisk">*</span></label>*/}
                    <input 
                      type="email" 
                      name="EMAIL" 
                      className="required email bg-neutral-900 border-2 border-neutral-700 rounded-t-lg px-4 py-3" 
                      id="mce-EMAIL" 
                      required
                      defaultValue=""
                      placeholder="your email address"
                    />
                    <span id="mce-EMAIL-HELPERTEXT" className="helper_text"></span>
                  </div>
                  <div id="mce-responses" className="clear foot">
                    <div className="response" id="mce-error-response" style={{display: "none"}}></div>
                    <div className="response" id="mce-success-response" style={{display:"none"}}></div>
                  </div>
                  <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true">
                    <input type="text" name="b_bbd1f95dfd57c8af9d4fa43ef_55f8733376" tabIndex={-1} value="" />
                  </div>

                  {emailLoading ?
                    <button 
                      type="submit" 
                      name="subscribe" 
                      id="mc-embedded-subscribe" 
                      className="cursor-pointer font-semibold button py-3 w-full bg-[#002fa7] text-sm text-neutral-200 rounded-b-lg" 
                    >
                      Loading
                    </button>
                    :
                      emailSubmitted ? 
                        <button
                          type="submit" 
                          name="subscribe" 
                          id="mc-embedded-subscribe" 
                          className="cursor-pointer font-semibold button py-3 w-full bg-[#002fa7] text-sm text-neutral-200 rounded-b-lg" 
                        >
                          It&apos;s on the way
                        </button>
                      :
                        <button 
                          type="submit" 
                          name="subscribe" 
                          id="mc-embedded-subscribe" 
                          className="cursor-pointer font-semibold button py-3 w-full bg-neutral-700 text-sm text-neutral-200 rounded-b-lg" 
                        >
                          Send It
                        </button>
                      
                    }
                </div>
              </div>
            </form>
          </div>
          <div 
            className="block tracking-wider uppercase font-semibold text-neutral-300 text-center py-4 bg-neutral-900 absolute bottom-0 w-full"
          >
          </div>
        </footer>
      </div>
    </> 
  )
}