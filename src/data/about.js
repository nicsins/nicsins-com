// About copy, verbatim from /workspace/nic-brand/BIO.md.
// Items with `confirm: true` are HIDDEN from the render until Nic confirms them.
// To publish one: fill in the [CONFIRM] value and delete `confirm: true`.
export const about = {
  title: 'About Nic',
  intro: [[
    { text: "I'm Nic Beltrante. Right now I build agent commerce: systems where AI agents find a service, pay for it per call, and get the result." },
    { text: 'Before that, I spent a career doing things most people only read about.' },
  ]],
  sections: [
    { heading: 'The Army', paragraphs: [
      [
        { text: 'I was a paratrooper with the 55th [CONFIRM: unit designation] Military Intelligence Brigade, supporting the 82nd and 101st Airborne, the 10th Mountain Division and Joint Special Operations Command.', confirm: true },
        { text: 'I ran interrogation-resistance training at SERE School and worked as a role-player trainer in Special Forces Assessment.' },
      ],
      [
        { text: 'I was the liaison for the commander of the largest element of Russian troops on American soil since our nation\'s founding.' },
        { text: 'I translated for Secretary of Defense William Perry and the Minister of Defense of the Russian Federation, and for multiple Russian delegation envoys in the U.S.' },
      ],
      [
        { text: 'In Operation Uphold Democracy in Haiti, I helped shut down the resistance in under 7 hours.' },
        { text: "I was the first person to send a data burst over SINCGARS, the Army's frequency-hopping encrypted radio." },
        { text: 'Later I worked with a Psychological Operations reserve unit in Minneapolis on all aspects of training and analysis support.' },
        { text: '[CONFIRM: years of service]', confirm: true },
      ],
    ] },
    { heading: 'Building things', paragraphs: [
      [
        { text: 'After the Army, I built things with my hands.' },
        { text: 'I owned a company that did REO property preservation and renovation for banks.' },
        { text: 'We handled about $[CONFIRM] million in assets a month and completed up to 5 full renovations a month.', confirm: true },
        { text: 'I rehabbed hotels for major hotel chains as a construction project manager, often coming in under budget.' },
        { text: 'I did custom build-outs for photography studios whose major client was Target, and I built their sets.' },
      ],
      [
        { text: 'In Sandstone, Minnesota, there was a distressed, overgrown quarry that had become a haven for meth production.' },
        { text: 'I brokered a deal with the city: the climbing community would clean it up in exchange for the chance to build the first ice-climbing park in Minnesota.' },
        { text: 'It has been there about [CONFIRM] years now.', confirm: true },
        { text: 'A town that was losing its people is having a small boom from the campers and climbers who come to the quarry.' },
      ],
    ] },
    { heading: 'The turn', paragraphs: [[
      { text: 'Then I hurt my back, made a change, and fell in love with tech.' },
      { text: 'The same instincts carried over: find the signal, build what works, and leave things better than I found them.' },
      { text: 'Golden Rule is the operating system.' },
    ]] },
  ],
};
