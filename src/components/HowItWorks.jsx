import React, { useRef } from 'react'
import { chipImg, frameImg, frameVideo } from '../utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
import { animateWithGsap } from '../utils/animations';

const HowItWorks = () => {
  const videoRef = useRef();

  useGSAP(() => {
    gsap.from('#chip', {
      scrollTrigger: {
        trigger: '#chip',
        start: '20% bottom'
      },
      opacity: 0,
      scale: 2,
      duration: 2,
      ease: 'power2.inOut'
    })

    animateWithGsap('.g_fadeIn', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.inOut'
    })
  }, []);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        <div id="chip" className="flex-center w-full my-20">
          <img src={chipImg} alt="chip" width={180} height={180} />
        </div>

        <div className="flex flex-col items-center">
          <h2 className="hiw-title">
            iPhone 16 Pro with A17 Pro chip.
            <br /> Unleashing next-level performance.
        </h2>

            <p className="hiw-subtitle">
            Experience the future. The most powerful Apple GPU ever built.
            </p>

        </div>

        <div className="mt-10 md:mt-20 mb-14">
          <div className="relative h-full flex-center">
            <div className="overflow-hidden">
              <img 
                src={frameImg}
                alt="frame"
                className="bg-transparent relative z-10"
              />
            </div>
            <div className="hiw-video">
                <video className="pointer-events-none" playsInline preload="none" muted autoPlay ref={videoRef}>
                  <source src={frameVideo} type="video/mp4" />
                </video>
              </div>
          </div>
          </div>

          <div className="hiw-text-container">
                <div className="flex flex-1 justify-center flex-col">
                  <p className="hiw-text g_fadeIn">
                    <span className="text-white">A17 Pro</span> redefines mobile computing with our {' '}
                    <span className="text-white">
                        most advanced GPU ever
                    </span>.
                </p>

                  <p className="hiw-text g_fadeIn">
                    Prepare for {' '}
                    <span className="text-white">
                        console-level visuals on your iPhone
                    </span>,
                    with rich textures, lifelike lighting, and ultra-smooth gameplay.
                </p>
                </div>
              

              <div className="flex-1 flex justify-center flex-col g_fadeIn">
                <p className="hiw-text">Introducing</p>
                <p className="hiw-bigtext">Next-gen GPU</p>
                <p className="hiw-text">powered by 6-core design</p>
            </div>
              </div>
            </div>
    </section>
  )
}

export default HowItWorks