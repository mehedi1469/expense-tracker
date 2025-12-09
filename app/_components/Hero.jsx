import React from 'react'
import Image from 'next/image'
function Hero() {
  return (
    <div>
      <section className="bg-white flex items-center flex-col">
  <div className="mx-auto w-screen max-w-screen-xl px-4 py-32 lg:flex">
    <div className="mx-auto max-w-prose text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        Manage your expenses and
        <strong className="text-primary"> Control your savings </strong>
      </h1>

      <p className="mt-4 text-base text-pretty text-primary sm:text-lg/relaxed">
        Start creating your budget and track your expenses with our easy-to-use expense tracker.
      </p>

      <div className="mt-4 flex justify-center gap-4 sm:mt-6">
        <a
          className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium
           text-white shadow-sm transition-colors hover:bg-blue-700"
          href="/dashboard"
        >
          Get Started
        </a>
      </div>
    </div>
  </div>
  {/* <Image src={'/dashboard.png'} alt='dashboard'
  width={1000}
  height={700}
  className='-mt-5 rounded-xl border-2'
  /> */}
</section>
    </div>
  )
}

export default Hero
