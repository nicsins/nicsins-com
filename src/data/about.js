// About copy, verbatim from /workspace/nic-brand/BIO.md, plus already-public
// field-record details from the live site (Library of Congress, unit citation,
// medals, cybersecurity era). Items with `confirm: true` are HIDDEN until Nic confirms.
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
        { text: 'I was a paratrooper with the 525th Military Intelligence Brigade (Airborne), supporting the 82nd and 101st Airborne, the 10th Mountain Division and Joint Special Operations Command.', confirm: false },
        { text: 'I ran interrogation-resistance training at SERE School and worked as a role-player trainer in Special Forces Assessment.' },
      ],
      [
        { text: 'I was the liaison for the commander of the largest element of Russian troops on American soil since our nation\'s founding.' },
        { text: 'I translated for Secretary of Defense William Perry and the Minister of Defense of the Russian Federation, and for multiple Russian delegation envoys in the U.S.' },
      ],
      [
        { text: 'In Operation Uphold Democracy in Haiti, I helped shut down the resistance in under 7 hours.' },
        { text: "I was the first person to send a data burst over SINCGARS, the Army's frequency-hopping encrypted radio." },
        { text: 'I was a 97E, a human-intelligence collector. The work was people, and writing it down so the next person did not have to learn it the hard way.' },
        { text: 'Reports from that tour went to the Library of Congress. The unit received a Meritorious Unit Citation.' },
        { text: 'I received a Humanitarian Service Medal, an Army Commendation Medal, two Army Achievement Medals, and an Armed Forces Expeditionary Medal.' },
        { text: 'Later I worked with a Psychological Operations reserve unit in Minneapolis on all aspects of training and analysis support.' },
        { text: '[CONFIRM: years of service]', confirm: true },
      ],
    ] },
    { heading: 'Building things', paragraphs: [
      [
        { text: 'After the Army, I built things with my hands.' },
        { text: 'I owned Buddy Swiss Inc, doing residential property preservation and renovation for Bank of America, Wells Fargo, Chase and other banks.' },
        { text: 'We handled about $[CONFIRM] million in assets a month and completed up to 5 full renovations a month.', confirm: true },
        { text: 'As co-owner and project manager of North Exposure Construction, I rehabbed hotels for Holiday Inn, La Quinta and Best Western, delivering the commercial carpentry and finish work and running subcontractors for the other trades, often under budget.' },
        { text: 'I did custom build-outs for photography studios whose major client was Target, and I built their sets.' },
      ],
      [
        { text: 'As co-owner of Fear This Productions, I partnered with municipal governments on festivals built around untapped local resources, including the Kettle River Paddle Festival and the Sandstone Ice Festival.' },
        { text: 'In Sandstone, Minnesota, Robinson Quarry had closed and become a haven for unchecked criminal activity.' },
        { text: 'I brokered a partnership between the City of Sandstone and the Minnesota Climbing Association: the climbing community would clean it up in exchange for building the Sandstone Ice Park, the first ice-climbing park in Minnesota.' },
        { text: 'It has been running for decades.' },
        { text: 'A town that was losing its people is having a small boom from the campers and climbers who come to the quarry.' },
        { text: 'Every spring we also promoted bluegrass bands and produced local-artist shows during Art-A-Whirl in Northeast Minneapolis.' },
      ],
    ] },
    { heading: 'After the uniform', paragraphs: [[
      { text: 'The years after the uniform went into cybersecurity. Penetration testing, secure review, zero trust, cryptography, threat modeling, forensics.' },
      { text: 'The question stayed small: where is the truth of this system, and who gets hurt if we miss it.' },
    ]] },
    { heading: 'The turn', paragraphs: [[
      { text: 'Then I hurt my back, made a change, and fell in love with tech.' },
      { text: 'The same instincts carried over: find the signal, build what works, and leave things better than I found them.' },
      { text: 'Golden Rule is the operating system. Minneapolis. I would rather be useful than impressive.' },
    ]] },
  ],
};
