// src/data/blogPosts.js
// Blog content for the public, SEO-indexed blog at /blog.
// English-only by design (these pages are pre-rendered for Google — see
// scripts/prerender.js and the no-hardcoded-text memory exception).
//
// To add an article: append an object here, then add its `/blog/<slug>` route
// to scripts/prerender.js ROUTES and to public/sitemap.xml.
//
// `content` is an array of blocks:
//   { type: 'p',    text }                  → paragraph (supports <strong> via **bold**)
//   { type: 'h2',   text }                  → section heading
//   { type: 'ul',   items: [] }             → bullet list
//   { type: 'note', text }                  → highlighted callout
//   { type: 'cta',  text, label, to }       → call-to-action block
//   { type: 'steps', items: [{ title, text }] } → animated numbered step timeline

export const BLOG_POSTS = [
  {
    slug: 'working-holiday-visa-ballot-second-third-year',
    title: 'The Second and Third Year Ballot: What Backpackers Need to Know',
    description:
      "Australia wants to cap second and third Working Holiday visas and hand them out by ballot. What's actually changed, what hasn't, and what to do if you're doing your days right now.",
    date: '2026-11-11',
    readingTime: 5,
    tag: 'Working Holiday Visa',
    accent: '#F59E0B',
    content: [
      {
        type: 'p',
        text: "If you're halfway through your 88 days on a farm somewhere, you've probably seen the headlines: second and third year visas are going to a ballot. Before you panic and quit picking, here's what's real, what's only been announced, and what it means for you.",
      },
      { type: 'h2', text: 'What was announced' },
      {
        type: 'p',
        text: 'On 17 September 2026, Home Affairs Minister Tony Burke announced a package of migration changes. For working holiday makers, the big one is a yearly cap on the extensions:',
      },
      {
        type: 'table',
        headers: ['', 'Places per year (planned)', 'People who qualified last year (approx.)'],
        rows: [
          ['Second-year visa', '45,000', '57,000'],
          ['Third-year visa', '5,000', '31,000'],
        ],
      },
      {
        type: 'p',
        text: 'Places would be handed out by ballot, and it covers both 417 and 462 holders. The third year is where it really bites: about one in six of the people who qualified last year would get a spot.',
      },
      { type: 'h2', text: "What hasn't changed (yet)" },
      {
        type: 'ul',
        items: [
          "**It's not law yet.** The ballot needs legislation that hasn't passed. There's no start date and no details on how registration would work.",
          '**Today you still apply the normal way.** If you have your days, you can lodge your second or third visa through ImmiAccount like always.',
          '**The work requirement stays.** 88 days for a second year, 6 months for a third. Under the ballot, your days get you into the draw. They don’t guarantee the visa.',
          "**UK passport holders** still don't need specified work for a second or third 417. Nobody has said yet how they fit into the cap.",
        ],
      },
      { type: 'h2', text: "If you're doing your days right now" },
      {
        type: 'steps',
        items: [
          {
            title: 'Keep going',
            text: "Your days are still the entry ticket. If the ballot starts and you haven't finished them, you can't even register.",
          },
          {
            title: 'Already have your days? Think about applying soon',
            text: "Nobody knows when the ballot kicks in. If you already meet the requirements, there's a good case for lodging while the current rules apply. If you're unsure about timing, ask a registered migration agent.",
          },
          {
            title: 'Make your evidence airtight',
            text: 'With fewer places, a messy application is the last thing you need. Payslips, Form 1263 and bank statements should match each other to the day. More on that in [how to prove your specified work](/blog/working-holiday-visa-evidence-payslips).',
          },
          {
            title: "Don't plan around a third year",
            text: 'With 5,000 places for the whole country, plan your trip as if year two could be your last one. If a third year comes through, great.',
          },
        ],
      },
      { type: 'h2', text: 'Other changes since 1 July 2026' },
      {
        type: 'ul',
        items: [
          'The first visa now costs **AUD 840**. The second and third cost **AUD 1,000** each.',
          'Germany, Finland, Cyprus and South Korea can now apply for a 417 up to age 35.',
          'Uruguay joined the 462 with up to 1,500 first visas a year.',
          "Indonesia's first 462 is moving to a ballot, like China, India and Vietnam.",
        ],
      },
      { type: 'h2', text: 'What this means for Orary' },
      {
        type: 'p',
        text: "The tracker keeps counting your 88 days and your 6 months exactly as before, because that's still what you need. When the ballot rules are published we'll update the app and this article. Until then the advice hasn't changed: log every shift and keep every payslip.",
      },
      {
        type: 'cta',
        text: 'Count your days from your real shifts and keep your evidence in one place.',
        label: 'Start tracking free',
        to: '/register',
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'Is the ballot already in place?',
            a: "No. It was announced in September 2026 but needs legislation that hasn't passed. Right now second and third visas work the same as before.",
          },
          {
            q: 'Do I still need to do my 88 days?',
            a: 'Yes. The plan keeps the specified work requirement. Under the ballot your days make you eligible to enter. They don’t guarantee the visa.',
          },
          {
            q: 'Does this affect my first Working Holiday visa?',
            a: 'No. The cap is on second and third visas. First visas work as before: no cap for the 417, country caps and some ballots for the 462.',
          },
          {
            q: "What if I'm on a UK passport?",
            a: "You still don't need specified work for a second or third 417. The government hasn't said how UK applicants fit into the cap.",
          },
        ],
      },
      {
        type: 'sources',
        title: 'Sources',
        items: [
          { label: 'Department of Home Affairs — Working Holiday Maker program: latest news', url: 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/latest-news' },
          { label: 'Department of Home Affairs — Australian Government migration policy changes', url: 'https://immi.homeaffairs.gov.au/australian-government-migration-policy-changes' },
          { label: 'Department of Home Affairs — Working Holiday visa (subclass 417)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417' },
          { label: 'Department of Home Affairs — Work and Holiday visa (subclass 462)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462' },
        ],
      },
      {
        type: 'note',
        text: 'Last checked 11 November 2026. This is general information, not migration advice. These rules are moving, so confirm on immi.homeaffairs.gov.au before you make plans.',
      },
    ],
    related: ['second-third-working-holiday-visa-application-guide', 'subclass-417-vs-462-working-holiday', 'working-holiday-visa-evidence-payslips'],
    translations: {
      es: {
        title: 'El sorteo del segundo y tercer año: lo que tenés que saber',
        description:
          'Australia quiere ponerle cupo a la segunda y tercera Working Holiday Visa y repartirlas por sorteo. Qué cambió de verdad, qué no, y qué hacer si estás haciendo tus días ahora.',
        content: [
          { type: 'p', text: 'Si estás a mitad de tus 88 días en alguna granja, seguro viste los titulares: la segunda y la tercera visa van a pasar a sorteo. Antes de entrar en pánico y largar la cosecha, acá va qué es real, qué es solo un anuncio y qué significa para vos.' },
          { type: 'h2', text: 'Qué se anunció' },
          { type: 'p', text: 'El 17 de septiembre de 2026, el ministro de Home Affairs, Tony Burke, anunció un paquete de cambios migratorios. Para los working holiday makers, lo más fuerte es un cupo anual para las extensiones:' },
          {
            type: 'table',
            headers: ['', 'Lugares por año (previsto)', 'Personas que calificaron el año pasado (aprox.)'],
            rows: [
              ['Visa de segundo año', '45.000', '57.000'],
              ['Visa de tercer año', '5.000', '31.000'],
            ],
          },
          { type: 'p', text: 'Los lugares se repartirían por sorteo, y aplica tanto a la 417 como a la 462. El tercer año es donde más duele: más o menos uno de cada seis de los que calificaron el año pasado conseguiría lugar.' },
          { type: 'h2', text: 'Qué no cambió (todavía)' },
          { type: 'ul', items: [
            '**Todavía no es ley.** El sorteo necesita una ley que no se aprobó. No hay fecha de inicio ni detalles de cómo sería la inscripción.',
            '**Hoy se sigue aplicando de la forma normal.** Si tenés tus días, podés presentar la segunda o tercera visa por ImmiAccount como siempre.',
            '**El requisito de trabajo se mantiene.** 88 días para el segundo año, 6 meses para el tercero. Con el sorteo, tus días te dan entrada al sorteo. No te garantizan la visa.',
            '**Con pasaporte del Reino Unido** seguís sin necesitar trabajo especificado para la segunda o tercera 417. Nadie explicó todavía cómo entran en el cupo.',
          ] },
          { type: 'h2', text: 'Si estás haciendo tus días ahora' },
          {
            type: 'steps',
            items: [
              { title: 'Seguí', text: 'Tus días siguen siendo la entrada. Si arranca el sorteo y no los terminaste, ni siquiera te podés anotar.' },
              { title: '¿Ya tenés tus días? Pensá en aplicar pronto', text: 'Nadie sabe cuándo arranca el sorteo. Si ya cumplís los requisitos, tiene sentido presentar mientras rigen las reglas actuales. Si tenés dudas con los tiempos, consultá con un agente de migración registrado.' },
              { title: 'Que tu evidencia sea impecable', text: 'Con menos lugares, una solicitud desprolija es lo último que necesitás. Payslips, Form 1263 y extractos bancarios tienen que coincidir entre sí al día. Más sobre eso en [cómo probar tu trabajo especificado](/es/blog/working-holiday-visa-evidence-payslips).' },
              { title: 'No armes el viaje contando con el tercer año', text: 'Con 5.000 lugares para todo el país, planeá como si el segundo año pudiera ser el último. Si sale el tercero, mejor.' },
            ],
          },
          { type: 'h2', text: 'Otros cambios desde el 1 de julio de 2026' },
          { type: 'ul', items: [
            'La primera visa ahora cuesta **AUD 840**. La segunda y la tercera, **AUD 1.000** cada una.',
            'Alemania, Finlandia, Chipre y Corea del Sur ya pueden aplicar a la 417 hasta los 35 años.',
            'Uruguay se sumó a la 462 con hasta 1.500 primeras visas por año.',
            'La primera 462 de Indonesia pasa a sorteo, como China, India y Vietnam.',
          ] },
          { type: 'h2', text: 'Qué significa para Orary' },
          { type: 'p', text: 'El tracker sigue contando tus 88 días y tus 6 meses igual que antes, porque eso es lo que seguís necesitando. Cuando se publiquen las reglas del sorteo, vamos a actualizar la app y este artículo. Mientras tanto el consejo es el mismo: registrá cada turno y guardá cada payslip.' },
          { type: 'cta', text: 'Contá tus días a partir de tus turnos reales y tené tu evidencia en un solo lugar.', label: 'Empezá gratis', to: '/register' },
          { type: 'h2', text: 'Preguntas frecuentes' },
          { type: 'faq', items: [
            { q: '¿El sorteo ya está vigente?', a: 'No. Se anunció en septiembre de 2026 pero necesita una ley que todavía no se aprobó. Hoy la segunda y la tercera visa funcionan igual que antes.' },
            { q: '¿Tengo que seguir haciendo mis 88 días?', a: 'Sí. El plan mantiene el requisito de trabajo especificado. Con el sorteo, tus días te habilitan a participar. No te garantizan la visa.' },
            { q: '¿Esto afecta mi primera Working Holiday Visa?', a: 'No. El cupo es para la segunda y la tercera visa. La primera funciona como antes: sin cupo para la 417, cupos por país y algunos sorteos para la 462.' },
            { q: '¿Y si tengo pasaporte del Reino Unido?', a: 'Seguís sin necesitar trabajo especificado para la segunda o tercera 417. El gobierno no dijo cómo entran los británicos en el cupo.' },
          ] },
          {
            type: 'sources',
            title: 'Fuentes',
            items: [
              { label: 'Department of Home Affairs — Working Holiday Maker program: últimas novedades', url: 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/latest-news' },
              { label: 'Department of Home Affairs — Cambios en la política migratoria del gobierno', url: 'https://immi.homeaffairs.gov.au/australian-government-migration-policy-changes' },
              { label: 'Department of Home Affairs — Working Holiday visa (subclase 417)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417' },
              { label: 'Department of Home Affairs — Work and Holiday visa (subclase 462)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462' },
            ],
          },
          { type: 'note', text: 'Revisado por última vez el 11 de noviembre de 2026. Esto es información general, no asesoramiento migratorio. Estas reglas se están moviendo, así que confirmá en immi.homeaffairs.gov.au antes de hacer planes.' },
        ],
      },
      fr: {
        title: 'Le tirage au sort des deuxième et troisième années : ce qu’il faut savoir',
        description:
          "L'Australie veut plafonner les deuxième et troisième Working Holiday Visas et les attribuer par tirage au sort. Ce qui a vraiment changé, ce qui ne change pas, et quoi faire si tu fais tes jours en ce moment.",
        content: [
          { type: 'p', text: "Si tu es à la moitié de tes 88 jours dans une ferme quelque part, tu as sûrement vu les titres : les deuxième et troisième années passent au tirage au sort. Avant de paniquer et de lâcher la cueillette, voici ce qui est réel, ce qui n'est qu'annoncé, et ce que ça change pour toi." },
          { type: 'h2', text: 'Ce qui a été annoncé' },
          { type: 'p', text: "Le 17 septembre 2026, le ministre de Home Affairs, Tony Burke, a annoncé une série de changements migratoires. Pour les working holiday makers, le plus important est un quota annuel sur les prolongations :" },
          {
            type: 'table',
            headers: ['', 'Places par an (prévu)', "Personnes éligibles l'an dernier (environ)"],
            rows: [
              ['Visa de deuxième année', '45 000', '57 000'],
              ['Visa de troisième année', '5 000', '31 000'],
            ],
          },
          { type: 'p', text: "Les places seraient attribuées par tirage au sort, pour le 417 comme pour le 462. C'est la troisième année qui fait le plus mal : environ une personne sur six parmi celles éligibles l'an dernier aurait une place." },
          { type: 'h2', text: "Ce qui ne change pas (pour l'instant)" },
          { type: 'ul', items: [
            "**Ce n'est pas encore une loi.** Le tirage au sort nécessite une loi qui n'est pas votée. Pas de date de début, pas de détails sur l'inscription.",
            "**Aujourd'hui, la demande se fait toujours normalement.** Si tu as tes jours, tu peux déposer ton deuxième ou troisième visa sur ImmiAccount comme d'habitude.",
            "**L'exigence de travail reste.** 88 jours pour une deuxième année, 6 mois pour une troisième. Avec le tirage au sort, tes jours te donnent accès au tirage. Ils ne garantissent pas le visa.",
            "**Avec un passeport britannique**, tu n'as toujours pas besoin de travail spécifié pour un deuxième ou troisième 417. Personne n'a encore expliqué comment les Britanniques entrent dans le quota.",
          ] },
          { type: 'h2', text: 'Si tu fais tes jours en ce moment' },
          {
            type: 'steps',
            items: [
              { title: 'Continue', text: "Tes jours restent le ticket d'entrée. Si le tirage démarre et que tu ne les as pas terminés, tu ne peux même pas t'inscrire." },
              { title: 'Tu as déjà tes jours ? Pense à déposer ta demande bientôt', text: "Personne ne sait quand le tirage commence. Si tu remplis déjà les conditions, il y a de bonnes raisons de déposer pendant que les règles actuelles s'appliquent. En cas de doute sur le timing, demande à un agent de migration agréé." },
              { title: 'Des preuves irréprochables', text: "Avec moins de places, une demande brouillonne est la dernière chose qu'il te faut. Fiches de paie, Form 1263 et relevés bancaires doivent concorder au jour près. Plus de détails dans [comment prouver ton travail spécifié](/fr/blog/working-holiday-visa-evidence-payslips)." },
              { title: 'Ne compte pas sur une troisième année', text: "Avec 5 000 places pour tout le pays, organise ton voyage comme si la deuxième année pouvait être la dernière. Si la troisième passe, tant mieux." },
            ],
          },
          { type: 'h2', text: 'Autres changements depuis le 1er juillet 2026' },
          { type: 'ul', items: [
            'Le premier visa coûte maintenant **840 AUD**. Le deuxième et le troisième, **1 000 AUD** chacun.',
            "L'Allemagne, la Finlande, Chypre et la Corée du Sud peuvent désormais demander un 417 jusqu'à 35 ans.",
            "L'Uruguay a rejoint le 462 avec jusqu'à 1 500 premiers visas par an.",
            "Le premier 462 pour l'Indonésie passe au tirage au sort, comme la Chine, l'Inde et le Vietnam.",
          ] },
          { type: 'h2', text: 'Ce que ça change pour Orary' },
          { type: 'p', text: "Le suivi continue de compter tes 88 jours et tes 6 mois exactement comme avant, parce que c'est toujours ce qu'il te faut. Quand les règles du tirage seront publiées, on mettra à jour l'app et cet article. D'ici là, le conseil ne change pas : note chaque quart et garde chaque fiche de paie." },
          { type: 'cta', text: 'Compte tes jours à partir de tes vrais quarts et garde tes preuves au même endroit.', label: 'Commence gratuitement', to: '/register' },
          { type: 'h2', text: 'Questions fréquentes' },
          { type: 'faq', items: [
            { q: 'Le tirage au sort est-il déjà en place ?', a: "Non. Il a été annoncé en septembre 2026 mais nécessite une loi qui n'est pas encore votée. Pour l'instant, les deuxième et troisième visas fonctionnent comme avant." },
            { q: 'Dois-je toujours faire mes 88 jours ?', a: "Oui. Le plan garde l'exigence de travail spécifié. Avec le tirage, tes jours te permettent de participer. Ils ne garantissent pas le visa." },
            { q: 'Est-ce que ça touche mon premier Working Holiday Visa ?', a: "Non. Le quota concerne les deuxième et troisième visas. Le premier fonctionne comme avant : pas de quota pour le 417, des quotas par pays et quelques tirages pour le 462." },
            { q: "Et si j'ai un passeport britannique ?", a: "Tu n'as toujours pas besoin de travail spécifié pour un deuxième ou troisième 417. Le gouvernement n'a pas dit comment les Britanniques entrent dans le quota." },
          ] },
          {
            type: 'sources',
            title: 'Sources',
            items: [
              { label: 'Department of Home Affairs — Working Holiday Maker program : dernières actualités', url: 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/latest-news' },
              { label: 'Department of Home Affairs — Changements de la politique migratoire du gouvernement', url: 'https://immi.homeaffairs.gov.au/australian-government-migration-policy-changes' },
              { label: 'Department of Home Affairs — Working Holiday visa (sous-classe 417)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417' },
              { label: 'Department of Home Affairs — Work and Holiday visa (sous-classe 462)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462' },
            ],
          },
          { type: 'note', text: "Dernière vérification le 11 novembre 2026. Ceci est une information générale, pas un conseil en immigration. Ces règles bougent, donc vérifie sur immi.homeaffairs.gov.au avant de faire des plans." },
        ],
      },
    },
  },
  {
    slug: 'second-third-working-holiday-visa-application-guide',
    title: 'How to Apply for Your Second or Third Working Holiday Visa in Australia: A Step-by-Step Guide',
    description:
      'A clear, section-by-section walkthrough of the second- and third-year Working Holiday visa application (subclass 417 and 462) — how many specified-work days each one needs, what to have ready, exactly what to enter in each part of the ImmiAccount form, what it costs and what happens after you submit.',
    date: '2026-06-22',
    updated: '2026-11-18',
    readingTime: 8,
    tag: 'Working Holiday Visa',
    accent: '#0EA5E9',
    content: [
      {
        type: 'p',
        text: "You've ground out your specified work, kept every payslip, and now the big one is in front of you: the actual application for your second — or third — year Working Holiday visa. The good news is the form is essentially the same both times. What changes is how many days you have to prove and when you did them. Here's exactly what to put in each section.",
      },
      { type: 'h2', text: 'Second or third year: how many days do you need?' },
      {
        type: 'p',
        text: 'You can extend your Working Holiday stay twice — once to a **second year** and once to a **third year**. You apply with the same online form each time; the difference is the amount of specified work you have to prove and which visa year you completed it in.',
      },
      {
        type: 'table',
        headers: ['', 'Second-year visa', 'Third-year visa'],
        rows: [
          ['Specified work needed', '88 days', '6 months (around 179 days)'],
          ['When you must complete it', 'During your first-year visa', 'During your second-year visa'],
          ['Visa you link to', 'Your first Working Holiday visa', 'Your second Working Holiday visa'],
        ],
      },
      {
        type: 'p',
        text: 'They’re counted as **normal work days**: a full-time week counts all 7 days, weekend included, while part-time work only counts the days you actually worked. We break that calculation down in our 88-day guide. You also need to be under the age limit (usually 30, or 35 for some countries) when you apply, and hold or have held the relevant earlier visa.',
      },
      {
        type: 'note',
        text: 'UK passport holders no longer need to do specified work for a second or third subclass 417 visa — but you still have to meet the other requirements and apply through the same form.',
      },
      {
        type: 'note',
        text: "Heads up: in September 2026 the government announced that second and third visas will move to a **ballot** with a yearly cap (45,000 places for year two, 5,000 for year three). It isn't law yet and there's no start date, so right now you still apply exactly as described here. Your days still matter either way: without them you can't even enter the ballot. Full breakdown in [The Second and Third Year Ballot: What Backpackers Need to Know](/blog/working-holiday-visa-ballot-second-third-year).",
      },
      { type: 'h2', text: 'Step 1: Get your evidence ready' },
      {
        type: 'p',
        text: 'Before you open the form, gather everything that proves your specified work. Immigration wants consistent, matching records — dates, location and hours that line up across every document.',
      },
      {
        type: 'ul',
        items: [
          '**Payslips** for every week of specified work, showing the employer, dates and hours.',
          "**Form 1263** — the official 'Working holiday visa employment verification' declaration, signed by each employer.",
          '**Bank statements** showing your wages landing, matching the payslips.',
          '**Payment summary / income statement** (or PAYG details) from your employer(s).',
          'Your **passport** — the same one, or the details of any new one if you renewed.',
          'Your **first visa grant number**, from your original grant letter.',
        ],
      },
      { type: 'h2', text: 'The application, section by section' },
      {
        type: 'p',
        text: "You apply online through ImmiAccount while you're still in Australia — the same process whether it's your second or third year. Here's what each part asks for and exactly what to enter.",
      },
      {
        type: 'steps',
        items: [
          {
            title: 'Create or log into ImmiAccount',
            text: 'Go to **online.immi.gov.au**, create an ImmiAccount (or log into the one you used for your first visa), then choose **New application → Working Holiday** and pick the **same subclass** as your first year — 417 or 462.',
          },
          {
            title: 'Application context',
            text: 'The first questions ask **where you are** and confirm this is a Working Holiday application. Answer honestly — being in Australia is what lets you get a bridging visa to stay lawfully while the application is processed.',
          },
          {
            title: 'Passport & identity details',
            text: 'Enter your passport exactly as printed: number, country, issue and expiry dates, and your name in the same order as the document. If you renewed your passport since your first visa, use the new one and keep the old number handy.',
          },
          {
            title: 'Contact & residential address',
            text: 'Give your current Australian address, email and phone. This is where your grant notification goes — use an email you actually check, not the one from three backpacker hostels ago.',
          },
          {
            title: 'Visa history',
            text: 'Declare your current/previous visa and enter the **grant number of the visa you’re extending from** — your first Working Holiday visa for a second year, or your second visa for a third year. This links the applications and tells the system which year you’re applying for.',
          },
          {
            title: 'Declare your specified work',
            text: 'The section that matters most. For each job, enter the **employer name and ABN**, the **address and postcode** (it must be an [eligible regional postcode](/blog/specified-work-eligible-postcodes-australia)), the **type of work**, and the **exact start and finish dates**. Use the **Add** button to list several employers, and enter the **total days you actually worked — including any paid leave**. Make every detail match your payslips and Form 1263, to the day.',
          },
          {
            title: 'Health & character declarations',
            text: 'Answer the standard questions about your health and any criminal history truthfully — a false declaration can get a visa refused or cancelled. Most backpackers won’t need a medical, but you may be asked for a police certificate.',
          },
          {
            title: 'Attach your evidence',
            text: 'Upload the documents from Step 1 — payslips, Form 1263, bank statements and your passport photo page. Use clear PDFs or photos, name them sensibly, and leave no gaps in your work dates.',
          },
          {
            title: 'Pay & submit',
            text: 'Pay the application charge by card, review every section once more, and submit. You’ll get a confirmation and, because you applied onshore, usually an automatic **bridging visa** that keeps you lawful while you wait.',
          },
        ],
      },
      { type: 'h2', text: 'What it costs and what happens next' },
      {
        type: 'p',
        text: 'Since 1 July 2026 a second or third Working Holiday visa costs **AUD 1,000** (the first one is AUD 840). You pay it again each time, so the second and third visa are separate payments. After you submit, you’re typically granted a **Bridging Visa A**, which lets you stay and keep working on the same conditions until a decision is made. Many applications are decided within days, though some take longer — the department aims to finish most within a couple of months.',
      },
      {
        type: 'note',
        text: 'Don’t book flights out of Australia until your visa is granted. Leaving while on a Bridging Visa A can affect your status — you’d need a **Bridging Visa B** to leave and re-enter.',
      },
      {
        type: 'note',
        text: 'You can also apply from **outside Australia**, but then you must be offshore when it’s granted and show proof of funds (around **AUD 6,200**). Applying onshore is usually simpler — you get a bridging visa and keep working while you wait. Made a mistake after submitting? Correct it with **Form 1023 (Notification of Incorrect Answers)** in ImmiAccount as soon as you spot it.',
      },
      {
        type: 'p',
        text: 'The single biggest reason these applications stall is messy evidence — dates that don’t match between your payslips, the form and Form 1263. If you logged every shift in Orary, you already have a clean, week-by-week record of hours, dates and employers to copy straight into the specified-work section and to cross-check your uploads against.',
      },
      {
        type: 'cta',
        text: 'Keep a clean record of every shift, so your visa evidence matches to the day.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'This article is general guidance only and not migration advice. Visa requirements, fees and forms change — always confirm current details at immi.homeaffairs.gov.au or with a registered migration agent before you apply.',
      },
    ],
    related: ['working-holiday-visa-evidence-payslips', 'working-holiday-visa-mistakes', 'track-88-days-working-holiday-visa'],
    translations: {
      es: {
        title: 'Cómo solicitar tu segunda o tercera Working Holiday Visa en Australia: guía paso a paso',
        description:
          'Una guía clara, sección por sección, de la solicitud de la Working Holiday Visa de segundo y tercer año (subclase 417 y 462): cuántos días de trabajo especificado necesita cada una, qué tener listo, qué poner exactamente en cada parte del formulario de ImmiAccount, cuánto cuesta y qué pasa después de enviarla.',
        content: [
          {
            type: 'p',
            text: 'Ya te rompiste el lomo con el trabajo especificado, guardaste cada payslip, y ahora tenés enfrente la parte grande: la solicitud real de tu segundo — o tercer — año de Working Holiday Visa. La buena noticia es que el formulario es prácticamente el mismo las dos veces. Lo que cambia es cuántos días tenés que probar y cuándo los hiciste. Acá tenés exactamente qué poner en cada sección.',
          },
          { type: 'h2', text: 'Segundo o tercer año: ¿cuántos días necesitás?' },
          {
            type: 'p',
            text: 'Podés extender tu estadía de Working Holiday dos veces — una a un **segundo año** y otra a un **tercer año**. Solicitás con el mismo formulario online cada vez; la diferencia es la cantidad de trabajo especificado que tenés que probar y en qué año de visa lo completaste.',
          },
          {
            type: 'table',
            headers: ['', 'Visa de 2º año', 'Visa de 3er año'],
            rows: [
              ['Trabajo especificado requerido', '88 días', '6 meses (unos 179 días)'],
              ['Cuándo lo tenés que completar', 'Durante tu visa de 1er año', 'Durante tu visa de 2º año'],
              ['Visa que vinculás', 'Tu primera Working Holiday Visa', 'Tu segunda Working Holiday Visa'],
            ],
          },
          {
            type: 'p',
            text: 'Se cuentan como **jornadas normales de trabajo**: una semana a tiempo completo cuenta los 7 días, fin de semana incluido, mientras que el part-time solo cuenta los días que realmente trabajaste. Desglosamos ese cálculo en nuestra guía de los 88 días. También tenés que estar por debajo del límite de edad (normalmente 30, o 35 para algunos países) al momento de solicitar, y tener o haber tenido la visa anterior correspondiente.',
          },
          {
            type: 'note',
            text: 'Los titulares de pasaporte del Reino Unido ya no necesitan hacer trabajo especificado para una segunda o tercera visa subclase 417 — pero igual tenés que cumplir los demás requisitos y solicitar con el mismo formulario.',
          },
          {
            type: 'note',
            text: "Ojo: en septiembre de 2026 el gobierno anunció que la segunda y la tercera visa van a pasar a un **sorteo** con cupo anual (45.000 lugares para el segundo año, 5.000 para el tercero). Todavía no es ley y no tiene fecha, así que hoy se aplica igual que como lo explicamos acá. Tus días siguen importando igual: sin ellos ni siquiera podés entrar al sorteo. Todo el detalle en [El sorteo del segundo y tercer año: lo que tenés que saber](/es/blog/working-holiday-visa-ballot-second-third-year).",
          },
          { type: 'h2', text: 'Paso 1: prepará tu evidencia' },
          {
            type: 'p',
            text: 'Antes de abrir el formulario, juntá todo lo que prueba tu trabajo especificado. Inmigración quiere registros consistentes y que coincidan — fechas, lugar y horas que cuadren entre todos los documentos.',
          },
          {
            type: 'ul',
            items: [
              '**Payslips** de cada semana de trabajo especificado, mostrando empleador, fechas y horas.',
              "**Form 1263** — la declaración oficial 'Working holiday visa employment verification', firmada por cada empleador.",
              '**Extractos bancarios** que muestren el ingreso de tu sueldo, coincidiendo con los payslips.',
              '**Payment summary / income statement** (o datos PAYG) de tu(s) empleador(es).',
              'Tu **pasaporte** — el mismo, o los datos del nuevo si lo renovaste.',
              'Tu **número de grant de la primera visa**, que está en tu carta de aprobación original.',
            ],
          },
          { type: 'h2', text: 'La solicitud, sección por sección' },
          {
            type: 'p',
            text: 'Solicitás online a través de ImmiAccount mientras estás en Australia — el mismo proceso ya sea tu segundo o tercer año. Acá tenés qué pide cada parte y exactamente qué poner.',
          },
          {
            type: 'steps',
            items: [
              {
                title: 'Creá o ingresá a ImmiAccount',
                text: 'Entrá a **online.immi.gov.au**, creá una ImmiAccount (o ingresá a la que usaste para tu primera visa), elegí **New application → Working Holiday** y seleccioná la **misma subclase** que tu primer año — 417 o 462.',
              },
              {
                title: 'Contexto de la solicitud',
                text: 'Las primeras preguntas son **dónde estás** y confirman que es una solicitud de Working Holiday. Respondé con la verdad — estar en Australia es lo que te permite obtener una bridging visa para quedarte legalmente mientras se procesa.',
              },
              {
                title: 'Pasaporte e identidad',
                text: 'Cargá tu pasaporte tal cual está impreso: número, país, fechas de emisión y vencimiento, y tu nombre en el mismo orden que el documento. Si lo renovaste desde tu primera visa, usá el nuevo y tené a mano el número viejo.',
              },
              {
                title: 'Contacto y domicilio',
                text: 'Poné tu dirección actual en Australia, email y teléfono. Ahí llega la notificación de aprobación — usá un email que realmente revises, no uno de hace tres hostels.',
              },
              {
                title: 'Historial de visas',
                text: 'Declará tu visa actual/anterior e ingresá el **número de grant de la visa desde la que extendés** — tu primera Working Holiday Visa para un segundo año, o tu segunda visa para un tercer año. Esto vincula las solicitudes y le dice al sistema qué año estás pidiendo.',
              },
              {
                title: 'Declará tu trabajo especificado',
                text: 'La sección más importante. Por cada trabajo, cargá el **nombre y ABN del empleador**, la **dirección y código postal** (tiene que ser un [código postal regional elegible](/es/blog/specified-work-eligible-postcodes-australia)), el **tipo de trabajo** y las **fechas exactas de inicio y fin**. Usá el botón **Add** para listar varios empleadores, e ingresá el **total de días que realmente trabajaste — incluyendo licencias pagas**. Que todo coincida con tus payslips y el Form 1263, al día.',
              },
              {
                title: 'Declaraciones de salud y carácter',
                text: 'Respondé con la verdad las preguntas estándar sobre tu salud y antecedentes — una declaración falsa puede hacer que te rechacen o cancelen la visa. La mayoría de los backpackers no necesita examen médico, pero puede que te pidan un certificado policial.',
              },
              {
                title: 'Adjuntá tu evidencia',
                text: 'Subí los documentos del Paso 1 — payslips, Form 1263, extractos bancarios y la hoja de datos de tu pasaporte. Usá PDFs o fotos claras, nombralos de forma sensata y no dejes huecos en tus fechas de trabajo.',
              },
              {
                title: 'Pagá y enviá',
                text: 'Pagá la tasa con tarjeta, revisá cada sección una vez más y enviá. Vas a recibir una confirmación y, como solicitaste estando en Australia, normalmente una **bridging visa** automática que te mantiene legal mientras esperás.',
              },
            ],
          },
          { type: 'h2', text: 'Cuánto cuesta y qué pasa después' },
          {
            type: 'p',
            text: 'Desde el 1 de julio de 2026 la segunda o tercera Working Holiday Visa cuesta **AUD 1.000** (la primera, AUD 840). Se paga cada vez, así que la segunda y la tercera son pagos separados. Después de enviar, normalmente te otorgan una **Bridging Visa A**, que te deja quedarte y seguir trabajando con las mismas condiciones hasta que haya una decisión. Muchas solicitudes se resuelven en días, aunque algunas tardan más — el departamento apunta a terminar la mayoría en un par de meses.',
          },
          {
            type: 'note',
            text: 'No reserves vuelos para salir de Australia hasta que te otorguen la visa. Salir con una Bridging Visa A puede afectar tu situación — necesitarías una **Bridging Visa B** para salir y volver a entrar.',
          },
          {
            type: 'note',
            text: 'También podés solicitar desde **fuera de Australia**, pero entonces tenés que estar offshore cuando te la otorguen y mostrar prueba de fondos (unos **AUD 6.200**). Hacerlo estando en Australia suele ser más simple — obtenés una bridging visa y seguís trabajando mientras esperás. ¿Te equivocaste después de enviar? Corregilo con el **Form 1023 (Notification of Incorrect Answers)** en ImmiAccount apenas lo detectes.',
          },
          {
            type: 'p',
            text: 'La razón número uno por la que estas solicitudes se traban es la evidencia desprolija — fechas que no coinciden entre tus payslips, el formulario y el Form 1263. Si registraste cada turno en Orary, ya tenés un registro limpio, semana por semana, de horas, fechas y empleadores para copiar directo en la sección de trabajo especificado y contrastar con tus archivos subidos.',
          },
          {
            type: 'cta',
            text: 'Mantené un registro limpio de cada turno, para que tu evidencia de visa coincida al día.',
            label: 'Empezá gratis',
            to: '/register',
          },
          {
            type: 'note',
            text: 'Esto es solo orientación general y no es asesoramiento migratorio. Los requisitos, tasas y formularios de visa cambian — verificá siempre los detalles vigentes en immi.homeaffairs.gov.au o con un agente de migración registrado antes de solicitar.',
          },
        ],
      },
      fr: {
        title: 'Comment demander ton deuxième ou troisième Working Holiday Visa en Australie : guide étape par étape',
        description:
          'Un guide clair, section par section, de la demande de Working Holiday Visa de deuxième et troisième année (sous-classe 417 et 462) : combien de jours de travail spécifié chacune exige, quoi préparer, quoi saisir exactement dans chaque partie du formulaire ImmiAccount, le coût et ce qui se passe après l’envoi.',
        content: [
          {
            type: 'p',
            text: "Tu as enchaîné ton travail spécifié, gardé chaque fiche de paie, et maintenant tu as devant toi le gros morceau : la vraie demande de ton deuxième — ou troisième — Working Holiday Visa. Bonne nouvelle : le formulaire est quasiment le même les deux fois. Ce qui change, c'est le nombre de jours à prouver et quand tu les as faits. Voici exactement quoi mettre dans chaque section.",
          },
          { type: 'h2', text: 'Deuxième ou troisième année : combien de jours te faut-il ?' },
          {
            type: 'p',
            text: 'Tu peux prolonger ton séjour Working Holiday deux fois — une vers une **deuxième année** et une vers une **troisième année**. Tu fais la demande avec le même formulaire en ligne à chaque fois ; la différence, c’est la quantité de travail spécifié à prouver et l’année de visa pendant laquelle tu l’as effectué.',
          },
          {
            type: 'table',
            headers: ['', 'Visa 2e année', 'Visa 3e année'],
            rows: [
              ['Travail spécifié requis', '88 jours', '6 mois (environ 179 jours)'],
              ['Quand le réaliser', 'Pendant ton visa de 1re année', 'Pendant ton visa de 2e année'],
              ['Visa à relier', 'Ton premier Working Holiday Visa', 'Ton deuxième Working Holiday Visa'],
            ],
          },
          {
            type: 'p',
            text: "Ils se comptent en **journées normales de travail** : une semaine à temps plein compte les 7 jours, week-end compris, alors que le temps partiel ne compte que les jours réellement travaillés. On détaille ce calcul dans notre guide des 88 jours. Tu dois aussi être sous la limite d'âge (en général 30 ans, ou 35 pour certains pays) au moment de la demande, et détenir ou avoir détenu le visa précédent correspondant.",
          },
          {
            type: 'note',
            text: 'Les titulaires d’un passeport britannique n’ont plus besoin de faire du travail spécifié pour un deuxième ou troisième visa de sous-classe 417 — mais tu dois quand même remplir les autres conditions et passer par le même formulaire.',
          },
          {
            type: 'note',
            text: "Attention : en septembre 2026, le gouvernement a annoncé que les deuxième et troisième visas vont passer par un **tirage au sort** avec un quota annuel (45 000 places pour la deuxième année, 5 000 pour la troisième). Ce n'est pas encore une loi et il n'y a pas de date, donc pour l'instant tu fais ta demande exactement comme expliqué ici. Tes jours comptent toujours : sans eux, tu ne peux même pas participer au tirage. Tout le détail dans [Le tirage au sort des deuxième et troisième années : ce qu'il faut savoir](/fr/blog/working-holiday-visa-ballot-second-third-year).",
          },
          { type: 'h2', text: 'Étape 1 : prépare tes preuves' },
          {
            type: 'p',
            text: 'Avant d’ouvrir le formulaire, rassemble tout ce qui prouve ton travail spécifié. L’immigration veut des justificatifs cohérents qui concordent — des dates, un lieu et des heures qui correspondent d’un document à l’autre.',
          },
          {
            type: 'ul',
            items: [
              '**Fiches de paie** pour chaque semaine de travail spécifié, indiquant l’employeur, les dates et les heures.',
              "**Form 1263** — la déclaration officielle 'Working holiday visa employment verification', signée par chaque employeur.",
              '**Relevés bancaires** montrant l’arrivée de ton salaire, correspondant aux fiches de paie.',
              '**Payment summary / income statement** (ou données PAYG) de ton/tes employeur(s).',
              'Ton **passeport** — le même, ou les détails du nouveau si tu l’as renouvelé.',
              'Ton **numéro de grant du premier visa**, qui figure sur ta lettre d’octroi d’origine.',
            ],
          },
          { type: 'h2', text: 'La demande, section par section' },
          {
            type: 'p',
            text: 'Tu fais la demande en ligne via ImmiAccount pendant que tu es en Australie — le même processus que ce soit ta deuxième ou ta troisième année. Voici ce que demande chaque partie et exactement quoi saisir.',
          },
          {
            type: 'steps',
            items: [
              {
                title: 'Crée ou connecte-toi à ImmiAccount',
                text: 'Va sur **online.immi.gov.au**, crée un ImmiAccount (ou connecte-toi à celui de ton premier visa), choisis **New application → Working Holiday** et sélectionne la **même sous-classe** que ta première année — 417 ou 462.',
              },
              {
                title: 'Contexte de la demande',
                text: 'Les premières questions demandent **où tu es** et confirment qu’il s’agit d’une demande Working Holiday. Réponds honnêtement — être en Australie est ce qui te permet d’obtenir un bridging visa pour rester légalement pendant le traitement.',
              },
              {
                title: 'Passeport et identité',
                text: 'Saisis ton passeport exactement comme imprimé : numéro, pays, dates d’émission et d’expiration, et ton nom dans le même ordre que le document. Si tu l’as renouvelé depuis ton premier visa, utilise le nouveau et garde l’ancien numéro à portée.',
              },
              {
                title: 'Contact et adresse',
                text: 'Indique ton adresse actuelle en Australie, ton email et ton téléphone. C’est là qu’arrive la notification d’octroi — utilise un email que tu consultes vraiment, pas celui d’il y a trois auberges.',
              },
              {
                title: 'Historique des visas',
                text: 'Déclare ton visa actuel/précédent et saisis le **numéro de grant du visa que tu prolonges** — ton premier Working Holiday Visa pour une deuxième année, ou ton deuxième visa pour une troisième année. Cela relie les demandes et indique au système quelle année tu demandes.',
              },
              {
                title: 'Déclare ton travail spécifié',
                text: 'La section la plus importante. Pour chaque emploi, saisis le **nom et l’ABN de l’employeur**, l’**adresse et le code postal** (il doit s’agir d’un [code postal régional éligible](/fr/blog/specified-work-eligible-postcodes-australia)), le **type de travail** et les **dates exactes de début et de fin**. Utilise le bouton **Add** pour lister plusieurs employeurs, et saisis le **nombre total de jours réellement travaillés — congés payés inclus**. Que tout corresponde à tes fiches de paie et au Form 1263, au jour près.',
              },
              {
                title: 'Déclarations de santé et de moralité',
                text: 'Réponds honnêtement aux questions standard sur ta santé et tes antécédents — une fausse déclaration peut faire refuser ou annuler un visa. La plupart des backpackers n’auront pas besoin de visite médicale, mais on peut te demander un certificat de police.',
              },
              {
                title: 'Joins tes preuves',
                text: 'Téléverse les documents de l’Étape 1 — fiches de paie, Form 1263, relevés bancaires et la page photo de ton passeport. Utilise des PDF ou photos nets, nomme-les clairement et ne laisse aucun trou dans tes dates de travail.',
              },
              {
                title: 'Paie et envoie',
                text: 'Paie les frais par carte, revois chaque section une dernière fois, puis envoie. Tu recevras une confirmation et, comme tu as fait la demande sur place, généralement un **bridging visa** automatique qui te garde en règle pendant l’attente.',
              },
            ],
          },
          { type: 'h2', text: 'Le coût et ce qui se passe ensuite' },
          {
            type: 'p',
            text: 'Depuis le 1er juillet 2026, un deuxième ou troisième Working Holiday Visa coûte **1 000 AUD** (le premier, 840 AUD). Tu paies à chaque fois, donc le deuxième et le troisième visa sont des paiements distincts. Après l’envoi, on t’accorde généralement un **Bridging Visa A**, qui te permet de rester et de continuer à travailler aux mêmes conditions jusqu’à une décision. Beaucoup de demandes sont tranchées en quelques jours, même si certaines prennent plus longtemps — le département vise à finir la plupart en deux mois environ.',
          },
          {
            type: 'note',
            text: 'Ne réserve pas de vol pour quitter l’Australie avant l’octroi de ton visa. Partir avec un Bridging Visa A peut affecter ta situation — il te faudrait un **Bridging Visa B** pour sortir et revenir.',
          },
          {
            type: 'note',
            text: 'Tu peux aussi faire la demande depuis **hors d’Australie**, mais tu dois alors être à l’étranger au moment de l’octroi et présenter une preuve de fonds (environ **6 200 AUD**). Faire la demande sur place est en général plus simple — tu obtiens un bridging visa et continues à travailler en attendant. Une erreur après l’envoi ? Corrige-la avec le **Form 1023 (Notification of Incorrect Answers)** dans ImmiAccount dès que tu la repères.',
          },
          {
            type: 'p',
            text: 'La première raison qui bloque ces demandes, c’est des preuves brouillonnes — des dates qui ne concordent pas entre tes fiches de paie, le formulaire et le Form 1263. Si tu as noté chaque quart dans Orary, tu as déjà un relevé propre, semaine par semaine, des heures, dates et employeurs à recopier directement dans la section travail spécifié et à recouper avec tes téléversements.',
          },
          {
            type: 'cta',
            text: 'Garde un relevé propre de chaque quart, pour que tes preuves de visa concordent au jour près.',
            label: 'Commence gratuitement',
            to: '/register',
          },
          {
            type: 'note',
            text: 'Cet article est une information générale et non un conseil en immigration. Les conditions, frais et formulaires de visa changent — vérifie toujours les détails à jour sur immi.homeaffairs.gov.au ou auprès d’un agent de migration agréé avant de faire ta demande.',
          },
        ],
      },
    },
  },
  {
    slug: 'track-88-days-working-holiday-visa',
    title: 'How to Track Your 88 Days for the Australian Working Holiday Visa',
    description:
      'A clear guide to the 88-day specified work rule for the Australian Working Holiday Visa (subclass 417 and 462) — how visa days are actually counted, what work qualifies, which regions count, and how to track your progress.',
    date: '2026-06-14',
    updated: '2026-11-18',
    readingTime: 7,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      {
        type: 'p',
        text: "If you're on an Australian Working Holiday Visa and want a second (or third) year, you've heard the magic number: **88 days** of specified regional work. What almost nobody explains clearly is that those 88 days are **not** the number of days you physically showed up to work. Miscounting them is one of the most common reasons applications get delayed or refused — so let's get it right.",
      },
      { type: 'h2', text: 'What is the 88-day rule?' },
      {
        type: 'p',
        text: 'Working Holiday Visa holders on **subclass 417** and **subclass 462** must complete 88 days of eligible "specified work" in a regional area during their first visa year to apply for a second-year extension. A third year is a separate count: **6 months (179 days)** of specified work done while you’re on your second visa. Your first-year days don’t carry over.',
      },
      { type: 'h2', text: 'How the 88 days are actually counted' },
      { type: 'p', text: 'Home Affairs asks you to complete **the same number of normal work days or shifts that a full-time employee in your role and industry would work in 88 calendar days**. Four things follow from that:' },
      { type: 'ul', items: [
        '**A full-time week counts all 7 days.** If you work the industry\'s normal full-time week (usually 5 days, around 38 hours), the whole Monday–Sunday week counts, weekend included.',
        '**Part-time and casual work count day by day.** Only the days you actually worked count, so reaching 88 takes longer.',
        '**A long day is still one day.** A 12-hour shift, or two jobs on the same date, never counts as two days.',
        '**Short days count pro rata.** Half a standard day counts as roughly half a day.',
      ] },
      { type: 'note', text: 'There is no official hours-to-days table. Tables that turn, say, 7.5 hours into 2 days circulate online, but they ignore how many days you worked and can overstate your count. If in doubt, count conservatively and check immi.homeaffairs.gov.au.' },
      { type: 'h2', text: 'What counts as specified work' },
      {
        type: 'p',
        text: 'Eligible categories include plant and animal cultivation (fruit picking, harvesting, pruning, general farm work), fishing and pearling, tree farming and felling, mining, and construction. Since 2023, certain tourism and hospitality work in specified regional areas also qualifies. Categories change, so always confirm the current list before you start a job.',
      },
      { type: 'h2', text: 'Which regions count' },
      {
        type: 'p',
        text: 'All of the Northern Territory, South Australia and Tasmania count. So do regional Queensland (excluding Greater Brisbane), regional Western Australia (excluding the Perth metro area), regional New South Wales (excluding Sydney, Newcastle and Wollongong) and regional Victoria (excluding Melbourne). The Department publishes the exact eligible postcodes — check yours before signing on.',
      },
      { type: 'h2', text: 'Subclass 417 vs 462' },
      {
        type: 'p',
        text: 'Subclass 417 covers passport holders from the UK, Ireland, Canada, France, Germany, Italy, the Netherlands, South Korea, Japan and others. Subclass 462 covers the USA, China, India, Vietnam, Argentina, Chile and others. Both need 88 days for a second year and 6 months (179 days, done on the second visa) for a third, but eligible work categories and age limits can vary by country.',
      },
      { type: 'h2', text: 'Common mistakes to avoid' },
      {
        type: 'ul',
        items: [
          'Counting a long shift, or two jobs on the same day, as more than one day.',
          'Counting the weekend of a part-time week: only a full-time week counts all 7 days.',
          'Not keeping payslips and employer declarations (Form 1263) as evidence.',
          'Working in a non-eligible postcode or job category.',
          'Leaving it until the last minute — track from your very first shift.',
        ],
      },
      { type: 'h2', text: 'How to track your 88 days without spreadsheets' },
      {
        type: 'p',
        text: 'The reliable way is to log every shift with its date and hours, group them into Monday–Sunday weeks, check whether each week was full time, and otherwise count the days actually worked. Doing that by hand in a spreadsheet works, but it’s easy to make mistakes — and a mistake here can cost you a whole visa year.',
      },
      {
        type: 'p',
        text: 'Orary does it automatically: log your shifts, and it groups them into weeks, counts each one by these rules using your paid hours, and shows a live progress bar toward 88 days (second year) or 179 days (third year) — with payslips and earnings tracked alongside, so the same records back up both your visa application and your taxes.',
      },
      {
        type: 'cta',
        text: 'Track your 88 days automatically — free, no credit card required.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'This article is general guidance only. Visa rules change — always verify current requirements at immi.homeaffairs.gov.au before making decisions.',
      },
    ],
    related: ['working-holiday-visa-days-calculator'],
    translations: {
      es: {
        title: 'Cómo contar tus 88 días de la Working Holiday Visa de Australia',
        description:
          'Guía clara de la regla de los 88 días de trabajo especificado (subclase 417 y 462): cómo se cuentan realmente los días de visa, qué trabajo califica, qué regiones cuentan y cómo seguir tu progreso.',
        content: [
          { type: 'p', text: 'Si estás con una Working Holiday Visa en Australia y querés un segundo (o tercer) año, ya escuchaste el número mágico: **88 días** de trabajo especificado en zona regional. Lo que casi nadie explica bien es que esos 88 días **no** son los días que físicamente fuiste a trabajar. Contarlos mal es una de las razones más comunes de demoras o rechazos — así que vamos a hacerlo bien.' },
          { type: 'h2', text: '¿Qué es la regla de los 88 días?' },
          { type: 'p', text: 'Los titulares de Working Holiday Visa de **subclase 417** y **subclase 462** deben completar 88 días de "trabajo especificado" elegible en una zona regional durante su primer año de visa para pedir la extensión del segundo año. El tercer año es otra cuenta aparte: **6 meses (179 días)** de trabajo especificado hechos mientras estás con la segunda visa. Los días del primer año no se arrastran.' },
          { type: 'h2', text: 'Cómo se cuentan de verdad los 88 días' },
          { type: 'p', text: 'Home Affairs pide completar **la misma cantidad de jornadas o turnos normales que haría un empleado a tiempo completo en tu puesto e industria durante 88 días calendario**. De ahí salen cuatro cosas:' },
          { type: 'ul', items: [
            '**Una semana a tiempo completo cuenta los 7 días.** Si trabajás la semana completa normal de tu industria (en general 5 días, unas 38 horas), cuenta toda la semana de lunes a domingo, fin de semana incluido.',
            '**El trabajo part-time o casual se cuenta día por día.** Solo suman los días que trabajaste, así que llegar a 88 lleva más tiempo.',
            '**Un día largo sigue siendo un día.** Un turno de 12 horas, o dos trabajos el mismo día, nunca cuentan como dos días.',
            '**Los días cortos cuentan en proporción.** Media jornada estándar cuenta más o menos como medio día.',
          ] },
          { type: 'note', text: 'No existe una tabla oficial de horas a días. Circulan tablas que convierten, por ejemplo, 7,5 horas en 2 días, pero ignoran cuántos días trabajaste y pueden inflar tu cuenta. Ante la duda, contá de forma conservadora y verificá en immi.homeaffairs.gov.au.' },
          { type: 'h2', text: 'Qué cuenta como trabajo especificado' },
          { type: 'p', text: 'Las categorías elegibles incluyen cultivo de plantas y animales (cosecha de fruta, poda, trabajo de campo), pesca y perlería, silvicultura y tala, minería y construcción. Desde 2023, cierto trabajo de turismo y hostelería en zonas regionales específicas también califica. Las categorías cambian, así que confirmá siempre la lista vigente antes de empezar.' },
          { type: 'h2', text: 'Qué regiones cuentan' },
          { type: 'p', text: 'Cuentan todo el Northern Territory, South Australia y Tasmania. También Queensland regional (excepto Greater Brisbane), Western Australia regional (excepto el área metro de Perth), New South Wales regional (excepto Sídney, Newcastle y Wollongong) y Victoria regional (excepto Melbourne). El Department publica los códigos postales exactos — revisá el tuyo antes de firmar.' },
          { type: 'h2', text: 'Subclase 417 vs 462' },
          { type: 'p', text: 'La subclase 417 es para pasaportes de Reino Unido, Irlanda, Canadá, Francia, Alemania, Italia, Países Bajos, Corea del Sur, Japón y otros. La 462 es para EE.UU., China, India, Vietnam, Argentina, Chile y otros. Las dos piden 88 días para el segundo año y 6 meses (179 días, hechos con la segunda visa) para el tercero, pero las categorías de trabajo y los límites de edad pueden variar por país.' },
          { type: 'h2', text: 'Errores comunes a evitar' },
          { type: 'ul', items: [
            'Contar un turno largo, o dos trabajos el mismo día, como más de un día.',
            'Contar el fin de semana de una semana part-time: solo la semana a tiempo completo cuenta los 7 días.',
            'No guardar payslips ni la declaración del empleador (Form 1263) como evidencia.',
            'Trabajar en un código postal o categoría no elegibles.',
            'Dejarlo para último momento — registrá desde tu primer turno.',
          ] },
          { type: 'h2', text: 'Cómo seguir tus 88 días sin planillas' },
          { type: 'p', text: 'La forma confiable es registrar cada turno con sus horas, agruparlos en semanas de lunes a domingo, revisar si cada semana fue a tiempo completo y, si no, contar los días realmente trabajados. Hacerlo a mano en una planilla funciona, pero es fácil equivocarse — y un error acá puede costarte un año entero de visa.' },
          { type: 'p', text: 'Orary lo hace automático: registrás tus turnos y los agrupa en semanas, cuenta cada semana con estas reglas usando tus horas pagas y te muestra una barra de progreso en vivo hacia los 88 días (segundo año) o los 179 (tercer año) — con payslips y ganancias registradas al lado, así los mismos datos respaldan tu solicitud de visa y tus impuestos.' },
          { type: 'cta', text: 'Seguí tus 88 días automáticamente — gratis, sin tarjeta de crédito.', label: 'Empezá gratis', to: '/register' },
          { type: 'note', text: 'Esto es solo orientación general. Las reglas de visa cambian — verificá siempre los requisitos vigentes en immi.homeaffairs.gov.au antes de decidir.' },
        ],
      },
      fr: {
        title: 'Comment compter tes 88 jours pour le Working Holiday Visa australien',
        description:
          'Guide clair de la règle des 88 jours de travail spécifié (sous-classe 417 et 462) : comment les jours de visa sont vraiment comptés, quel travail compte, quelles régions comptent et comment suivre ta progression.',
        content: [
          { type: 'p', text: "Si tu es en Australie avec un Working Holiday Visa et que tu veux une deuxième (ou troisième) année, tu connais le chiffre magique : **88 jours** de travail spécifié en région. Ce que presque personne n'explique clairement, c'est que ces 88 jours ne sont **pas** le nombre de jours où tu es allé travailler. Mal les compter est l'une des causes les plus fréquentes de retards ou de refus — alors faisons-le bien." },
          { type: 'h2', text: 'Qu’est-ce que la règle des 88 jours ?' },
          { type: 'p', text: 'Les titulaires d’un Working Holiday Visa de **sous-classe 417** et **462** doivent compléter 88 jours de « travail spécifié » éligible dans une zone régionale pendant leur première année de visa pour demander une deuxième année. La troisième année, c’est un compte à part : **6 mois (179 jours)** de travail spécifié effectués pendant ton deuxième visa. Les jours de la première année ne sont pas reportés.' },
          { type: 'h2', text: 'Comment les 88 jours sont vraiment comptés' },
          { type: 'p', text: 'Home Affairs demande d’effectuer **le même nombre de journées ou de quarts normaux qu’un salarié à temps plein de ton poste et de ton secteur sur 88 jours calendaires**. Quatre conséquences :' },
          { type: 'ul', items: [
            '**Une semaine à temps plein compte les 7 jours.** Si tu fais la semaine normale à temps plein de ton secteur (en général 5 jours, environ 38 heures), toute la semaine du lundi au dimanche compte, week-end compris.',
            '**Le temps partiel et l’occasionnel se comptent jour par jour.** Seuls les jours travaillés comptent, donc atteindre 88 prend plus de temps.',
            '**Une longue journée reste une journée.** Un quart de 12 heures, ou deux emplois le même jour, ne comptent jamais pour deux jours.',
            '**Les journées courtes comptent au prorata.** Une demi-journée standard vaut à peu près une demi-journée.',
          ] },
          { type: 'note', text: 'Il n’existe pas de barème officiel heures-jours. Des tableaux circulent qui transforment par exemple 7,5 heures en 2 jours, mais ils ignorent le nombre de jours travaillés et peuvent gonfler ton total. Dans le doute, compte prudemment et vérifie sur immi.homeaffairs.gov.au.' },
          { type: 'h2', text: 'Qu’est-ce qui compte comme travail spécifié' },
          { type: 'p', text: 'Les catégories éligibles incluent la culture de plantes et d’animaux (cueillette de fruits, taille, travail agricole), la pêche et la perliculture, la sylviculture et l’abattage, l’exploitation minière et la construction. Depuis 2023, certains emplois du tourisme et de l’hôtellerie dans des zones régionales spécifiées comptent aussi. Les catégories changent — vérifie toujours la liste à jour avant de commencer.' },
          { type: 'h2', text: 'Quelles régions comptent' },
          { type: 'p', text: 'Tout le Northern Territory, le South Australia et la Tasmanie comptent. Aussi le Queensland régional (hors Greater Brisbane), le Western Australia régional (hors zone métro de Perth), le New South Wales régional (hors Sydney, Newcastle et Wollongong) et le Victoria régional (hors Melbourne). Le Department publie les codes postaux exacts — vérifie le tien avant de signer.' },
          { type: 'h2', text: 'Sous-classe 417 vs 462' },
          { type: 'p', text: 'La sous-classe 417 concerne les passeports du Royaume-Uni, d’Irlande, du Canada, de France, d’Allemagne, d’Italie, des Pays-Bas, de Corée du Sud, du Japon et d’autres. La 462 concerne les États-Unis, la Chine, l’Inde, le Vietnam, l’Argentine, le Chili et d’autres. Les deux demandent 88 jours pour une deuxième année et 6 mois (179 jours, effectués avec le deuxième visa) pour une troisième, mais les catégories de travail et limites d’âge peuvent varier selon le pays.' },
          { type: 'h2', text: 'Erreurs courantes à éviter' },
          { type: 'ul', items: [
            'Compter un long quart, ou deux emplois le même jour, comme plus d’une journée.',
            'Compter le week-end d’une semaine à temps partiel : seule une semaine à temps plein compte les 7 jours.',
            'Ne pas garder les fiches de paie ni la déclaration de l’employeur (Form 1263) comme preuve.',
            'Travailler dans un code postal ou une catégorie non éligibles.',
            'Tout laisser à la dernière minute — enregistre dès ton premier quart.',
          ] },
          { type: 'h2', text: 'Comment suivre tes 88 jours sans tableurs' },
          { type: 'p', text: 'La méthode fiable : enregistrer chaque quart avec ses heures, les regrouper en semaines du lundi au dimanche, vérifier si chaque semaine était à temps plein et, sinon, compter les jours réellement travaillés. Le faire à la main dans un tableur fonctionne, mais c’est facile de se tromper — et une erreur ici peut te coûter une année entière de visa.' },
          { type: 'p', text: 'Orary le fait automatiquement : enregistre tes quarts et il les regroupe en semaines, compte chaque semaine selon ces règles à partir de tes heures payées et affiche une barre de progression en direct vers 88 jours (deuxième année) ou 179 jours (troisième année) — avec fiches de paie et revenus suivis à côté, pour que les mêmes données appuient ta demande de visa et tes impôts.' },
          { type: 'cta', text: 'Suis tes 88 jours automatiquement — gratuit, sans carte bancaire.', label: 'Commence gratuitement', to: '/register' },
          { type: 'note', text: 'Ceci n’est qu’une orientation générale. Les règles changent — vérifie toujours les exigences à jour sur immi.homeaffairs.gov.au.' },
        ],
      },
    },
  },

  {
    slug: 'working-holiday-visa-days-calculator',
    title: 'How Visa Days Are Calculated: counting your 88 days week by week',
    description:
      'How the Working Holiday Visa 88-day count really works: full-time weeks count all 7 days, part-time work counts the days you actually worked, and a long day is still one day. Worked examples and how many weeks it takes.',
    date: '2026-06-15',
    updated: '2026-11-18',
    readingTime: 7,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      { type: 'p', text: 'Almost every backpacker counts their 88 days wrong. Some count only the days they showed up, which undercounts full-time work. Others use an hours table found online that turns one long shift into two days, which overcounts. This guide explains the rule Home Affairs actually describes and walks through real weeks so you can check your own total.' },
      { type: 'h2', text: 'The rule in one sentence' },
      { type: 'p', text: 'You need **the same number of normal work days or shifts that a full-time employee in your role and industry would work in 88 calendar days** (179 for a third year, done on your second visa). Everything else follows from that.' },
      { type: 'h2', text: 'Three things that decide your count' },
      { type: 'ul', items: [
        '**Full-time week = 7 days.** Work the industry\'s normal full-time week (usually 5 days, around 38 hours) and the whole Monday–Sunday week counts, weekend included.',
        '**Otherwise, count the days you worked.** Part-time and casual work count day by day, so 88 takes longer.',
        '**One date is at most one day.** A 12-hour shift, or a farm shift plus a café shift on the same date, is still one day. Short days count pro rata: half a standard day is about half a day.',
      ] },
      { type: 'note', text: 'There is no official hours-to-days table. Paid public holidays and paid sick leave count; unpaid days, including days lost to weather, don\'t.' },
      { type: 'h2', text: 'Worked example 1 — a full-time harvest week' },
      { type: 'p', text: 'Maria picks strawberries Monday to Saturday, about 7 hours a day: 6 days and **42 hours**. That is a full-time week, so it counts as **7 visa days**, Sunday included.' },
      { type: 'h2', text: 'Worked example 2 — long shifts, fewer days' },
      { type: 'p', text: 'Tom does four 9-hour shifts at a packing shed: **36 hours** in 4 days. It is not a full-time week (4 days, under 38 hours), so he counts the days he worked: **4 visa days**. An hours table would have given him 7. That is the kind of overcount that gets an application questioned.' },
      { type: 'h2', text: 'Worked example 3 — a part-time week' },
      { type: 'p', text: 'Lena works three 4-hour shifts at a café in a regional town. Each is about half a standard day (4 ÷ 7.6), so the week is worth about **1.6 visa days**. Part-time work counts, it just adds up slowly.' },
      { type: 'h2', text: 'Putting a month together' },
      { type: 'p', text: 'Say a month looks like this:' },
      { type: 'ul', items: [
        'Week 1: 6 days, 42 hours (full time) → 7 days',
        'Week 2: 4 days of 9 hours → 4 days',
        'Week 3: 5 days of 6 hours (30 hours, under full time) → about 3.9 days',
        'Week 4: 5 days of 7.6 hours (38 hours) → 7 days',
      ] },
      { type: 'p', text: 'Total for the month = 7 + 4 + 3.9 + 7 = **about 21.9 visa days**. Full-time weeks are what move the count fastest.' },
      { type: 'h2', text: 'How many weeks does it take to reach 88 days?' },
      { type: 'p', text: 'It depends on how many days a week you work:' },
      { type: 'ul', items: [
        'Full time every week → 7 days/week → about 13 weeks (the 88 calendar days)',
        '4 full days a week → 4 days/week → 22 weeks',
        '3 full days a week → 3 days/week → about 30 weeks',
        '2 full days a week → 2 days/week → 44 weeks',
      ] },
      { type: 'note', text: 'This is why steady full-time work is the fastest route, and why scattered part-time shifts can stretch "88 days" across most of your visa year.' },
      { type: 'h2', text: 'Track the calculation automatically' },
      { type: 'p', text: 'Orary does this for you: log your shifts and it groups them into Monday–Sunday weeks, checks whether each week was full time, otherwise counts the days you worked, and shows a live total toward 88 days (second year) or 179 days (third year). It uses your paid hours (unpaid breaks deducted), and you can set a different full-time week for each job if your industry isn\'t 38 hours.' },
      { type: 'cta', text: 'See your 88-day total update automatically as you log shifts — free.', label: 'Start tracking free', to: '/register' },
      { type: 'note', text: 'General guidance only. The Department of Home Affairs sets and updates these rules. Always confirm the current requirements at immi.homeaffairs.gov.au.' },
    ],
    related: ['track-88-days-working-holiday-visa'],
    translations: {
      es: {
        title: 'Cómo se calculan los días de visa: los 88 días semana por semana',
        description:
          'Cómo funciona de verdad el conteo de 88 días de la Working Holiday Visa: una semana a tiempo completo cuenta los 7 días, el trabajo part-time cuenta los días que trabajaste y un día largo sigue siendo un día. Ejemplos y cuántas semanas lleva.',
        content: [
          { type: 'p', text: 'Casi todos los backpackers cuentan mal sus 88 días. Algunos cuentan solo los días que fueron a trabajar, y se quedan cortos con el trabajo a tiempo completo. Otros usan una tabla de horas que encontraron en internet y que convierte un turno largo en dos días, y se pasan. Esta guía explica la regla que describe Home Affairs y recorre semanas reales para que revises tu propio total.' },
          { type: 'h2', text: 'La regla en una frase' },
          { type: 'p', text: 'Necesitás **la misma cantidad de jornadas o turnos normales que haría un empleado a tiempo completo en tu puesto e industria durante 88 días calendario** (179 para el tercer año, hechos con la segunda visa). Todo lo demás sale de ahí.' },
          { type: 'h2', text: 'Tres cosas que definen tu cuenta' },
          { type: 'ul', items: [
            '**Semana a tiempo completo = 7 días.** Si trabajás la semana completa normal de tu industria (en general 5 días, unas 38 horas), cuenta toda la semana de lunes a domingo, fin de semana incluido.',
            '**Si no, contás los días que trabajaste.** El trabajo part-time o casual se cuenta día por día, así que llegar a 88 lleva más.',
            '**Una fecha vale como máximo un día.** Un turno de 12 horas, o un turno en la granja más otro en un café el mismo día, sigue siendo un día. Los días cortos cuentan en proporción: media jornada estándar es más o menos medio día.',
          ] },
          { type: 'note', text: 'No existe una tabla oficial de horas a días. Los feriados y las licencias por enfermedad pagas cuentan; los días sin goce, incluidos los perdidos por mal clima, no.' },
          { type: 'h2', text: 'Ejemplo 1 — una semana de cosecha a tiempo completo' },
          { type: 'p', text: 'Maria cosecha frutillas de lunes a sábado, unas 7 horas por día: 6 días y **42 horas**. Es una semana a tiempo completo, así que cuenta como **7 días de visa**, domingo incluido.' },
          { type: 'h2', text: 'Ejemplo 2 — turnos largos, menos días' },
          { type: 'p', text: 'Tom hace cuatro turnos de 9 horas en un galpón de empaque: **36 horas** en 4 días. No es una semana completa (4 días, menos de 38 horas), así que cuenta los días que trabajó: **4 días de visa**. Una tabla de horas le habría dado 7. Ese tipo de exceso es el que hace que revisen una solicitud.' },
          { type: 'h2', text: 'Ejemplo 3 — una semana part-time' },
          { type: 'p', text: 'Lena hace tres turnos de 4 horas en un café de un pueblo regional. Cada uno es más o menos media jornada estándar (4 ÷ 7,6), así que la semana vale unos **1,6 días de visa**. El part-time cuenta, solo que suma despacio.' },
          { type: 'h2', text: 'Un mes completo' },
          { type: 'p', text: 'Digamos que un mes se ve así:' },
          { type: 'ul', items: [
            'Semana 1: 6 días, 42 horas (tiempo completo) → 7 días',
            'Semana 2: 4 días de 9 horas → 4 días',
            'Semana 3: 5 días de 6 horas (30 horas, menos que tiempo completo) → unos 3,9 días',
            'Semana 4: 5 días de 7,6 horas (38 horas) → 7 días',
          ] },
          { type: 'p', text: 'Total del mes = 7 + 4 + 3,9 + 7 = **unos 21,9 días de visa**. Las semanas a tiempo completo son las que más hacen avanzar la cuenta.' },
          { type: 'h2', text: '¿Cuántas semanas lleva llegar a 88 días?' },
          { type: 'p', text: 'Depende de cuántos días por semana trabajes:' },
          { type: 'ul', items: [
            'Tiempo completo todas las semanas → 7 días/semana → unas 13 semanas (los 88 días calendario)',
            '4 jornadas completas por semana → 4 días/semana → 22 semanas',
            '3 jornadas completas por semana → 3 días/semana → unas 30 semanas',
            '2 jornadas completas por semana → 2 días/semana → 44 semanas',
          ] },
          { type: 'note', text: 'Por esto el trabajo a tiempo completo y constante es la ruta más rápida, y por esto los turnos part-time sueltos pueden estirar los "88 días" a casi todo tu año de visa.' },
          { type: 'h2', text: 'Seguí el cálculo automáticamente' },
          { type: 'p', text: 'Orary lo hace por vos: registrás tus turnos y los agrupa en semanas de lunes a domingo, revisa si cada semana fue a tiempo completo, si no cuenta los días que trabajaste, y muestra un total en vivo hacia los 88 días (segundo año) o los 179 (tercer año). Usa tus horas pagas (con el descanso no pago descontado), y podés configurar otra semana completa para cada trabajo si tu industria no es de 38 horas.' },
          { type: 'cta', text: 'Mirá tu total de 88 días actualizarse solo a medida que registrás turnos — gratis.', label: 'Empezá gratis', to: '/register' },
          { type: 'note', text: 'Solo orientación general. El Department of Home Affairs fija y actualiza estas reglas: confirmá siempre los requisitos vigentes en immi.homeaffairs.gov.au.' },
        ],
      },
      fr: {
        title: 'Comment les jours de visa sont calculés : les 88 jours semaine par semaine',
        description:
          'Comment fonctionne vraiment le décompte des 88 jours du Working Holiday Visa : une semaine à temps plein compte les 7 jours, le temps partiel compte les jours travaillés et une longue journée reste une journée. Exemples et nombre de semaines nécessaires.',
        content: [
          { type: 'p', text: 'Presque tous les backpackers comptent mal leurs 88 jours. Certains ne comptent que les jours où ils sont allés travailler, ce qui sous-estime le temps plein. D’autres utilisent un tableau d’heures trouvé en ligne qui transforme un long quart en deux jours, ce qui surestime. Ce guide explique la règle décrite par Home Affairs et déroule des semaines réelles pour que tu vérifies ton propre total.' },
          { type: 'h2', text: 'La règle en une phrase' },
          { type: 'p', text: 'Il te faut **le même nombre de journées ou de quarts normaux qu’un salarié à temps plein de ton poste et de ton secteur sur 88 jours calendaires** (179 pour une troisième année, effectués pendant ton deuxième visa). Tout le reste en découle.' },
          { type: 'h2', text: 'Trois choses qui décident de ton total' },
          { type: 'ul', items: [
            '**Semaine à temps plein = 7 jours.** Si tu fais la semaine normale à temps plein de ton secteur (en général 5 jours, environ 38 heures), toute la semaine du lundi au dimanche compte, week-end compris.',
            '**Sinon, tu comptes les jours travaillés.** Le temps partiel et l’occasionnel se comptent jour par jour, donc atteindre 88 prend plus de temps.',
            '**Une date vaut au plus une journée.** Un quart de 12 heures, ou un quart à la ferme plus un au café le même jour, reste une journée. Les journées courtes comptent au prorata : une demi-journée standard vaut à peu près une demi-journée.',
          ] },
          { type: 'note', text: 'Il n’existe pas de barème officiel heures-jours. Les jours fériés et congés maladie payés comptent ; les jours non payés, y compris ceux perdus à cause de la météo, non.' },
          { type: 'h2', text: 'Exemple 1 — une semaine de récolte à temps plein' },
          { type: 'p', text: 'Maria cueille des fraises du lundi au samedi, environ 7 heures par jour : 6 jours et **42 heures**. C’est une semaine à temps plein, elle compte donc pour **7 jours de visa**, dimanche compris.' },
          { type: 'h2', text: 'Exemple 2 — de longs quarts, moins de jours' },
          { type: 'p', text: 'Tom fait quatre quarts de 9 heures dans un hangar d’emballage : **36 heures** en 4 jours. Ce n’est pas une semaine à temps plein (4 jours, moins de 38 heures), il compte donc les jours travaillés : **4 jours de visa**. Un tableau d’heures lui en aurait donné 7. C’est ce genre d’excès qui fait remettre une demande en question.' },
          { type: 'h2', text: 'Exemple 3 — une semaine à temps partiel' },
          { type: 'p', text: 'Lena fait trois quarts de 4 heures dans un café d’une ville régionale. Chacun vaut environ une demi-journée standard (4 ÷ 7,6), la semaine vaut donc environ **1,6 jour de visa**. Le temps partiel compte, il avance juste lentement.' },
          { type: 'h2', text: 'Un mois complet' },
          { type: 'p', text: 'Disons qu’un mois ressemble à ça :' },
          { type: 'ul', items: [
            'Semaine 1 : 6 jours, 42 heures (temps plein) → 7 jours',
            'Semaine 2 : 4 jours de 9 heures → 4 jours',
            'Semaine 3 : 5 jours de 6 heures (30 heures, sous le temps plein) → environ 3,9 jours',
            'Semaine 4 : 5 jours de 7,6 heures (38 heures) → 7 jours',
          ] },
          { type: 'p', text: 'Total du mois = 7 + 4 + 3,9 + 7 = **environ 21,9 jours de visa**. Ce sont les semaines à temps plein qui font avancer le total le plus vite.' },
          { type: 'h2', text: 'Combien de semaines pour atteindre 88 jours ?' },
          { type: 'p', text: 'Cela dépend du nombre de jours travaillés par semaine :' },
          { type: 'ul', items: [
            'Temps plein chaque semaine → 7 jours/semaine → environ 13 semaines (les 88 jours calendaires)',
            '4 journées complètes par semaine → 4 jours/semaine → 22 semaines',
            '3 journées complètes par semaine → 3 jours/semaine → environ 30 semaines',
            '2 journées complètes par semaine → 2 jours/semaine → 44 semaines',
          ] },
          { type: 'note', text: 'Voilà pourquoi un travail régulier à temps plein est la voie la plus rapide, et pourquoi des quarts à temps partiel éparpillés peuvent étaler « 88 jours » sur presque toute ton année de visa.' },
          { type: 'h2', text: 'Suis le calcul automatiquement' },
          { type: 'p', text: 'Orary le fait pour toi : enregistre tes quarts et il les regroupe en semaines du lundi au dimanche, vérifie si chaque semaine était à temps plein, compte sinon les jours travaillés, et affiche un total en direct vers 88 jours (deuxième année) ou 179 jours (troisième année). Il utilise tes heures payées (pause non payée déduite), et tu peux régler une autre semaine à temps plein pour chaque emploi si ton secteur n’est pas à 38 heures.' },
          { type: 'cta', text: 'Vois ton total de 88 jours se mettre à jour tout seul à mesure que tu enregistres tes quarts — gratuit.', label: 'Commence gratuitement', to: '/register' },
          { type: 'note', text: 'Orientation générale uniquement. Le Department of Home Affairs fixe et met à jour ces règles : vérifie toujours les exigences en vigueur sur immi.homeaffairs.gov.au.' },
        ],
      },
    },
  },

  {
    slug: 'best-apps-casual-workers-2026',
    title: 'Best Apps for Casual Workers in 2026',
    description:
      'Most "best scheduling app" lists are written for bosses. Here is an honest comparison from the worker\'s side — what a casual, multi-job worker actually needs to track shifts and real pay in 2026.',
    date: '2026-06-15',
    readingTime: 7,
    tag: 'Shift work',
    accent: '#EC4899',
    content: [
      {
        type: 'p',
        text: "Search \"best app for shifts\" and almost every result is built for **employers** — the business pays, a manager builds the roster, and you're just slotted in. But if you're a **casual worker juggling one or more jobs**, you need the opposite: something that tracks *your* shifts and *your* real pay, no matter who you work for. Here's an honest look from the worker's side.",
      },
      { type: 'h2', text: 'What a casual worker actually needs (vs an employer)' },
      {
        type: 'ul',
        items: [
          'Track **your own** shifts across multiple employers — not just one roster.',
          'See **real earnings**, including penalty rates for nights and weekends.',
          'Keep your own record as a check against what the boss says you worked.',
          "Not depend on your employer adopting any particular system.",
          'Be free — casual pay is tight enough already.',
        ],
      },
      { type: 'h2', text: 'The popular apps — and who they are really for' },
      {
        type: 'p',
        text: 'Homebase, Deputy and When I Work are excellent — for **businesses**. They are scheduling and time-clock tools the employer pays for and controls. As a casual employee you might clock in with one, but you can’t use it to track pay across several jobs, and you don’t own the data.',
      },
      {
        type: 'table',
        headers: ['Tool', 'Built for', 'Who pays', 'Multi-employer', 'Price'],
        rows: [
          ['Homebase', 'Employers', 'The business', 'No', 'Free ≤20 staff, then ~$30/mo'],
          ['Deputy', 'Employers', 'The business', 'No', '~$5.50 / user / mo'],
          ['When I Work', 'Employers', 'The business', 'No', '~$2.50–$5 / user / mo'],
          ['Gridwise / Para', 'Workers (gig, US only)', 'The worker', '—', 'Free + paid'],
          ['MyVisaTracker', 'Workers (visa days only)', 'The worker', 'No', 'Free'],
          ['**Orary**', '**Workers (any job)**', '**The worker**', '**Yes**', '**Free**'],
        ],
      },
      {
        type: 'p',
        text: 'The pattern is hard to miss: the big names are **built for employers** — the business pays and the manager runs the roster. Orary is **built for the worker**: you own it, it’s free, and it follows you across every job.',
      },
      { type: 'h2', text: 'The gap: worker-side tools' },
      {
        type: 'p',
        text: "Notice the pattern — almost everything is employer-side. The handful of worker-first tools are narrow: gig apps like Gridwise are US-focused and only for drivers; visa trackers only count days. There's very little for the everyday casual worker who just wants to log shifts and know what they earned.",
      },
      {
        type: 'p',
        text: 'That gap is exactly why Orary exists: it’s **free and worker-side**, works across multiple employers, calculates earnings with your own rates (day/afternoon/night/weekend), handles delivery and gig income, and — uniquely — tracks your Australian Working Holiday Visa 88-day progress alongside everything else.',
      },
      { type: 'h2', text: 'How to choose' },
      {
        type: 'ul',
        items: [
          'If you **manage a team** → Homebase, Deputy or When I Work.',
          'If you **drive gig in the US** → Gridwise or Para.',
          'If you **only need visa-day counting** → a basic visa tracker.',
          'If you’re a **worker who wants shifts + real pay in one place** (and the 88 days if you’re on a WHV) → Orary.',
        ],
      },
      {
        type: 'cta',
        text: 'Track your shifts and real earnings across every job — free, no credit card.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Prices and positioning are as of 2026 and change often — check each provider’s current site before deciding.',
      },
    ],
    related: ['is-delivery-driving-worth-it', 'track-88-days-working-holiday-visa'],
  },

  {
    slug: 'working-holiday-maker-tax-refund-australia',
    title: 'Working Holiday Maker Tax in Australia (and How to Get a Refund)',
    description:
      'How working holiday makers are taxed in Australia, why so many backpackers overpay, and a worked example of the refund you can claim back — plus your superannuation (DASP).',
    date: '2026-06-15',
    readingTime: 8,
    tag: 'Tax & refunds',
    accent: '#10B981',
    content: [
      {
        type: 'p',
        text: "Thousands of backpackers leave Australia having **overpaid tax** and never claim it back. If you worked here on a 417 or 462 Working Holiday Visa, you might be owed hundreds — sometimes thousands — of dollars. Here's how working holiday maker (WHM) tax actually works, and how to know if there's a refund waiting for you.",
      },
      { type: 'h2', text: 'How working holiday makers are taxed' },
      {
        type: 'p',
        text: 'WHMs are taxed under a special schedule. Unlike residents, you do **not** get the tax-free threshold — you pay from the first dollar:',
      },
      {
        type: 'table',
        headers: ['Income (per year)', 'WHM tax rate'],
        rows: [
          ['$0 – $45,000', '15%'],
          ['$45,001 – $135,000', '30%'],
          ['$135,001 – $190,000', '37%'],
          ['$190,001+', '45%'],
        ],
      },
      {
        type: 'note',
        text: 'This only applies if your employer is **registered** with the ATO as an employer of working holiday makers. If they are **not** registered, they must withhold **30% from the very first dollar** — which is exactly how over-withholding (and refunds) happen.',
      },
      { type: 'h2', text: 'Why you might be owed a refund' },
      {
        type: 'ul',
        items: [
          'Your employer **wasn’t registered** and withheld 30% when you should have paid 15%.',
          'Too much PAYG tax was withheld from your pay across the year.',
          'You have **work-related deductions** (tools, uniforms, vehicle/mileage) that lower your taxable income.',
        ],
      },
      { type: 'h2', text: 'Worked example — the unregistered-employer refund' },
      {
        type: 'p',
        text: 'Jess earns **$30,000** for the year on a Working Holiday Visa. Her employer wasn’t registered, so they withheld 30% the whole time = **$9,000 withheld**. But as a WHM her actual tax on $30,000 is just 15% = **$4,500**. At tax time she lodges a return and gets back the difference: **$9,000 − $4,500 = $4,500 refund**.',
      },
      { type: 'h2', text: 'Worked example — with deductions' },
      {
        type: 'p',
        text: 'Same $30,000, but Jess also did delivery and tracked **$1,500** of vehicle and phone expenses. Her taxable income drops to $28,500, so her tax is 15% × $28,500 = **$4,275**. Those deductions added another **$225** to her refund — which is why keeping receipts and tracking your work expenses all year pays off.',
      },
      { type: 'h2', text: 'Don’t forget your superannuation (DASP)' },
      {
        type: 'p',
        text: 'On top of income tax, your employer paid **superannuation** (retirement savings) on your behalf. When you leave Australia permanently and your visa expires, you can claim it back through the **Departing Australia Superannuation Payment (DASP)**. It’s taxed at a high rate for WHMs, but on months of full-time work it can still be a meaningful lump sum — don’t walk away from it.',
      },
      { type: 'h2', text: 'What you need to lodge' },
      {
        type: 'ul',
        items: [
          'Your Tax File Number (TFN).',
          'Income statements / payslips from every employer.',
          'Records of any work-related deductions.',
          'Lodge from 1 July (end of the financial year) via myTax or a registered tax agent.',
        ],
      },
      { type: 'h2', text: 'Track it through the year, not at the end' },
      {
        type: 'p',
        text: 'The backpackers who get the biggest refunds are the ones who kept records as they went. Orary can read your payslips, track your gross pay and tax withheld, log delivery expenses for deductions, and give you a running estimate of your income tax — so there are no surprises when you lodge.',
      },
      {
        type: 'cta',
        text: 'Keep your payslips and tax estimate in one place all year.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General information only, not tax advice. Rates and rules change — confirm at ato.gov.au or speak to a registered tax agent before lodging.',
      },
    ],
    related: ['working-holiday-visa-days-calculator', 'track-88-days-working-holiday-visa'],
    translations: {
      es: {
        title: 'Impuestos del Working Holiday Maker en Australia (y cómo pedir el reembolso)',
        description:
          'Cómo se le cobran impuestos a los working holiday makers en Australia, por qué tantos backpackers pagan de más, y un ejemplo trabajado del reembolso que podés reclamar — más tu jubilación (DASP).',
        content: [
          { type: 'p', text: 'Miles de backpackers se van de Australia habiendo **pagado impuestos de más** y nunca los reclaman. Si trabajaste acá con una Working Holiday Visa 417 o 462, podrían deberte cientos — a veces miles — de dólares. Acá está cómo funciona de verdad el impuesto del working holiday maker (WHM) y cómo saber si tenés un reembolso esperándote.' },
          { type: 'h2', text: 'Cómo se le cobran impuestos a los working holiday makers' },
          { type: 'p', text: 'Los WHM tributan bajo una escala especial. A diferencia de los residentes, **no** tenés el mínimo no imponible — pagás desde el primer dólar:' },
          { type: 'table', headers: ['Ingreso (por año)', 'Tasa WHM'], rows: [
            ['$0 – $45,000', '15%'],
            ['$45,001 – $135,000', '30%'],
            ['$135,001 – $190,000', '37%'],
            ['$190,001+', '45%'],
          ] },
          { type: 'note', text: 'Esto solo aplica si tu empleador está **registrado** ante la ATO como empleador de working holiday makers. Si **no** está registrado, debe retener el **30% desde el primer dólar** — que es exactamente como se produce la retención de más (y los reembolsos).' },
          { type: 'h2', text: 'Por qué podrían deberte un reembolso' },
          { type: 'ul', items: [
            'Tu empleador **no estaba registrado** y retuvo 30% cuando deberías haber pagado 15%.',
            'Se retuvo demasiado impuesto PAYG de tu sueldo a lo largo del año.',
            'Tenés **deducciones laborales** (herramientas, uniformes, vehículo/kilómetros) que bajan tu ingreso gravable.',
          ] },
          { type: 'h2', text: 'Ejemplo trabajado — el reembolso por empleador no registrado' },
          { type: 'p', text: 'Jess gana **$30,000** en el año con una Working Holiday Visa. Su empleador no estaba registrado, así que le retuvieron 30% todo el tiempo = **$9,000 retenidos**. Pero como WHM su impuesto real sobre $30,000 es solo 15% = **$4,500**. En la temporada de impuestos presenta su declaración y recupera la diferencia: **$9,000 − $4,500 = $4,500 de reembolso**.' },
          { type: 'h2', text: 'Ejemplo trabajado — con deducciones' },
          { type: 'p', text: 'Los mismos $30,000, pero Jess además hizo delivery y registró **$1,500** de gastos de vehículo y teléfono. Su ingreso gravable baja a $28,500, así que su impuesto es 15% × $28,500 = **$4,275**. Esas deducciones sumaron otros **$225** a su reembolso — por eso guardar recibos y registrar tus gastos laborales todo el año rinde.' },
          { type: 'h2', text: 'No te olvides de tu jubilación (DASP)' },
          { type: 'p', text: 'Además del impuesto a las ganancias, tu empleador pagó **superannuation** (ahorro jubilatorio) en tu nombre. Cuando te vas de Australia de forma permanente y tu visa vence, podés reclamarlo con el **Departing Australia Superannuation Payment (DASP)**. Para los WHM tributa a una tasa alta, pero con meses de trabajo a tiempo completo igual puede ser una suma importante — no la dejes ahí.' },
          { type: 'h2', text: 'Qué necesitás para presentar' },
          { type: 'ul', items: [
            'Tu Tax File Number (TFN).',
            'Income statements / payslips de cada empleador.',
            'Registros de cualquier deducción laboral.',
            'Presentá desde el 1 de julio (fin del año fiscal) por myTax o un agente fiscal registrado.',
          ] },
          { type: 'h2', text: 'Registralo durante el año, no al final' },
          { type: 'p', text: 'Los backpackers que reciben los reembolsos más grandes son los que llevaron registros sobre la marcha. Orary puede leer tus payslips, registrar tu sueldo bruto y el impuesto retenido, anotar gastos de delivery para deducciones y darte una estimación en vivo de tu impuesto — así no hay sorpresas al presentar.' },
          { type: 'cta', text: 'Tené tus payslips y tu estimación de impuestos en un solo lugar todo el año.', label: 'Empezá gratis', to: '/register' },
          { type: 'note', text: 'Solo información general, no asesoramiento fiscal. Las tasas y reglas cambian — confirmá en ato.gov.au o hablá con un agente fiscal registrado antes de presentar.' },
        ],
      },
      fr: {
        title: 'Impôts du Working Holiday Maker en Australie (et comment obtenir un remboursement)',
        description:
          'Comment les working holiday makers sont imposés en Australie, pourquoi tant de backpackers paient trop, et un exemple chiffré du remboursement que tu peux récupérer — plus ta retraite (DASP).',
        content: [
          { type: 'p', text: "Des milliers de backpackers quittent l'Australie après avoir **trop payé d'impôts** sans jamais les récupérer. Si tu as travaillé ici avec un Working Holiday Visa 417 ou 462, on pourrait te devoir des centaines — parfois des milliers — de dollars. Voici comment fonctionne vraiment l'impôt du working holiday maker (WHM) et comment savoir si un remboursement t'attend." },
          { type: 'h2', text: 'Comment les working holiday makers sont imposés' },
          { type: 'p', text: 'Les WHM sont imposés selon un barème spécial. Contrairement aux résidents, tu n’as **pas** d’abattement de base — tu paies dès le premier dollar :' },
          { type: 'table', headers: ['Revenu (par an)', 'Taux WHM'], rows: [
            ['$0 – $45,000', '15%'],
            ['$45,001 – $135,000', '30%'],
            ['$135,001 – $190,000', '37%'],
            ['$190,001+', '45%'],
          ] },
          { type: 'note', text: 'Cela ne s’applique que si ton employeur est **enregistré** auprès de l’ATO comme employeur de working holiday makers. S’il **n’est pas** enregistré, il doit retenir **30% dès le premier dollar** — c’est exactement ainsi que survient le sur-prélèvement (et les remboursements).' },
          { type: 'h2', text: 'Pourquoi on pourrait te devoir un remboursement' },
          { type: 'ul', items: [
            'Ton employeur **n’était pas enregistré** et a retenu 30% alors que tu aurais dû payer 15%.',
            'Trop d’impôt PAYG a été retenu sur ta paie au cours de l’année.',
            'Tu as des **déductions liées au travail** (outils, uniformes, véhicule/kilomètres) qui réduisent ton revenu imposable.',
          ] },
          { type: 'h2', text: 'Exemple chiffré — le remboursement employeur non enregistré' },
          { type: 'p', text: 'Jess gagne **$30,000** sur l’année avec un Working Holiday Visa. Son employeur n’était pas enregistré, donc on lui a retenu 30% tout du long = **$9,000 retenus**. Mais en tant que WHM son impôt réel sur $30,000 n’est que de 15% = **$4,500**. À la période fiscale elle dépose sa déclaration et récupère la différence : **$9,000 − $4,500 = $4,500 de remboursement**.' },
          { type: 'h2', text: 'Exemple chiffré — avec déductions' },
          { type: 'p', text: 'Les mêmes $30,000, mais Jess a aussi fait de la livraison et noté **$1,500** de frais de véhicule et de téléphone. Son revenu imposable tombe à $28,500, donc son impôt est de 15% × $28,500 = **$4,275**. Ces déductions ont ajouté **$225** de plus à son remboursement — d’où l’intérêt de garder les reçus et de suivre tes frais professionnels toute l’année.' },
          { type: 'h2', text: 'N’oublie pas ta retraite (DASP)' },
          { type: 'p', text: 'En plus de l’impôt sur le revenu, ton employeur a versé une **superannuation** (épargne retraite) en ton nom. Quand tu quittes l’Australie définitivement et que ton visa expire, tu peux la récupérer via le **Departing Australia Superannuation Payment (DASP)**. Elle est imposée à un taux élevé pour les WHM, mais après des mois de travail à temps plein, cela peut quand même représenter une somme appréciable — ne l’abandonne pas.' },
          { type: 'h2', text: 'Ce qu’il te faut pour déposer' },
          { type: 'ul', items: [
            'Ton Tax File Number (TFN).',
            'Les income statements / fiches de paie de chaque employeur.',
            'Les justificatifs de toute déduction liée au travail.',
            'Dépose à partir du 1er juillet (fin de l’année fiscale) via myTax ou un agent fiscal enregistré.',
          ] },
          { type: 'h2', text: 'Suis-le pendant l’année, pas à la fin' },
          { type: 'p', text: 'Les backpackers qui obtiennent les plus gros remboursements sont ceux qui ont tenu des registres au fil de l’eau. Orary peut lire tes fiches de paie, suivre ton salaire brut et l’impôt retenu, noter tes frais de livraison pour les déductions et te donner une estimation en direct de ton impôt — pour zéro surprise au moment de déposer.' },
          { type: 'cta', text: 'Garde tes fiches de paie et ton estimation d’impôt au même endroit toute l’année.', label: 'Commence gratuitement', to: '/register' },
          { type: 'note', text: 'Information générale uniquement, pas un conseil fiscal. Les taux et règles changent — vérifie sur ato.gov.au ou parle à un agent fiscal enregistré avant de déposer.' },
        ],
      },
    },
  },

  {
    slug: 'is-delivery-driving-worth-it',
    title: 'Is Delivery Driving Worth It? How to Calculate Your Real Hourly Rate',
    description:
      'The app says $25/hour, but that is not what you keep. Here is the simple formula to work out your real delivery hourly rate after fuel and dead time — with a worked Friday-night example.',
    date: '2026-06-15',
    readingTime: 7,
    tag: 'Delivery & gig',
    accent: '#F59E0B',
    content: [
      {
        type: 'p',
        text: "Delivery apps love to show a big number — \"earn up to $30/hour!\" — but that's the rate **before** fuel, before vehicle wear, and before all the time you spend waiting for orders. Your **real** hourly rate is what actually lands in your pocket per hour online. Here's how to work it out, and a real example.",
      },
      { type: 'h2', text: 'The real-rate formula' },
      {
        type: 'p',
        text: '**Real hourly rate = (total earnings − running costs) ÷ total hours online.** The key is "hours online", not "hours with an order" — the dead time between deliveries is unpaid, and it counts against your rate.',
      },
      { type: 'h2', text: 'Worked example — a Friday night shift' },
      {
        type: 'p',
        text: 'You’re online for **5 hours** and earn **$120** in fees and tips. You drive **80 km** and spend about **$13** on fuel. So your net is $120 − $13 = **$107**, over 5 hours online = **$21.40/hour**. Not the $30 the app promised — but not bad, *if* Friday nights are consistently this busy. A quiet Tuesday with 2 hours of orders spread across 5 hours online tells a very different story.',
      },
      { type: 'h2', text: "The hidden costs people forget" },
      {
        type: 'table',
        headers: ['Cost', 'Why it matters'],
        rows: [
          ['Fuel', 'The obvious one — track it every shift.'],
          ['Vehicle wear & servicing', 'Tyres, brakes, oil, depreciation add up per km.'],
          ['Phone & data', 'You’re using your own device and plan.'],
          ['No super, leave or sick pay', 'As a contractor you fund your own safety net.'],
          ['Tax', 'You set aside your own — but you can also deduct (see below).'],
        ],
      },
      { type: 'h2', text: 'The tax flip side — claim your kilometres' },
      {
        type: 'p',
        text: 'Those costs aren’t all bad news. In Australia you can deduct work kilometres at the ATO cents-per-km rate (around **$0.88/km**). That 80 km Friday night is roughly **80 × $0.88 = $70** of deductions — money off your taxable income. Over a year of driving, logging every kilometre can be worth thousands at tax time, so track km from day one.',
      },
      { type: 'h2', text: 'So, is it worth it?' },
      {
        type: 'p',
        text: "It depends entirely on *your* real rate in *your* city, on *your* busy days — not the app's headline number. The only way to know is to track a few weeks honestly: earnings, fuel, kilometres and hours online. Then compare your real $/hour to other work you could do.",
      },
      { type: 'h2', text: 'Track your real rate automatically' },
      {
        type: 'p',
        text: 'Orary’s delivery mode is built for exactly this: log each session’s earnings, tips, kilometres and fuel, and it shows your real per-hour and per-order rates, your estimated mileage deduction, and a breakdown by platform — so you can see at a glance which apps and shifts are actually worth your time.',
      },
      {
        type: 'cta',
        text: 'See your real delivery hourly rate — across every platform, free.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Figures are illustrative examples. Fuel, rates and the ATO cents-per-km amount change — confirm current figures at ato.gov.au.',
      },
    ],
    related: ['best-apps-casual-workers-2026', 'working-holiday-maker-tax-refund-australia'],
  },

  {
    slug: 'specified-work-eligible-postcodes-australia',
    title: 'Specified Work & Eligible Postcodes for Your Second-Year Visa (417 & 462)',
    description:
      'Not all work counts toward your 88 days, and the wrong postcode means zero progress — and the rules are different for the 417 and the 462. Here is what qualifies, where it counts for each visa, and how to check a job before you take it.',
    date: '2026-06-15',
    readingTime: 10,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      {
        type: 'p',
        text: "You can work 88 days straight and still get knocked back for a second year — if the **job type** or the **postcode** doesn't count. Two things have to be true at the same time: the work must be an eligible **specified work** category, and it must be in an eligible **area**. Get either wrong and those days are worth zero.",
      },
      {
        type: 'p',
        text: "And here is the part most guides skip: the rules are **not the same for the two working holiday visas**. The subclass 417 and the subclass 462 count work in different places. Before anything else, you need to know which one you hold.",
      },
      { type: 'h2', text: 'First: 417 or 462?' },
      {
        type: 'p',
        text: 'The **417 (Working Holiday)** is for passports like the UK, Ireland, Germany, France, Canada, Italy, Japan and Korea. The **462 (Work and Holiday)** is for countries like the USA, China, Spain, Argentina, Indonesia and Vietnam, and it adds education and English requirements. They look identical on paper — but for your second year, where your 88 days count is different. Use the switch below.',
      },
      { type: 'embed', component: 'auRegionExplorer' },
      { type: 'h2', text: 'What counts as specified work' },
      {
        type: 'ul',
        items: [
          'Plant and animal cultivation — fruit picking, harvesting, pruning, planting, shearing, dairy and general farm work.',
          'Fishing and pearling.',
          'Tree farming and felling.',
          'Mining.',
          'Construction.',
          'Bushfire, flood and natural-disaster recovery work.',
          'Tourism and hospitality — but only in eligible northern, remote or very remote areas (this is mainly a 462 pathway).',
        ],
      },
      { type: 'h2', text: 'What usually does NOT count' },
      {
        type: 'p',
        text: 'Hospitality or retail in a **major city**, office and admin work, au pair or domestic roles, and unpaid "volunteering" for accommodation typically do not qualify. Example: waitressing in central Sydney = no. The same job in an eligible northern town on a 462 = potentially yes. The job title alone never tells you — the **category plus the location plus your visa** do.',
      },
      { type: 'h2', text: 'Why the 462 trips people up' },
      {
        type: 'p',
        text: 'On a 417, specified work counts across **regional Australia** — whole states (NT, SA, Tasmania) or everything outside the big cities. On a 462, most specified work has to be done in **Northern Australia: north of the Tropic of Capricorn** — think Cairns, Townsville, Darwin, Katherine, Broome and Mount Isa. A farm job that earns a 417 holder their second year can earn a 462 holder nothing if it sits south of that line. Same work, same country, different result.',
      },
      { type: 'h2', text: '417 vs 462 at a glance' },
      {
        type: 'table',
        headers: ['', 'Subclass 417', 'Subclass 462'],
        rows: [
          ['Type', 'Working Holiday', 'Work and Holiday'],
          ['Example passports', 'UK, Ireland, Germany, France, Canada', 'USA, China, Spain, Argentina, Vietnam'],
          ['Education / English test', '✗', '✓'],
          ['Days for 2nd year', '88 days', '88 days'],
          ['Where the work counts', 'Regional Australia', 'Mostly Northern Australia'],
          ['Second year without specified work', 'UK only (from Jul 2024)', '✗'],
        ],
      },
      { type: 'h2', text: 'How to check a job before you take it' },
      {
        type: 'ul',
        items: [
          'Confirm the **job category** is on the current specified-work list for *your* subclass.',
          'Check the workplace **postcode** against the eligible list — and remember 462 holders mostly need to be north of the Tropic of Capricorn.',
          'Ask the employer up front if they can provide **payslips** and sign a **Form 1263** — no evidence, no days.',
        ],
      },
      {
        type: 'note',
        text: '**Pro tip:** confirm the postcode *before* you accept the job, not after. Backpackers lose whole seasons working hard in the wrong town. One check on the Home Affairs site saves three months.',
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'Do the 417 and 462 have the same eligible postcodes?',
            a: 'No. The 417 counts specified work across regional Australia. The 462 mostly requires work in Northern Australia (north of the Tropic of Capricorn), with some industries tied to specific regions. Always check the list for your exact subclass.',
          },
          {
            q: 'How many days do I actually need?',
            a: '88 days (about 3 months) of specified work for a second year, and 6 months for a third year. Days are counted from your hours, so part-time work stretches over more calendar days.',
          },
          {
            q: 'Does hospitality work count?',
            a: 'Only in specific cases — mainly tourism and hospitality in eligible northern, remote or very remote areas, which is largely a 462 pathway. Hospitality in a capital city never counts.',
          },
          {
            q: 'Does the work have to be paid?',
            a: 'Yes — it must be paid at the correct award rate. Working for accommodation instead of wages does not count, and underpayment can invalidate your days. Declared natural-disaster volunteer work is the main exception.',
          },
          {
            q: 'What evidence do I need to keep?',
            a: 'Payslips, your employer\'s ABN, and a signed Form 1263. Keep a personal log of every shift, date and postcode too — if Home Affairs queries a claim, the burden of proof is on you.',
          },
        ],
      },
      {
        type: 'cta',
        text: 'Log every qualifying shift with its date and platform, and watch your 88-day total build automatically — evidence ready if you are ever asked.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'sources',
        title: 'Sources',
        items: [
          { label: 'Department of Home Affairs — Specified work for the Working Holiday visa (subclass 417)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417/specified-subclass-417-work' },
          { label: 'Department of Home Affairs — Specified work for the Work and Holiday visa (subclass 462)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462/specified-462-work' },
          { label: 'Eligible regional postcodes by state and territory', url: 'https://www.australia-backpackersguide.com/eligible-areas-second-year-visa-australia/' },
        ],
      },
      {
        type: 'note',
        text: 'Categories, regions and postcodes change. Always confirm the current lists for your visa subclass at immi.homeaffairs.gov.au before starting work.',
      },
    ],
    related: ['track-88-days-working-holiday-visa', 'working-holiday-visa-evidence-payslips', 'subclass-417-vs-462-working-holiday'],
    translations: {
      es: {
        title: 'Trabajo especificado y códigos postales elegibles para tu visa de segundo año (417 y 462)',
        description:
          'No todo el trabajo cuenta para tus 88 días, y un código postal equivocado significa cero progreso — y las reglas son distintas para la 417 y la 462. Acá tenés qué califica, dónde cuenta según cada visa y cómo chequear un trabajo antes de aceptarlo.',
        content: [
          { type: 'p', text: 'Podés trabajar 88 días seguidos y aun así que te rechacen el segundo año — si el **tipo de trabajo** o el **código postal** no cuentan. Tienen que cumplirse dos cosas al mismo tiempo: el trabajo tiene que ser una categoría elegible de **trabajo especificado**, y tiene que estar en una **zona** elegible. Si te equivocás en cualquiera de las dos, esos días valen cero.' },
          { type: 'p', text: 'Y acá está lo que la mayoría de las guías se saltea: las reglas **no son iguales para las dos visas de working holiday**. La subclase 417 y la subclase 462 cuentan el trabajo en lugares distintos. Antes que nada, necesitás saber cuál tenés.' },
          { type: 'h2', text: 'Primero: ¿417 o 462?' },
          { type: 'p', text: 'La **417 (Working Holiday)** es para pasaportes como Reino Unido, Irlanda, Alemania, Francia, Canadá, Italia, Japón y Corea. La **462 (Work and Holiday)** es para países como EE.UU., China, España, Argentina, Indonesia y Vietnam, y suma requisitos de educación e inglés. En el papel se ven idénticas — pero para tu segundo año, dónde cuentan tus 88 días es diferente. Usá el selector de abajo.' },
          { type: 'embed', component: 'auRegionExplorer' },
          { type: 'h2', text: 'Qué cuenta como trabajo especificado' },
          { type: 'ul', items: [
            'Cultivo de plantas y animales — cosecha de fruta, recolección, poda, plantación, esquila, tambo y trabajo de campo en general.',
            'Pesca y perlería.',
            'Silvicultura y tala de árboles.',
            'Minería.',
            'Construcción.',
            'Trabajo de recuperación tras incendios, inundaciones y desastres naturales.',
            'Turismo y hostelería — pero solo en zonas elegibles del norte, remotas o muy remotas (esto es principalmente una vía de la 462).',
          ] },
          { type: 'h2', text: 'Qué normalmente NO cuenta' },
          { type: 'p', text: 'Hostelería o retail en una **ciudad grande**, trabajo de oficina/administrativo, roles de au pair o domésticos, y "voluntariado" no pago a cambio de alojamiento normalmente no califican. Ejemplo: ser camarera en el centro de Sídney = no. El mismo trabajo en un pueblo elegible del norte con una 462 = potencialmente sí. El puesto solo nunca te lo dice — lo definen la **categoría más la ubicación más tu visa**.' },
          { type: 'h2', text: 'Por qué la 462 hace tropezar a tanta gente' },
          { type: 'p', text: 'Con una 417, el trabajo especificado cuenta en toda la **Australia regional** — estados enteros (NT, SA, Tasmania) o todo lo que esté fuera de las grandes ciudades. Con una 462, la mayoría del trabajo especificado tiene que hacerse en el **Norte de Australia: al norte del Trópico de Capricornio** — pensá en Cairns, Townsville, Darwin, Katherine, Broome y Mount Isa. Un trabajo de granja que le da el segundo año a alguien con una 417 puede no darle nada a alguien con una 462 si está al sur de esa línea. Mismo trabajo, mismo país, resultado distinto.' },
          { type: 'h2', text: '417 vs 462 de un vistazo' },
          { type: 'table', headers: ['', 'Subclase 417', 'Subclase 462'], rows: [
            ['Tipo', 'Working Holiday', 'Work and Holiday'],
            ['Pasaportes de ejemplo', 'Reino Unido, Irlanda, Alemania, Francia, Canadá', 'EE.UU., China, España, Argentina, Vietnam'],
            ['Examen de educación / inglés', '✗', '✓'],
            ['Días para el 2º año', '88 días', '88 días'],
            ['Dónde cuenta el trabajo', 'Australia regional', 'Mayormente Norte de Australia'],
            ['Segundo año sin trabajo especificado', 'Solo Reino Unido (desde jul. 2024)', '✗'],
          ] },
          { type: 'h2', text: 'Cómo chequear un trabajo antes de aceptarlo' },
          { type: 'ul', items: [
            'Confirmá que la **categoría del trabajo** esté en la lista vigente de trabajo especificado de *tu* subclase.',
            'Chequeá el **código postal** del lugar contra la lista de elegibles — y acordate que los de la 462 mayormente deben estar al norte del Trópico de Capricornio.',
            'Preguntale al empleador de entrada si puede darte **payslips** y firmar un **Form 1263** — sin evidencia, no hay días.',
          ] },
          { type: 'note', text: '**Pro tip:** confirmá el código postal *antes* de aceptar el trabajo, no después. Muchos backpackers pierden temporadas enteras laburando duro en el pueblo equivocado. Un chequeo en el sitio de Home Affairs te ahorra tres meses.' },
          { type: 'h2', text: 'Preguntas frecuentes' },
          { type: 'faq', items: [
            { q: '¿La 417 y la 462 tienen los mismos códigos postales elegibles?', a: 'No. La 417 cuenta el trabajo especificado en toda la Australia regional. La 462 mayormente requiere trabajo en el Norte de Australia (al norte del Trópico de Capricornio), con algunas industrias atadas a regiones específicas. Chequeá siempre la lista de tu subclase exacta.' },
            { q: '¿Cuántos días necesito realmente?', a: '88 días (unos 3 meses) de trabajo especificado para un segundo año, y 6 meses para un tercero. Los días se cuentan según tus horas, así que el trabajo part-time se estira sobre más días de calendario.' },
            { q: '¿La hostelería cuenta?', a: 'Solo en casos específicos — principalmente turismo y hostelería en zonas elegibles del norte, remotas o muy remotas, que es mayormente una vía de la 462. La hostelería en una ciudad capital nunca cuenta.' },
            { q: '¿El trabajo tiene que ser pago?', a: 'Sí — tiene que pagarse según la tarifa (award) correcta. Trabajar a cambio de alojamiento en lugar de sueldo no cuenta, y el pago por debajo del mínimo puede invalidar tus días. El voluntariado en desastres naturales declarados es la excepción principal.' },
            { q: '¿Qué evidencia tengo que guardar?', a: 'Payslips, el ABN del empleador y un Form 1263 firmado. Guardá también un registro personal de cada turno, fecha y código postal — si Home Affairs cuestiona un reclamo, la carga de la prueba es tuya.' },
          ] },
          { type: 'cta', text: 'Registrá cada turno que califica con su fecha y plataforma, y mirá cómo se arma tu total de 88 días automáticamente — con la evidencia lista por si alguna vez te la piden.', label: 'Empezá gratis', to: '/register' },
          { type: 'sources', title: 'Fuentes', items: [
            { label: 'Department of Home Affairs — Trabajo especificado para la Working Holiday visa (subclase 417)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417/specified-subclass-417-work' },
            { label: 'Department of Home Affairs — Trabajo especificado para la Work and Holiday visa (subclase 462)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462/specified-462-work' },
            { label: 'Códigos postales regionales elegibles por estado y territorio', url: 'https://www.australia-backpackersguide.com/eligible-areas-second-year-visa-australia/' },
          ] },
          { type: 'note', text: 'Las categorías, regiones y códigos postales cambian. Confirmá siempre las listas vigentes para tu subclase de visa en immi.homeaffairs.gov.au antes de empezar a trabajar.' },
        ],
      },
      fr: {
        title: 'Travail spécifié et codes postaux éligibles pour ton visa de deuxième année (417 et 462)',
        description:
          "Tout le travail ne compte pas pour tes 88 jours, et un mauvais code postal signifie zéro progression — et les règles diffèrent entre le 417 et le 462. Voici ce qui compte, où ça compte pour chaque visa et comment vérifier un emploi avant de l'accepter.",
        content: [
          { type: 'p', text: "Tu peux travailler 88 jours d'affilée et te faire quand même refuser une deuxième année — si le **type d'emploi** ou le **code postal** ne comptent pas. Deux conditions doivent être réunies en même temps : le travail doit relever d'une catégorie éligible de **travail spécifié**, et se situer dans une **zone** éligible. Si l'un des deux est faux, ces jours valent zéro." },
          { type: 'p', text: "Et voici ce que la plupart des guides oublient : les règles **ne sont pas les mêmes pour les deux visas working holiday**. La sous-classe 417 et la sous-classe 462 comptent le travail à des endroits différents. Avant tout, tu dois savoir lequel tu détiens." },
          { type: 'h2', text: 'D’abord : 417 ou 462 ?' },
          { type: 'p', text: "Le **417 (Working Holiday)** est pour les passeports comme le Royaume-Uni, l'Irlande, l'Allemagne, la France, le Canada, l'Italie, le Japon et la Corée. Le **462 (Work and Holiday)** est pour des pays comme les États-Unis, la Chine, l'Espagne, l'Argentine, l'Indonésie et le Vietnam, et il ajoute des conditions d'études et d'anglais. Sur le papier ils semblent identiques — mais pour ta deuxième année, l'endroit où comptent tes 88 jours diffère. Utilise le sélecteur ci-dessous." },
          { type: 'embed', component: 'auRegionExplorer' },
          { type: 'h2', text: 'Ce qui compte comme travail spécifié' },
          { type: 'ul', items: [
            'Culture de plantes et d’animaux — cueillette de fruits, récolte, taille, plantation, tonte, laiterie et travail agricole en général.',
            'Pêche et perliculture.',
            'Sylviculture et abattage d’arbres.',
            'Exploitation minière.',
            'Construction.',
            'Travaux de reconstruction après incendies, inondations et catastrophes naturelles.',
            "Tourisme et hôtellerie — mais seulement dans les zones éligibles du nord, isolées ou très isolées (c'est surtout une voie du 462).",
          ] },
          { type: 'h2', text: 'Ce qui ne compte généralement PAS' },
          { type: 'p', text: "L'hôtellerie ou le commerce de détail dans une **grande ville**, le travail de bureau/administratif, les rôles d'au pair ou domestiques, et le « bénévolat » non rémunéré contre logement ne sont généralement pas éligibles. Exemple : serveuse dans le centre de Sydney = non. Le même poste dans une ville éligible du nord avec un 462 = potentiellement oui. L'intitulé seul ne te dit jamais rien — c'est la **catégorie plus le lieu plus ton visa** qui décident." },
          { type: 'h2', text: 'Pourquoi le 462 fait trébucher tant de monde' },
          { type: 'p', text: "Avec un 417, le travail spécifié compte dans toute l'**Australie régionale** — des États entiers (NT, SA, Tasmanie) ou tout ce qui est hors des grandes villes. Avec un 462, la majorité du travail spécifié doit être fait en **Australie du Nord : au nord du Tropique du Capricorne** — pense à Cairns, Townsville, Darwin, Katherine, Broome et Mount Isa. Un emploi agricole qui donne sa deuxième année à un détenteur de 417 peut ne rien rapporter à un détenteur de 462 s'il se situe au sud de cette ligne. Même travail, même pays, résultat différent." },
          { type: 'h2', text: '417 vs 462 en un coup d’œil' },
          { type: 'table', headers: ['', 'Sous-classe 417', 'Sous-classe 462'], rows: [
            ['Type', 'Working Holiday', 'Work and Holiday'],
            ['Passeports exemples', 'Royaume-Uni, Irlande, Allemagne, France, Canada', 'États-Unis, Chine, Espagne, Argentine, Vietnam'],
            ['Test études / anglais', '✗', '✓'],
            ['Jours pour la 2e année', '88 jours', '88 jours'],
            ['Où le travail compte', 'Australie régionale', 'Surtout Australie du Nord'],
            ['Deuxième année sans travail spécifié', 'Royaume-Uni seulement (depuis juil. 2024)', '✗'],
          ] },
          { type: 'h2', text: 'Comment vérifier un emploi avant de l’accepter' },
          { type: 'ul', items: [
            'Confirme que la **catégorie d’emploi** figure sur la liste actuelle de travail spécifié de *ta* sous-classe.',
            'Vérifie le **code postal** du lieu dans la liste des éligibles — et rappelle-toi que les détenteurs de 462 doivent surtout être au nord du Tropique du Capricorne.',
            'Demande à l’employeur d’emblée s’il peut fournir des **fiches de paie** et signer un **Form 1263** — pas de preuve, pas de jours.',
          ] },
          { type: 'note', text: "**Astuce de pro :** confirme le code postal *avant* d'accepter l'emploi, pas après. Des backpackers perdent des saisons entières à travailler dur dans la mauvaise ville. Une vérification sur le site de Home Affairs t'économise trois mois." },
          { type: 'h2', text: 'Questions fréquentes' },
          { type: 'faq', items: [
            { q: 'Le 417 et le 462 ont-ils les mêmes codes postaux éligibles ?', a: "Non. Le 417 compte le travail spécifié dans toute l'Australie régionale. Le 462 exige surtout un travail en Australie du Nord (au nord du Tropique du Capricorne), avec certaines industries liées à des régions précises. Vérifie toujours la liste de ta sous-classe exacte." },
            { q: 'Combien de jours me faut-il vraiment ?', a: '88 jours (environ 3 mois) de travail spécifié pour une deuxième année, et 6 mois pour une troisième. Les jours se comptent selon tes heures, donc le temps partiel s’étale sur davantage de jours calendaires.' },
            { q: "L'hôtellerie compte-t-elle ?", a: "Seulement dans des cas précis — surtout le tourisme et l'hôtellerie dans des zones éligibles du nord, isolées ou très isolées, ce qui est surtout une voie du 462. L'hôtellerie dans une capitale ne compte jamais." },
            { q: 'Le travail doit-il être rémunéré ?', a: "Oui — il doit être payé au tarif (award) correct. Travailler contre logement au lieu d'un salaire ne compte pas, et un sous-paiement peut invalider tes jours. Le bénévolat lors de catastrophes naturelles déclarées est la principale exception." },
            { q: 'Quelles preuves dois-je conserver ?', a: "Fiches de paie, l'ABN de l'employeur et un Form 1263 signé. Garde aussi un relevé personnel de chaque quart, date et code postal — si Home Affairs conteste une demande, la charge de la preuve te revient." },
          ] },
          { type: 'cta', text: "Enregistre chaque quart éligible avec sa date et sa plateforme, et regarde ton total de 88 jours se construire automatiquement — preuves prêtes si on te les demande un jour.", label: 'Commence gratuitement', to: '/register' },
          { type: 'sources', title: 'Sources', items: [
            { label: 'Department of Home Affairs — Travail spécifié pour le Working Holiday visa (sous-classe 417)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417/specified-subclass-417-work' },
            { label: 'Department of Home Affairs — Travail spécifié pour le Work and Holiday visa (sous-classe 462)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462/specified-462-work' },
            { label: 'Codes postaux régionaux éligibles par État et territoire', url: 'https://www.australia-backpackersguide.com/eligible-areas-second-year-visa-australia/' },
          ] },
          { type: 'note', text: 'Les catégories, régions et codes postaux changent. Confirme toujours les listes à jour pour ta sous-classe de visa sur immi.homeaffairs.gov.au avant de commencer à travailler.' },
        ],
      },
    },
  },

  {
    slug: 'subclass-417-vs-462-working-holiday',
    title: 'Subclass 417 vs 462 Working Holiday: Which One Are You, and What Changes',
    description:
      'They look like the same visa online, but the 417 and the 462 come from different legal agreements with different rules — caps, ballots, English tests, and which passport gets which. Here is what actually changes.',
    date: '2026-08-20',
    updated: '2026-11-11',
    readingTime: 8,
    tag: 'Working Holiday Visa',
    accent: '#8B5CF6',
    content: [
      {
        type: 'p',
        text: "\"Working holiday visa\" is the name everyone uses, but Australia actually runs **two separate visas** under that banner — subclass **417** and subclass **462**. Which one you get is decided entirely by your **passport**, not by choice, and the two come with different rules: one is uncapped, the other has annual per-country quotas that can pause mid-year. If you have only ever seen the name \"working holiday visa,\" here is what is actually going on underneath it.",
      },
      { type: 'h2', text: "It's your passport that decides, not you" },
      {
        type: 'p',
        text: 'The 417 exists because Australia has a **reciprocal Working Holiday Agreement** with certain countries — their young citizens can work-holiday in Australia, and Australians can do the same there. The 462 exists for countries **without** that two-way agreement; Australia grants it unilaterally, under a **Work and Holiday arrangement**, usually with extra conditions attached. You cannot pick between them — your citizenship determines which one you are eligible for. The one exception: if you hold **two passports** that each qualify for a different subclass, you can choose which one to apply under.',
      },
      { type: 'h2', text: 'The 417 — Working Holiday visa' },
      {
        type: 'ul',
        items: [
          'Reciprocal partner countries — examples: the United Kingdom, Ireland, Canada, Germany, France, Italy, Japan, South Korea, the Netherlands, Belgium, Sweden, Taiwan and Hong Kong.',
          'No cap on the first visa: you apply whenever you want, no waiting for places to free up.',
          'No education or English-language test required.',
          'Ages 18 to 30 for most passports, up to 35 for some (Canada, France, Ireland and the UK among them). Since 1 July 2026, Germany, Finland, Cyprus and South Korea also go up to 35.',
        ],
      },
      { type: 'h2', text: 'The 462 — Work and Holiday visa' },
      {
        type: 'ul',
        items: [
          'Non-reciprocal countries — examples: the United States, Argentina, China, Spain, Brazil, Vietnam, Thailand, Poland and Chile.',
          'Most countries have an **annual grant cap** — a fixed number of visas per program year (1 July – 30 June). Once a country hits its cap, applications for that country are **paused** until the next program year.',
          'A few high-demand countries (China, India and Vietnam, with Indonesia joining) use a **ballot** for the first visa: you register, get drawn at random, and only then can you apply.',
          'New in the 2026–27 program year: Uruguay joined with up to 1,500 first visas a year.',
          'Requires at least two years of tertiary study and **functional English**, with some exceptions by country.',
        ],
      },
      { type: 'h2', text: '417 vs 462 at a glance' },
      {
        type: 'table',
        headers: ['', 'Subclass 417', 'Subclass 462'],
        rows: [
          ['Basis', 'Reciprocal agreement', 'Unilateral arrangement'],
          ['Example passports', 'UK, Ireland, Germany, France, Canada', 'USA, China, Spain, Argentina, Vietnam'],
          ['Annual cap on the first visa', 'None', 'Yes, can pause mid-year'],
          ['Ballot for the first visa', 'No', 'Only some high-demand countries'],
          ['Ballot for 2nd/3rd year', 'Announced, not law yet', 'Announced, not law yet'],
          ['Education / English test', '✗', '✓'],
          ['Days for 2nd year', '88 days specified work', '88 days specified work'],
          ['2nd/3rd year without specified work', 'UK passports only (from Jul 2024)', '✗'],
        ],
      },
      { type: 'h2', text: "Why some 462 countries show as \"paused\"" },
      {
        type: 'p',
        text: "462 caps reset every **1 July** (the start of the program year). Popular nationalities can fill their quota well before the year ends, and Home Affairs pauses new applications for that country until the reset — it is not a ban, just a queue for next year's allocation. Because this changes throughout the year, always check the **live status** for your specific country rather than relying on anything you read months ago.",
      },
      {
        type: 'note',
        text: "The 417 and the 462 use **different specified-work rules** for your second and third year too — the 417 counts work across regional Australia broadly, while the 462 is mostly limited to Northern Australia. See our full breakdown in [Specified Work & Eligible Postcodes for Your Second-Year Visa](/blog/specified-work-eligible-postcodes-australia) once you know which subclass you hold.",
      },
      { type: 'h2', text: 'What changed in 2026' },
      {
        type: 'p',
        text: "Until now the big difference was simple: the 417 had no cap, the 462 did. That's shifting. In September 2026 the government announced that **second and third visas, for both subclasses**, will go to a ballot with a yearly cap: 45,000 places for year two and 5,000 for year three. Last year about 57,000 people qualified for a second year and 31,000 for a third, so not everyone who does their days will get through.",
      },
      {
        type: 'p',
        text: "It needs legislation that hasn't passed yet, and there's no start date. Today you still apply the normal way. Your 88 days (or 6 months for a third year) still count: they're what gets you into the ballot in the first place. We keep the details in [The Second and Third Year Ballot: What Backpackers Need to Know](/blog/working-holiday-visa-ballot-second-third-year).",
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'How do I know if I have a 417 or a 462?',
            a: "It is printed on your visa grant notice, but the short version: reciprocal-agreement countries (UK, Ireland, Canada, most of the EU, Japan, Korea, Taiwan, Hong Kong) get a 417; most other eligible countries (including the USA, China, most of Latin America and Southeast Asia) get a 462. Check the official eligible-countries list if you are unsure.",
          },
          {
            q: 'Can I switch from a 462 to a 417?',
            a: 'No — the subclass is tied to your passport/citizenship, not a preference you select on the application. The only way to change it is to apply using a different eligible passport, if you hold one.',
          },
          {
            q: "What does \"paused\" actually mean for my country?",
            a: "The annual grant cap for that country has been reached for the current program year (1 July – 30 June). Applications reopen at the next reset, not on a fixed date within the year — check the official status page for updates.",
          },
          {
            q: 'Do 417 holders ever need a ballot?',
            a: "Not for the first visa. But the reform announced in September 2026 puts second and third visas on a ballot for 417 and 462 alike. It isn't in force yet, so for now 417 holders apply as usual.",
          },
          {
            q: 'Does the 462 English/education requirement apply to everyone?',
            a: 'It applies to most 462 countries, but the exact conditions (functional English, competent English, or an exemption) vary by country. Always check the requirements listed for your specific passport.',
          },
        ],
      },
      {
        type: 'cta',
        text: 'Whichever subclass you hold, track your specified-work days automatically from your real shifts — no spreadsheets, no guesswork.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'sources',
        title: 'Sources',
        items: [
          { label: 'Department of Home Affairs — Working Holiday visa (subclass 417)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417' },
          { label: 'Department of Home Affairs — Work and Holiday visa (subclass 462)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462' },
          { label: 'Department of Home Affairs — Live status of country caps (subclass 462)', url: 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps' },
        ],
      },
      {
        type: 'note',
        text: 'Eligible countries, caps and requirements change. Always confirm your exact situation on immi.homeaffairs.gov.au before making plans around it.',
      },
    ],
    related: ['specified-work-eligible-postcodes-australia', 'track-88-days-working-holiday-visa', 'second-third-working-holiday-visa-application-guide'],
    translations: {
      es: {
        title: 'Subclase 417 vs 462 Working Holiday: cuál sos y qué cambia',
        description:
          'Parecen la misma visa, pero la 417 y la 462 vienen de acuerdos legales distintos con reglas distintas — cupos, sorteos, examen de inglés, y qué pasaporte recibe cuál. Esto es lo que realmente cambia.',
        content: [
          { type: 'p', text: '"Working holiday visa" es el nombre que usa todo el mundo, pero Australia en realidad tiene **dos visas separadas** bajo ese nombre — la subclase **417** y la subclase **462**. Cuál te toca lo decide enteramente tu **pasaporte**, no una elección tuya, y las dos tienen reglas distintas: una no tiene cupo, la otra tiene cupos anuales por país que pueden pausarse a mitad de año. Si solo conocías el nombre genérico "working holiday visa", esto es lo que hay realmente detrás.' },
          { type: 'h2', text: 'Lo decide tu pasaporte, no vos' },
          { type: 'p', text: 'La 417 existe porque Australia tiene un **acuerdo recíproco de Working Holiday** con ciertos países — sus jóvenes pueden hacer working holiday en Australia, y los australianos pueden hacer lo mismo allá. La 462 existe para países **sin** ese acuerdo bidireccional; Australia la otorga de forma unilateral, bajo un **arreglo de Work and Holiday**, generalmente con condiciones extra. No podés elegir entre las dos — tu ciudadanía determina para cuál calificás. La única excepción: si tenés **dos pasaportes** que califican cada uno para una subclase distinta, podés elegir con cuál aplicar.' },
          { type: 'h2', text: 'La 417 — visa Working Holiday' },
          { type: 'ul', items: [
            'Países con acuerdo recíproco — ejemplos: Reino Unido, Irlanda, Canadá, Alemania, Francia, Italia, Japón, Corea del Sur, Países Bajos, Bélgica, Suecia, Taiwán y Hong Kong.',
            'Sin cupo para la primera visa: aplicás cuando quieras, sin esperar que se liberen lugares.',
            'No requiere examen de educación ni de inglés.',
            'Entre 18 y 30 años para la mayoría de los pasaportes, hasta 35 para algunos (entre ellos Canadá, Francia, Irlanda y Reino Unido). Desde el 1 de julio de 2026, Alemania, Finlandia, Chipre y Corea del Sur también llegan a 35.',
          ] },
          { type: 'h2', text: 'La 462 — visa Work and Holiday' },
          { type: 'ul', items: [
            'Países sin acuerdo recíproco — ejemplos: Estados Unidos, Argentina, China, España, Brasil, Vietnam, Tailandia, Polonia y Chile.',
            'La mayoría de los países tiene un **cupo anual de otorgamiento** — un número fijo de visas por año de programa (1 de julio – 30 de junio). Cuando un país llega a su cupo, las solicitudes para ese país quedan **pausadas** hasta el próximo año de programa.',
            'Algunos países con mucha demanda (China, India y Vietnam, y se suma Indonesia) usan un **sorteo** para la primera visa: te anotás, sale tu nombre al azar y recién ahí podés aplicar.',
            'Nuevo en el año de programa 2026-27: se sumó Uruguay, con hasta 1.500 primeras visas por año.',
            'Requiere al menos dos años de estudios terciarios e **inglés funcional**, con algunas excepciones según el país.',
          ] },
          { type: 'h2', text: '417 vs 462 de un vistazo' },
          { type: 'table', headers: ['', 'Subclase 417', 'Subclase 462'], rows: [
            ['Base', 'Acuerdo recíproco', 'Arreglo unilateral'],
            ['Pasaportes ejemplo', 'UK, Irlanda, Alemania, Francia, Canadá', 'EE.UU., China, España, Argentina, Vietnam'],
            ['Cupo anual en la primera visa', 'No tiene', 'Sí, puede pausarse a mitad de año'],
            ['Sorteo para la primera visa', 'No', 'Solo algunos países con mucha demanda'],
            ['Sorteo para 2º/3er año', 'Anunciado, todavía no es ley', 'Anunciado, todavía no es ley'],
            ['Examen de educación / inglés', '✗', '✓'],
            ['Días para 2do año', '88 días de trabajo especificado', '88 días de trabajo especificado'],
            ['2do/3er año sin trabajo especificado', 'Solo pasaportes UK (desde jul. 2024)', '✗'],
          ] },
          { type: 'h2', text: 'Por qué algunos países en la 462 aparecen "pausados"' },
          { type: 'p', text: 'Los cupos de la 462 se reinician cada **1 de julio** (inicio del año de programa). Las nacionalidades más populares pueden completar su cupo bien antes de que termine el año, y Home Affairs pausa las nuevas solicitudes de ese país hasta el reinicio — no es una prohibición, es una cola para la asignación del año siguiente. Como esto cambia durante el año, confirmá siempre el **estado en vivo** de tu país en particular en vez de confiar en algo que leíste hace meses.' },
          { type: 'note', text: 'La 417 y la 462 también usan **reglas de trabajo especificado distintas** para tu segundo y tercer año — la 417 cuenta trabajo en toda la Australia regional de forma amplia, mientras que la 462 está mayormente limitada al Norte de Australia. Mirá el desglose completo en [Trabajo especificado y códigos postales elegibles para tu visa de segundo año](/blog/specified-work-eligible-postcodes-australia) una vez que sepas qué subclase tenés.' },
          { type: 'h2', text: 'Qué cambió en 2026' },
          { type: 'p', text: 'Hasta ahora la diferencia grande era simple: la 417 no tenía cupo y la 462 sí. Eso está cambiando. En septiembre de 2026 el gobierno anunció que **la segunda y la tercera visa, de las dos subclases**, van a pasar a un sorteo con cupo anual: 45.000 lugares para el segundo año y 5.000 para el tercero. El año pasado calificaron unas 57.000 personas para el segundo y 31.000 para el tercero, así que no todos los que hagan sus días van a entrar.' },
          { type: 'p', text: 'Hace falta una ley que todavía no se aprobó, y no hay fecha de inicio. Hoy se sigue aplicando de la forma normal. Tus 88 días (o los 6 meses del tercer año) siguen contando: son lo que te permite entrar al sorteo. Tenemos todo el detalle en [El sorteo del segundo y tercer año: lo que tenés que saber](/es/blog/working-holiday-visa-ballot-second-third-year).' },
          { type: 'h2', text: 'Preguntas frecuentes' },
          { type: 'faq', items: [
            { q: '¿Cómo sé si tengo una 417 o una 462?', a: 'Está impreso en tu notificación de otorgamiento de visa, pero en resumen: los países con acuerdo recíproco (UK, Irlanda, Canadá, la mayoría de la UE, Japón, Corea, Taiwán, Hong Kong) reciben una 417; la mayoría de los otros países elegibles (incluyendo EE.UU., China, gran parte de Latinoamérica y el sudeste asiático) reciben una 462. Revisá la lista oficial de países elegibles si tenés dudas.' },
            { q: '¿Puedo cambiar de una 462 a una 417?', a: 'No — la subclase está atada a tu pasaporte/ciudadanía, no es una preferencia que elegís en la solicitud. La única forma de cambiarla es aplicar con un pasaporte elegible distinto, si tenés uno.' },
            { q: '¿Qué significa realmente "pausado" para mi país?', a: 'Que el cupo anual de otorgamiento de ese país se completó para el año de programa actual (1 de julio – 30 de junio). Las solicitudes reabren en el próximo reinicio, no en una fecha fija dentro del año — revisá la página oficial de estado para actualizaciones.' },
            { q: '¿Los titulares de 417 alguna vez necesitan sorteo?', a: 'Para la primera visa, no. Pero la reforma anunciada en septiembre de 2026 pone la segunda y la tercera visa en sorteo, tanto para la 417 como para la 462. Todavía no está vigente, así que por ahora los titulares de 417 aplican como siempre.' },
            { q: '¿El requisito de inglés/educación de la 462 aplica a todos?', a: 'Aplica a la mayoría de los países de la 462, pero las condiciones exactas (inglés funcional, inglés competente, o una excepción) varían según el país. Revisá siempre los requisitos listados para tu pasaporte específico.' },
          ] },
          { type: 'cta', text: 'Sea cual sea tu subclase, registrá tus días de trabajo especificado automáticamente desde tus turnos reales — sin planillas, sin adivinar.', label: 'Empezá gratis', to: '/register' },
          { type: 'sources', title: 'Fuentes', items: [
            { label: 'Department of Home Affairs — Working Holiday visa (subclase 417)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417' },
            { label: 'Department of Home Affairs — Work and Holiday visa (subclase 462)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462' },
            { label: 'Department of Home Affairs — Estado en vivo de los cupos por país (subclase 462)', url: 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps' },
          ] },
          { type: 'note', text: 'Los países elegibles, cupos y requisitos cambian. Confirmá siempre tu situación exacta en immi.homeaffairs.gov.au antes de hacer planes basados en esto.' },
        ],
      },
      fr: {
        title: 'Sous-classe 417 vs 462 Working Holiday : laquelle es-tu, et ce qui change',
        description:
          "Elles ressemblent au même visa, mais le 417 et le 462 viennent d'accords légaux différents avec des règles différentes — quotas, tirages au sort, test d'anglais, et quel passeport reçoit lequel. Voici ce qui change vraiment.",
        content: [
          { type: 'p', text: '« Working holiday visa » est le nom que tout le monde utilise, mais l\'Australie gère en réalité **deux visas distincts** sous ce nom — la sous-classe **417** et la sous-classe **462**. Lequel tu obtiens est décidé entièrement par ton **passeport**, pas par un choix, et les deux ont des règles différentes : l\'un n\'a pas de quota, l\'autre a des quotas annuels par pays qui peuvent être mis en pause en cours d\'année. Si tu ne connaissais que le nom générique « working holiday visa », voici ce qu\'il y a vraiment derrière.' },
          { type: 'h2', text: "C'est ton passeport qui décide, pas toi" },
          { type: 'p', text: "Le 417 existe parce que l'Australie a un **accord réciproque de Working Holiday** avec certains pays — leurs jeunes peuvent faire un working holiday en Australie, et les Australiens peuvent faire de même chez eux. Le 462 existe pour les pays **sans** cet accord bidirectionnel ; l'Australie l'accorde unilatéralement, dans le cadre d'un **arrangement Work and Holiday**, généralement avec des conditions supplémentaires. Tu ne peux pas choisir entre les deux — ta citoyenneté détermine celui pour lequel tu es éligible. La seule exception : si tu as **deux passeports** qui sont chacun éligibles à une sous-classe différente, tu peux choisir sous lequel postuler." },
          { type: 'h2', text: 'Le 417 — visa Working Holiday' },
          { type: 'ul', items: [
            'Pays partenaires réciproques — exemples : Royaume-Uni, Irlande, Canada, Allemagne, France, Italie, Japon, Corée du Sud, Pays-Bas, Belgique, Suède, Taïwan et Hong Kong.',
            "Pas de quota pour le premier visa : tu postules quand tu veux, sans attendre que des places se libèrent.",
            "Aucun test d'éducation ou d'anglais requis.",
            "18 à 30 ans pour la plupart des passeports, jusqu'à 35 ans pour certains (dont le Canada, la France, l'Irlande et le Royaume-Uni). Depuis le 1er juillet 2026, l'Allemagne, la Finlande, Chypre et la Corée du Sud passent aussi à 35 ans.",
          ] },
          { type: 'h2', text: 'Le 462 — visa Work and Holiday' },
          { type: 'ul', items: [
            'Pays sans accord réciproque — exemples : États-Unis, Argentine, Chine, Espagne, Brésil, Vietnam, Thaïlande, Pologne et Chili.',
            "La plupart des pays ont un **quota annuel d'attribution** — un nombre fixe de visas par année de programme (1er juillet – 30 juin). Une fois le quota atteint pour un pays, les demandes pour ce pays sont **mises en pause** jusqu'à l'année de programme suivante.",
            "Quelques pays très demandés (la Chine, l'Inde et le Vietnam, rejoints par l'Indonésie) utilisent un **tirage au sort** pour le premier visa : tu t'inscris, tu es tiré au hasard, et seulement ensuite tu peux postuler.",
            "Nouveau pour l'année de programme 2026-27 : l'Uruguay arrive avec jusqu'à 1 500 premiers visas par an.",
            "Exige au moins deux ans d'études supérieures et un **anglais fonctionnel**, avec quelques exceptions selon le pays.",
          ] },
          { type: 'h2', text: "417 vs 462 en un coup d'œil" },
          { type: 'table', headers: ['', 'Sous-classe 417', 'Sous-classe 462'], rows: [
            ['Base', 'Accord réciproque', 'Arrangement unilatéral'],
            ['Passeports exemples', 'UK, Irlande, Allemagne, France, Canada', 'États-Unis, Chine, Espagne, Argentine, Vietnam'],
            ['Quota annuel sur le premier visa', 'Aucun', 'Oui, peut être mis en pause en cours d\'année'],
            ['Tirage au sort pour le premier visa', 'Non', 'Seulement quelques pays très demandés'],
            ['Tirage au sort pour 2e/3e année', 'Annoncé, pas encore une loi', 'Annoncé, pas encore une loi'],
            ['Test éducation / anglais', '✗', '✓'],
            ['Jours pour la 2e année', '88 jours de travail spécifié', '88 jours de travail spécifié'],
            ['2e/3e année sans travail spécifié', 'Passeports UK seulement (depuis juil. 2024)', '✗'],
          ] },
          { type: 'h2', text: 'Pourquoi certains pays du 462 apparaissent "en pause"' },
          { type: 'p', text: "Les quotas du 462 se réinitialisent chaque **1er juillet** (début de l'année de programme). Les nationalités populaires peuvent atteindre leur quota bien avant la fin de l'année, et Home Affairs met en pause les nouvelles demandes pour ce pays jusqu'à la réinitialisation — ce n'est pas une interdiction, juste une file d'attente pour l'allocation de l'année suivante. Comme cela change tout au long de l'année, vérifie toujours le **statut en direct** de ton pays plutôt que de te fier à ce que tu as lu il y a des mois." },
          { type: 'note', text: "Le 417 et le 462 utilisent aussi des **règles de travail spécifié différentes** pour ta deuxième et troisième année — le 417 compte le travail dans toute l'Australie régionale de façon large, tandis que le 462 est surtout limité à l'Australie du Nord. Voir notre analyse complète dans [Travail spécifié et codes postaux éligibles pour ton visa de deuxième année](/blog/specified-work-eligible-postcodes-australia) une fois que tu sais quelle sous-classe tu détiens." },
          { type: 'h2', text: 'Ce qui a changé en 2026' },
          { type: 'p', text: "Jusqu'ici, la grande différence était simple : le 417 n'avait pas de quota, le 462 si. Ça change. En septembre 2026, le gouvernement a annoncé que **les deuxième et troisième visas, pour les deux sous-classes**, passeront par un tirage au sort avec un quota annuel : 45 000 places pour la deuxième année et 5 000 pour la troisième. L'an dernier, environ 57 000 personnes remplissaient les conditions pour une deuxième année et 31 000 pour une troisième, donc tous ceux qui font leurs jours ne passeront pas." },
          { type: 'p', text: "Il faut une loi qui n'est pas encore votée, et il n'y a pas de date de début. Aujourd'hui, la demande se fait toujours normalement. Tes 88 jours (ou les 6 mois pour une troisième année) comptent toujours : c'est ce qui te permet de participer au tirage. Tout le détail dans [Le tirage au sort des deuxième et troisième années : ce qu'il faut savoir](/fr/blog/working-holiday-visa-ballot-second-third-year)." },
          { type: 'h2', text: 'Questions fréquentes' },
          { type: 'faq', items: [
            { q: 'Comment savoir si j\'ai un 417 ou un 462 ?', a: "C'est indiqué sur ta notification d'octroi de visa, mais en résumé : les pays avec accord réciproque (UK, Irlande, Canada, la majorité de l'UE, Japon, Corée, Taïwan, Hong Kong) reçoivent un 417 ; la plupart des autres pays éligibles (dont les États-Unis, la Chine, une grande partie de l'Amérique latine et de l'Asie du Sud-Est) reçoivent un 462. Vérifie la liste officielle des pays éligibles en cas de doute." },
            { q: 'Puis-je passer d\'un 462 à un 417 ?', a: "Non — la sous-classe est liée à ton passeport/ta citoyenneté, ce n'est pas une préférence que tu choisis sur la demande. La seule façon de la changer est de postuler avec un autre passeport éligible, si tu en as un." },
            { q: 'Que signifie vraiment "en pause" pour mon pays ?', a: "Que le quota annuel d'attribution de ce pays a été atteint pour l'année de programme en cours (1er juillet – 30 juin). Les demandes rouvrent à la prochaine réinitialisation, pas à une date fixe dans l'année — vérifie la page de statut officielle pour les mises à jour." },
            { q: 'Les titulaires du 417 ont-ils déjà besoin d\'un tirage au sort ?', a: "Pas pour le premier visa. Mais la réforme annoncée en septembre 2026 met les deuxième et troisième visas au tirage au sort, pour le 417 comme pour le 462. Elle n'est pas encore en vigueur, donc pour l'instant les titulaires du 417 font leur demande comme d'habitude." },
            { q: "L'exigence d'anglais/éducation du 462 s'applique-t-elle à tout le monde ?", a: "Elle s'applique à la plupart des pays du 462, mais les conditions exactes (anglais fonctionnel, anglais compétent, ou une exemption) varient selon le pays. Vérifie toujours les exigences listées pour ton passeport spécifique." },
          ] },
          { type: 'cta', text: 'Quelle que soit ta sous-classe, suis tes jours de travail spécifié automatiquement à partir de tes vrais quarts — sans tableurs, sans devinettes.', label: 'Commence gratuitement', to: '/register' },
          { type: 'sources', title: 'Sources', items: [
            { label: 'Department of Home Affairs — Working Holiday visa (sous-classe 417)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417' },
            { label: 'Department of Home Affairs — Work and Holiday visa (sous-classe 462)', url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462' },
            { label: 'Department of Home Affairs — Statut en direct des quotas par pays (sous-classe 462)', url: 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps' },
          ] },
          { type: 'note', text: 'Les pays éligibles, quotas et exigences changent. Confirme toujours ta situation exacte sur immi.homeaffairs.gov.au avant de faire des plans en te basant là-dessus.' },
        ],
      },
    },
  },

  {
    slug: 'working-holiday-visa-evidence-payslips',
    title: 'Evidence You Need for Your Second-Year Visa (Payslips & Form 1263)',
    description:
      'Your 88 days only count if you can prove them. Here is the full evidence checklist — payslips, Form 1263, bank records — and how to avoid the cash-in-hand trap that sinks applications.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      {
        type: 'p',
        text: "Here's a hard truth: the Department doesn't take your word for it. Your 88 days of specified work only count if you can **prove** them with documents. Plenty of backpackers do the work and then can't apply because they never collected the evidence. Don't be one of them.",
      },
      { type: 'h2', text: 'The two documents that matter most' },
      {
        type: 'p',
        text: '**Payslips** are your primary evidence — they show who you worked for, when, how many hours, and that you were paid. **Form 1263** ("Working Holiday Visa — declaration") is signed by your employer to confirm the specified work, dates and location. Together they’re the backbone of a strong application.',
      },
      { type: 'h2', text: 'Full evidence checklist' },
      {
        type: 'ul',
        items: [
          'Payslips for every week of specified work.',
          'Form 1263, completed and signed by each employer.',
          'Bank statements showing the wages landing in your account.',
          "The employer's ABN and business details.",
          'Your own record of dates, hours and location per shift.',
          'Group certificates / income statements at year end.',
        ],
      },
      { type: 'h2', text: 'The cash-in-hand trap' },
      {
        type: 'p',
        text: "If you're paid cash with no payslips, you have almost nothing to prove the work happened — and these days are the ones most likely to be rejected. If an employer offers cash with no paperwork, treat it as a red flag for your visa. At minimum, get payslips and bank deposits; a job that won't give you evidence isn't worth your 88 days.",
      },
      { type: 'h2', text: 'What a complete evidence pack looks like' },
      {
        type: 'p',
        text: 'Example: 11 weeks picking citrus near Mildura (eligible postcode), with a payslip for each week, a signed Form 1263 from the farm, bank statements matching every payment, and your own weekly log of hours. That’s an application the case officer can approve without chasing you for more — which also means a faster decision.',
      },
      {
        type: 'cta',
        text: 'Keep your payslips and shift records in one place, ready for your application.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General guidance only — confirm current evidence requirements at immi.homeaffairs.gov.au.',
      },
    ],
    related: ['track-88-days-working-holiday-visa', 'specified-work-eligible-postcodes-australia'],
    translations: {
      es: {
        title: 'La evidencia que necesitás para tu visa de segundo año (payslips y Form 1263)',
        description:
          'Tus 88 días solo cuentan si los podés probar. Acá está la checklist completa de evidencia — payslips, Form 1263, registros bancarios — y cómo evitar la trampa del pago en negro que hunde solicitudes.',
        content: [
          { type: 'p', text: 'Una verdad incómoda: el Department no te cree de palabra. Tus 88 días de trabajo especificado solo cuentan si los podés **probar** con documentos. Un montón de backpackers hacen el trabajo y después no pueden aplicar porque nunca juntaron la evidencia. No seas uno de ellos.' },
          { type: 'h2', text: 'Los dos documentos que más importan' },
          { type: 'p', text: 'Los **payslips** son tu evidencia principal — muestran para quién trabajaste, cuándo, cuántas horas y que te pagaron. El **Form 1263** ("Working Holiday Visa — declaration") lo firma tu empleador para confirmar el trabajo especificado, las fechas y la ubicación. Juntos son la columna vertebral de una solicitud sólida.' },
          { type: 'h2', text: 'Checklist completa de evidencia' },
          { type: 'ul', items: [
            'Payslips de cada semana de trabajo especificado.',
            'Form 1263, completado y firmado por cada empleador.',
            'Resúmenes bancarios que muestren los sueldos entrando a tu cuenta.',
            'El ABN y los datos del negocio del empleador.',
            'Tu propio registro de fechas, horas y ubicación por turno.',
            'Group certificates / income statements a fin de año.',
          ] },
          { type: 'h2', text: 'La trampa del pago en negro' },
          { type: 'p', text: 'Si te pagan en efectivo sin payslips, casi no tenés nada para probar que el trabajo existió — y esos días son los que más probablemente te rechacen. Si un empleador te ofrece efectivo sin papeles, tomalo como una señal de alerta para tu visa. Como mínimo, conseguí payslips y depósitos bancarios; un trabajo que no te da evidencia no vale tus 88 días.' },
          { type: 'h2', text: 'Cómo se ve un paquete de evidencia completo' },
          { type: 'p', text: 'Ejemplo: 11 semanas cosechando cítricos cerca de Mildura (código postal elegible), con un payslip por cada semana, un Form 1263 firmado por la granja, resúmenes bancarios que coinciden con cada pago y tu propio registro semanal de horas. Esa es una solicitud que el oficial puede aprobar sin perseguirte por más — lo que también significa una decisión más rápida.' },
          { type: 'cta', text: 'Tené tus payslips y registros de turnos en un solo lugar, listos para tu solicitud.', label: 'Empezá gratis', to: '/register' },
          { type: 'note', text: 'Solo orientación general — confirmá los requisitos de evidencia vigentes en immi.homeaffairs.gov.au.' },
        ],
      },
      fr: {
        title: 'Les preuves nécessaires pour ta deuxième année de visa (fiches de paie et Form 1263)',
        description:
          'Tes 88 jours ne comptent que si tu peux les prouver. Voici la checklist complète des preuves — fiches de paie, Form 1263, relevés bancaires — et comment éviter le piège du travail au noir qui coule les demandes.',
        content: [
          { type: 'p', text: "Une vérité qui dérange : le Department ne te croit pas sur parole. Tes 88 jours de travail spécifié ne comptent que si tu peux les **prouver** avec des documents. Beaucoup de backpackers font le travail puis ne peuvent pas postuler parce qu'ils n'ont jamais réuni les preuves. Ne sois pas l'un d'eux." },
          { type: 'h2', text: 'Les deux documents qui comptent le plus' },
          { type: 'p', text: 'Les **fiches de paie** sont ta preuve principale — elles montrent pour qui tu as travaillé, quand, combien d’heures et que tu as été payé. Le **Form 1263** (« Working Holiday Visa — declaration ») est signé par ton employeur pour confirmer le travail spécifié, les dates et le lieu. Ensemble, ils forment la colonne vertébrale d’une demande solide.' },
          { type: 'h2', text: 'Checklist complète des preuves' },
          { type: 'ul', items: [
            'Fiches de paie pour chaque semaine de travail spécifié.',
            'Form 1263, rempli et signé par chaque employeur.',
            'Relevés bancaires montrant les salaires arrivant sur ton compte.',
            'L’ABN et les coordonnées de l’entreprise de l’employeur.',
            'Ton propre relevé des dates, heures et lieu par quart.',
            'Group certificates / income statements en fin d’année.',
          ] },
          { type: 'h2', text: 'Le piège du travail au noir' },
          { type: 'p', text: 'Si tu es payé en espèces sans fiches de paie, tu n’as presque rien pour prouver que le travail a eu lieu — et ce sont ces jours qui risquent le plus d’être refusés. Si un employeur propose du liquide sans paperasse, considère-le comme un signal d’alerte pour ton visa. Au minimum, obtiens des fiches de paie et des dépôts bancaires ; un emploi qui ne te donne pas de preuves ne vaut pas tes 88 jours.' },
          { type: 'h2', text: 'À quoi ressemble un dossier de preuves complet' },
          { type: 'p', text: 'Exemple : 11 semaines de cueillette d’agrumes près de Mildura (code postal éligible), avec une fiche de paie pour chaque semaine, un Form 1263 signé par la ferme, des relevés bancaires correspondant à chaque paiement et ton propre relevé hebdomadaire d’heures. C’est une demande que l’agent peut approuver sans te relancer pour en avoir plus — ce qui signifie aussi une décision plus rapide.' },
          { type: 'cta', text: 'Garde tes fiches de paie et relevés de quarts au même endroit, prêts pour ta demande.', label: 'Commence gratuitement', to: '/register' },
          { type: 'note', text: 'Orientation générale uniquement — confirme les exigences de preuves en vigueur sur immi.homeaffairs.gov.au.' },
        ],
      },
    },
  },

  {
    slug: 'working-holiday-visa-mistakes',
    title: '6 Mistakes That Ruin Your Second-Year Working Holiday Visa',
    description:
      'Most second-year visa problems come down to a handful of avoidable mistakes — from miscounting days to losing evidence. Here are the six biggest, with a real example of each.',
    date: '2026-06-15',
    updated: '2026-11-18',
    readingTime: 7,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      {
        type: 'p',
        text: 'After 88 days of hard regional work, the last thing you want is a refusal over something avoidable. Almost every second-year problem traces back to one of these six mistakes — and all of them are easy to dodge if you know about them early.',
      },
      { type: 'h2', text: '1. Counting your days the wrong way' },
      {
        type: 'p',
        text: 'Two errors pull in opposite directions. A full-time week counts all **7 days**, weekend included, so counting only the shifts you did undercounts it. Part-time work counts only the days you worked, and a long shift is never two days, so an hours table that turns one 7.5-hour shift into 2 days overcounts. Example: Liam worked four 9-hour days a week and logged each week as 7 days. He was over-counting by 3 days every week.',
      },
      { type: 'h2', text: '2. Working in the wrong postcode or job type' },
      {
        type: 'p',
        text: 'Both the category and the location must qualify. Hospitality in a major city doesn’t count. Check before you start, not after.',
      },
      { type: 'h2', text: '3. No payslips (the cash-in-hand trap)' },
      {
        type: 'p',
        text: 'Cash with no paperwork means no proof. Those days are the most commonly rejected. Always get payslips and bank deposits.',
      },
      { type: 'h2', text: '4. Letting light weeks pile up' },
      {
        type: 'p',
        text: 'Part-time weeks only count the days you actually worked, so a run of light weeks can quietly add months to your 88. When you can, string together full-time weeks: each one counts all 7 days.',
      },
      { type: 'h2', text: '5. Forgetting Form 1263' },
      {
        type: 'p',
        text: 'Payslips alone are sometimes not enough — the signed employer declaration backs them up. Get it signed before you leave the job, while the employer still remembers you.',
      },
      { type: 'h2', text: '6. Leaving it to the last minute' },
      {
        type: 'p',
        text: 'If your first visa expires before you reach 88 visa days, you can’t apply for the standard second-year extension. Track from your very first shift so you always know exactly how many days you have — and how many to go.',
      },
      {
        type: 'cta',
        text: 'Never miscount again — Orary tracks your real visa-day total automatically.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General guidance only. Verify current rules at immi.homeaffairs.gov.au.',
      },
    ],
    related: ['track-88-days-working-holiday-visa', 'working-holiday-visa-days-calculator'],
  },

  {
    slug: 'how-to-calculate-your-pay',
    title: 'How to Calculate Your Pay: hourly, overtime & penalty rates',
    description:
      'Your pay is more than hours × rate once nights, weekends and overtime come in. Here is how to calculate what you should actually earn, with a worked example of a full mixed week.',
    date: '2026-06-15',
    readingTime: 7,
    tag: 'Earnings',
    accent: '#0EA5E9',
    content: [
      {
        type: 'p',
        text: "If you're casual or part-time, \"hours × rate\" only tells half the story. Nights, weekends and public holidays often pay **penalty rates** (a higher multiplier), and overtime stacks on top. Knowing how to calculate your real pay is the only way to spot when you've been short-changed.",
      },
      { type: 'h2', text: 'The base formula' },
      {
        type: 'p',
        text: 'Start simple: **base pay = hours worked × your base hourly rate.** A 6-hour shift at $28/hour = $168. That’s your foundation before any penalties.',
      },
      { type: 'h2', text: 'Penalty rates (the part people miss)' },
      {
        type: 'p',
        text: 'Many awards pay more outside normal hours. The exact multipliers depend on your industry award, but a typical pattern looks like this:',
      },
      {
        type: 'table',
        headers: ['When', 'Typical multiplier', '$28 base becomes'],
        rows: [
          ['Weekday day', '1.0× (base)', '$28.00'],
          ['Evening / night', '1.15–1.3×', '~$32–$36'],
          ['Saturday', '1.25–1.5×', '~$35–$42'],
          ['Sunday', '1.5–2.0×', '~$42–$56'],
          ['Public holiday', '2.0–2.5×', '~$56–$70'],
        ],
      },
      { type: 'h2', text: 'Worked example — a full mixed week' },
      {
        type: 'ul',
        items: [
          'Mon–Wed: 3 × 6 h day shifts at $28 = $504',
          'Fri night: 6 h at $36 (1.3×) = $216',
          'Sun: 5 h at $42 (1.5×) = $210',
        ],
      },
      {
        type: 'p',
        text: 'Total gross for the week = $504 + $216 + $210 = **$930** for 23 hours. At a flat $28 you’d have calculated only $644 — the penalty rates added almost **$286**. If your payslip shows the flat number, you may be underpaid.',
      },
      { type: 'h2', text: 'Gross vs net' },
      {
        type: 'p',
        text: 'That $930 is **gross**. Your take-home (**net**) is after tax is withheld. Working holiday makers, for example, pay 15% on the first $45,000 — so always separate "what I earned" from "what hits my account".',
      },
      {
        type: 'cta',
        text: 'Set your day/night/weekend rates once and let Orary do the maths for every shift.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Multipliers are illustrative — your real penalty rates come from your industry award. Check yours at fairwork.gov.au.',
      },
    ],
    related: ['understand-australian-payslip', 'how-to-track-work-shifts'],
    translations: {
      es: {
        title: 'Cómo calcular tu sueldo: tarifa por hora, horas extra y recargos',
        description:
          'Tu sueldo es más que horas × tarifa cuando entran noches, fines de semana y horas extra. Acá está cómo calcular lo que deberías ganar de verdad, con un ejemplo trabajado de una semana mixta completa.',
        content: [
          { type: 'p', text: 'Si sos casual o part-time, "horas × tarifa" cuenta solo la mitad de la historia. Las noches, los fines de semana y los feriados suelen pagar **recargos** (un multiplicador más alto), y las horas extra se suman encima. Saber calcular tu sueldo real es la única forma de detectar cuándo te pagaron de menos.' },
          { type: 'h2', text: 'La fórmula base' },
          { type: 'p', text: 'Arrancá simple: **sueldo base = horas trabajadas × tu tarifa base por hora.** Un turno de 6 horas a $28/hora = $168. Esa es tu base antes de cualquier recargo.' },
          { type: 'h2', text: 'Recargos (la parte que la gente pasa por alto)' },
          { type: 'p', text: 'Muchos awards pagan más fuera del horario normal. Los multiplicadores exactos dependen del award de tu industria, pero un patrón típico se ve así:' },
          { type: 'table', headers: ['Cuándo', 'Multiplicador típico', '$28 base pasa a ser'], rows: [
            ['Día de semana', '1.0× (base)', '$28.00'],
            ['Tarde / noche', '1.15–1.3×', '~$32–$36'],
            ['Sábado', '1.25–1.5×', '~$35–$42'],
            ['Domingo', '1.5–2.0×', '~$42–$56'],
            ['Feriado', '2.0–2.5×', '~$56–$70'],
          ] },
          { type: 'h2', text: 'Ejemplo trabajado — una semana mixta completa' },
          { type: 'ul', items: [
            'Lun–Mié: 3 × 6 h de día a $28 = $504',
            'Vie noche: 6 h a $36 (1.3×) = $216',
            'Dom: 5 h a $42 (1.5×) = $210',
          ] },
          { type: 'p', text: 'Total bruto de la semana = $504 + $216 + $210 = **$930** por 23 horas. A un plano de $28 habrías calculado solo $644 — los recargos sumaron casi **$286**. Si tu payslip muestra el número plano, puede que te estén pagando de menos.' },
          { type: 'h2', text: 'Bruto vs neto' },
          { type: 'p', text: 'Esos $930 son **brutos**. Lo que te llevás a casa (**neto**) es después de la retención de impuestos. Los working holiday makers, por ejemplo, pagan 15% sobre los primeros $45,000 — así que separá siempre "lo que gané" de "lo que entra a mi cuenta".' },
          { type: 'cta', text: 'Configurá tus tarifas de día/noche/finde una vez y dejá que Orary haga las cuentas de cada turno.', label: 'Probá Orary gratis', to: '/register' },
          { type: 'note', text: 'Los multiplicadores son ilustrativos — tus recargos reales salen del award de tu industria. Revisá el tuyo en fairwork.gov.au.' },
        ],
      },
      fr: {
        title: 'Comment calculer ta paie : taux horaire, heures sup et majorations',
        description:
          'Ta paie, c’est plus que heures × taux dès que les nuits, week-ends et heures sup entrent en jeu. Voici comment calculer ce que tu devrais vraiment gagner, avec un exemple chiffré d’une semaine mixte complète.',
        content: [
          { type: 'p', text: "Si tu es casual ou à temps partiel, « heures × taux » ne raconte que la moitié de l'histoire. Les nuits, week-ends et jours fériés paient souvent des **majorations** (un multiplicateur plus élevé), et les heures sup s'ajoutent par-dessus. Savoir calculer ta vraie paie est le seul moyen de repérer quand on t'a sous-payé." },
          { type: 'h2', text: 'La formule de base' },
          { type: 'p', text: 'Commence simple : **paie de base = heures travaillées × ton taux horaire de base.** Un quart de 6 heures à $28/heure = $168. C’est ta fondation avant toute majoration.' },
          { type: 'h2', text: 'Les majorations (la partie qu’on oublie)' },
          { type: 'p', text: 'Beaucoup d’awards paient plus en dehors des heures normales. Les multiplicateurs exacts dépendent de l’award de ton secteur, mais un schéma typique ressemble à ceci :' },
          { type: 'table', headers: ['Quand', 'Multiplicateur typique', '$28 de base devient'], rows: [
            ['Jour de semaine', '1,0× (base)', '$28.00'],
            ['Soir / nuit', '1,15–1,3×', '~$32–$36'],
            ['Samedi', '1,25–1,5×', '~$35–$42'],
            ['Dimanche', '1,5–2,0×', '~$42–$56'],
            ['Jour férié', '2,0–2,5×', '~$56–$70'],
          ] },
          { type: 'h2', text: 'Exemple chiffré — une semaine mixte complète' },
          { type: 'ul', items: [
            'Lun–Mer : 3 × 6 h de jour à $28 = $504',
            'Ven nuit : 6 h à $36 (1,3×) = $216',
            'Dim : 5 h à $42 (1,5×) = $210',
          ] },
          { type: 'p', text: 'Total brut de la semaine = $504 + $216 + $210 = **$930** pour 23 heures. À un taux plat de $28 tu n’aurais calculé que $644 — les majorations ont ajouté presque **$286**. Si ta fiche de paie affiche le chiffre plat, tu es peut-être sous-payé.' },
          { type: 'h2', text: 'Brut vs net' },
          { type: 'p', text: 'Ces $930 sont **bruts**. Ce que tu touches (**net**) est après retenue d’impôt. Les working holiday makers, par exemple, paient 15% sur les premiers $45,000 — alors sépare toujours « ce que j’ai gagné » de « ce qui arrive sur mon compte ».' },
          { type: 'cta', text: 'Règle tes taux jour/nuit/week-end une fois et laisse Orary faire les calculs pour chaque quart.', label: 'Essaie Orary gratuitement', to: '/register' },
          { type: 'note', text: 'Les multiplicateurs sont illustratifs — tes vraies majorations viennent de l’award de ton secteur. Vérifie le tien sur fairwork.gov.au.' },
        ],
      },
    },
  },

  {
    slug: 'understand-australian-payslip',
    title: 'Understanding Your Australian Payslip, Line by Line',
    description:
      'Gross, tax, super, net — your Australian payslip has more going on than the final number. Here is what every line means, including the 12% super rate, with an annotated example.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Earnings',
    accent: '#0EA5E9',
    content: [
      {
        type: 'p',
        text: "Your payslip is a receipt for your work — and the only way to check you've been paid correctly. But between gross, PAYG, super and net, it can look like code. Here's every part decoded.",
      },
      { type: 'h2', text: 'The main lines on a payslip' },
      {
        type: 'table',
        headers: ['Line', 'What it means'],
        rows: [
          ['Gross pay', 'Total earned before any tax is taken out.'],
          ['PAYG tax withheld', 'Income tax your employer sends to the ATO on your behalf.'],
          ['Superannuation', 'Retirement money paid ON TOP of your wage (not deducted from it).'],
          ['Net pay', 'What actually lands in your bank account (gross − tax).'],
          ['YTD totals', 'Year-to-date running totals for each of the above.'],
        ],
      },
      { type: 'h2', text: 'Superannuation: the 12% on top' },
      {
        type: 'p',
        text: 'From **1 July 2025** the super guarantee rate is **12%**. Crucially, super is paid *on top* of your wage — it’s not taken out of your pay. On $930 of gross wages, your employer should add **$111.60** of super (12%) into your super fund. As a working holiday maker you can later claim this back when you leave Australia (DASP).',
      },
      { type: 'h2', text: 'Worked example' },
      {
        type: 'p',
        text: 'A week shows: **Gross $930**, **PAYG $139.50** (15% WHM rate), **Net $790.50**, and **Super $111.60** sitting separately. If the super line is missing or the hours don’t match what you worked, that’s a red flag worth raising.',
      },
      { type: 'h2', text: 'How to check it’s right' },
      {
        type: 'ul',
        items: [
          'Hours and rate match what you actually worked.',
          'Penalty rates applied for nights/weekends.',
          'Super is present and ≈12% of gross.',
          'Net = gross − tax (super is separate, not subtracted).',
        ],
      },
      {
        type: 'cta',
        text: 'Upload a payslip and let Orary read the figures and check them against your shifts.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General information only. Confirm current rates at ato.gov.au and your pay rate at fairwork.gov.au.',
      },
    ],
    related: ['how-to-calculate-your-pay', 'working-holiday-maker-tax-refund-australia'],
  },

  {
    slug: 'tax-delivery-gig-workers-australia',
    title: 'Tax for Delivery & Gig Workers in Australia: ABN, GST & Deductions',
    description:
      'Delivery and gig work means you are a contractor — with an ABN, your own tax to set aside, and deductions to claim. Here is how it works, with a worked example of a rider’s return.',
    date: '2026-06-15',
    readingTime: 7,
    tag: 'Tax & refunds',
    accent: '#10B981',
    content: [
      {
        type: 'p',
        text: "When you deliver for Uber Eats, DoorDash or Menulog, you're not an employee — you're a **sole trader**. That changes everything about tax: no one withholds it for you, you need an ABN, and you can claim deductions. Get it right and you keep more; get it wrong and you get a bill.",
      },
      { type: 'h2', text: 'You need an ABN' },
      {
        type: 'p',
        text: 'Gig platforms require an **Australian Business Number (ABN)** because you’re running a small business. It’s free to get and means your delivery income is business income you report at tax time.',
      },
      { type: 'h2', text: 'GST — the $75,000 rule' },
      {
        type: 'p',
        text: 'For **food delivery**, you only need to register for GST once your business turnover passes **$75,000/year** — most part-time riders never reach it. (Note: rideshare like Uber driving is different — GST applies from the first dollar. Food delivery follows the $75k threshold.)',
      },
      { type: 'h2', text: 'Deductions you can claim' },
      {
        type: 'ul',
        items: [
          'Vehicle running costs — fuel, servicing, or cents-per-km (see our mileage guide).',
          'Phone and data (the work-use portion).',
          'Bags, helmet, bike maintenance and equipment.',
          'Platform/service fees taken by the app.',
        ],
      },
      { type: 'h2', text: "Worked example — a rider's return" },
      {
        type: 'p',
        text: 'Sam earns **$18,000** delivering over the year. He claims **$3,200** in deductions (kilometres, phone, equipment). His taxable income is $18,000 − $3,200 = **$14,800**. As a working holiday maker he’d pay 15% on that = **$2,220** — instead of $2,700 without the deductions. Tracking expenses saved him **$480**.',
      },
      { type: 'h2', text: 'Set aside tax as you go' },
      {
        type: 'p',
        text: 'Because no tax is withheld, put aside roughly **15–20% of each payout** so you’re not caught short at tax time. Tracking income and expenses through the year makes that automatic.',
      },
      {
        type: 'cta',
        text: 'Track delivery income, kilometres and expenses for an effortless tax time.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General information only, not tax advice. Confirm current thresholds and rules at ato.gov.au.',
      },
    ],
    related: ['mileage-deduction-delivery-riders', 'is-delivery-driving-worth-it'],
  },

  {
    slug: 'mileage-deduction-delivery-riders',
    title: 'Mileage Deductions for Delivery Riders (AU, UK, US, Canada & Ireland)',
    description:
      'Every kilometre you drive for delivery can lower your tax. Here are the official cents-per-km rates for Australia, the UK, the US, Canada and Ireland, with a worked example of what 200 km a week is worth.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Tax & refunds',
    accent: '#10B981',
    content: [
      {
        type: 'p',
        text: "If you deliver, the kilometres you drive are money — at tax time. Most tax offices let you claim a set amount per kilometre (or mile) of work driving, no receipts for fuel needed. Riders who don't log their distance leave real money on the table every single week.",
      },
      { type: 'h2', text: 'How the cents-per-km method works' },
      {
        type: 'p',
        text: 'You multiply your **work kilometres** by the official rate to get a deduction that lowers your taxable income. It bundles fuel, wear and running costs into one simple number — you just need an honest record of how far you drove for work.',
      },
      { type: 'h2', text: 'Official rates by country' },
      {
        type: 'table',
        headers: ['Country', 'Rate', 'Notes'],
        rows: [
          ['Australia (ATO)', '~$0.88 / km', 'Cents-per-km method'],
          ['United Kingdom (HMRC)', '45p / mile', 'First 10,000 miles, then 25p'],
          ['United States (IRS)', '76¢ / mile (2026)', 'Standard business mileage, rose from 72.5¢ in Jan–Jun'],
          ['Canada (CRA)', '72¢ / km', 'First 5,000 km, then 66¢'],
          ['Ireland (Revenue)', '14.48c / km', 'Motorcycle up to 150cc, first tier — rate varies by vehicle'],
        ],
      },
      { type: 'h2', text: 'Worked example — 200 km a week' },
      {
        type: 'p',
        text: 'An Uber Eats rider in Sydney drives about **200 km/week** for work. At the ATO rate of $0.88/km that’s **$176/week** in deductions. Over a 40-week year, that’s **~$7,040** off taxable income — at the 15% working holiday rate, roughly **$1,056** saved in tax. From kilometres you were driving anyway.',
      },
      { type: 'h2', text: 'Logbook vs cents-per-km' },
      {
        type: 'p',
        text: 'The cents-per-km method is simplest and usually has a cap on claimable distance. A logbook (tracking actual costs and business-use percentage) can be worth more if you drive a lot — but it’s more work. For most part-time riders, cents-per-km wins on effort vs reward.',
      },
      {
        type: 'cta',
        text: 'Log your kilometres per shift and see your estimated deduction add up.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Rates change every year and have conditions/caps. Confirm current figures with your tax office (ato.gov.au, gov.uk, irs.gov, canada.ca, revenue.ie).',
      },
    ],
    related: ['tax-delivery-gig-workers-australia', 'is-delivery-driving-worth-it'],
    translations: {
      es: {
        title: 'Deducción por kilómetros para riders de delivery (AU, UK, US, Canadá e Irlanda)',
        description:
          'Cada kilómetro que manejás para delivery puede bajar tus impuestos. Acá están las tasas oficiales de centavos por km de Australia, Reino Unido, EE.UU., Canadá e Irlanda, con un ejemplo de cuánto valen 200 km por semana.',
        content: [
          { type: 'p', text: 'Si hacés delivery, los kilómetros que manejás son plata — en la temporada de impuestos. La mayoría de las oficinas fiscales te dejan reclamar un monto fijo por kilómetro (o milla) de manejo laboral, sin necesidad de recibos de combustible. Los riders que no registran su distancia dejan plata real sobre la mesa cada semana.' },
          { type: 'h2', text: 'Cómo funciona el método de centavos por km' },
          { type: 'p', text: 'Multiplicás tus **kilómetros laborales** por la tasa oficial para obtener una deducción que baja tu ingreso gravable. Junta combustible, desgaste y costos de operación en un solo número simple — solo necesitás un registro honesto de cuánto manejaste por trabajo.' },
          { type: 'h2', text: 'Tasas oficiales por país' },
          { type: 'table', headers: ['País', 'Tasa', 'Notas'], rows: [
            ['Australia (ATO)', '~$0.88 / km', 'Método de centavos por km'],
            ['Reino Unido (HMRC)', '45p / milla', 'Primeras 10,000 millas, luego 25p'],
            ['Estados Unidos (IRS)', '76¢ / milla (2026)', 'Mileage estándar de negocio, subió de 72.5¢ en ene–jun'],
            ['Canadá (CRA)', '72¢ / km', 'Primeros 5,000 km, luego 66¢'],
            ['Irlanda (Revenue)', '14.48c / km', 'Moto hasta 150cc, primer tramo — la tasa varía según el vehículo'],
          ] },
          { type: 'h2', text: 'Ejemplo trabajado — 200 km por semana' },
          { type: 'p', text: 'Un rider de Uber Eats en Sídney maneja unos **200 km/semana** por trabajo. A la tasa de la ATO de $0.88/km eso son **$176/semana** en deducciones. En un año de 40 semanas, son **~$7,040** menos de ingreso gravable — a la tasa del 15% de working holiday, unos **$1,056** ahorrados en impuestos. De kilómetros que ibas a manejar igual.' },
          { type: 'h2', text: 'Logbook vs centavos por km' },
          { type: 'p', text: 'El método de centavos por km es el más simple y suele tener un tope de distancia reclamable. Un logbook (registrar costos reales y porcentaje de uso laboral) puede valer más si manejás mucho — pero es más trabajo. Para la mayoría de los riders part-time, centavos por km gana en esfuerzo vs recompensa.' },
          { type: 'cta', text: 'Registrá tus kilómetros por turno y mirá tu deducción estimada sumar.', label: 'Probá Orary gratis', to: '/register' },
          { type: 'note', text: 'Las tasas cambian cada año y tienen condiciones/topes. Confirmá las cifras vigentes con tu oficina fiscal (ato.gov.au, gov.uk, irs.gov, canada.ca, revenue.ie).' },
        ],
      },
      fr: {
        title: 'Déduction kilométrique pour les livreurs (AU, UK, US, Canada et Irlande)',
        description:
          'Chaque kilomètre parcouru pour la livraison peut réduire ton impôt. Voici les taux officiels au kilomètre (ou au mile) pour l’Australie, le Royaume-Uni, les États-Unis, le Canada et l’Irlande, avec un exemple de ce que valent 200 km par semaine.',
        content: [
          { type: 'p', text: "Si tu livres, les kilomètres que tu parcours, c'est de l'argent — à la période fiscale. La plupart des administrations fiscales te laissent réclamer un montant fixe par kilomètre (ou mile) parcouru pour le travail, sans reçus de carburant. Les livreurs qui ne notent pas leur distance laissent de l'argent réel sur la table chaque semaine." },
          { type: 'h2', text: 'Comment fonctionne la méthode au kilomètre' },
          { type: 'p', text: 'Tu multiplies tes **kilomètres professionnels** par le taux officiel pour obtenir une déduction qui réduit ton revenu imposable. Elle regroupe carburant, usure et frais de fonctionnement dans un seul chiffre simple — il te faut juste un relevé honnête de la distance parcourue pour le travail.' },
          { type: 'h2', text: 'Taux officiels par pays' },
          { type: 'table', headers: ['Pays', 'Taux', 'Notes'], rows: [
            ['Australie (ATO)', '~$0.88 / km', 'Méthode au kilomètre'],
            ['Royaume-Uni (HMRC)', '45p / mile', 'Premiers 10 000 miles, puis 25p'],
            ['États-Unis (IRS)', '76¢ / mile (2026)', 'Mileage professionnel standard, en hausse depuis 72,5¢ (jan–juin)'],
            ['Canada (CRA)', '72¢ / km', 'Premiers 5 000 km, puis 66¢'],
            ['Irlande (Revenue)', '14,48c / km', "Moto jusqu'à 150cc, premier palier — le taux varie selon le véhicule"],
          ] },
          { type: 'h2', text: 'Exemple chiffré — 200 km par semaine' },
          { type: 'p', text: 'Un livreur Uber Eats à Sydney parcourt environ **200 km/semaine** pour le travail. Au taux ATO de $0.88/km, cela fait **$176/semaine** de déductions. Sur une année de 40 semaines, c’est **~$7,040** de moins sur le revenu imposable — au taux working holiday de 15%, environ **$1,056** d’impôt économisés. À partir de kilomètres que tu parcourais de toute façon.' },
          { type: 'h2', text: 'Carnet de bord vs méthode au kilomètre' },
          { type: 'p', text: 'La méthode au kilomètre est la plus simple et a généralement un plafond de distance réclamable. Un carnet de bord (suivi des coûts réels et du pourcentage d’usage professionnel) peut valoir plus si tu roules beaucoup — mais c’est plus de travail. Pour la plupart des livreurs à temps partiel, la méthode au kilomètre l’emporte sur le rapport effort/récompense.' },
          { type: 'cta', text: 'Note tes kilomètres par quart et regarde ta déduction estimée s’accumuler.', label: 'Essaie Orary gratuitement', to: '/register' },
          { type: 'note', text: 'Les taux changent chaque année et ont des conditions/plafonds. Confirme les chiffres en vigueur auprès de ton administration fiscale (ato.gov.au, gov.uk, irs.gov, canada.ca, revenue.ie).' },
        ],
      },
    },
  },

  {
    slug: 'track-delivery-earnings-multiple-apps',
    title: 'How to Track Delivery Earnings Across Uber Eats, DoorDash & Menulog',
    description:
      'Running multiple delivery apps splits your money across three dashboards and none of them show your real total. Here is exactly what to track, a real multi-app week broken down day by day, and the numbers that reveal which app is actually worth your time.',
    date: '2026-06-15',
    readingTime: 9,
    tag: 'Delivery & gig',
    accent: '#F59E0B',
    content: [
      {
        type: 'p',
        text: "You finish a ten-hour day on the bike, legs aching, and you *feel* like you smashed it. Uber Eats says you earned **$182**. DoorDash says **$116**. Menulog says **$54**. Three numbers, three apps — and not one of them answers the only question that matters: how much did you actually make today, and which app was even worth opening?",
      },
      {
        type: 'p',
        text: "That blind spot is normal. Every platform shows you its own slice and hides the rest, so the more apps you run, the less you actually know about your own week. Here is how to fix it — what to track, how to read it, and a real week broken down so you can see exactly what the dashboards leave out.",
      },
      { type: 'h2', text: 'Why no single app shows your real total' },
      {
        type: 'p',
        text: 'Each app is built to keep you inside it, not to give you the full picture. Uber Eats will never tell you that DoorDash paid you more per hour last Tuesday. The only way to see your true total is to pull every platform into one place — and that is the one thing none of them will do for you.',
      },
      {
        type: 'table',
        headers: ['', 'Shows your earnings', 'Shows every app'],
        rows: [
          ['Uber Eats', '✓', '✗'],
          ['DoorDash', '✓', '✗'],
          ['Menulog', '✓', '✗'],
          ['**Your own log**', '**✓**', '**✓**'],
        ],
      },
      { type: 'h2', text: 'What to actually track per session' },
      {
        type: 'p',
        text: 'You can only improve what you measure, and "I think Uber is better" is not a measurement. For every session, on every app, capture these:',
      },
      {
        type: 'table',
        headers: ['Track this', 'Because it tells you'],
        rows: [
          ['Earnings (base + tips)', 'Your real income — not the headline figure the app pushes'],
          ['Online hours', 'The basis of your true hourly rate'],
          ['Orders', 'Your average pay per order'],
          ['Distance (km)', 'What you are really spending on fuel'],
          ['Fuel, tolls & parking', 'The costs that turn "earnings" into actual profit'],
          ['Platform', 'The single field that lets you compare apps side by side'],
        ],
      },
      { type: 'h2', text: 'The numbers worth calculating' },
      {
        type: 'p',
        text: 'Raw earnings lie. A $250 day can be worse than a $180 day once you count the hours and the fuel. These are the figures that actually tell you what is going on:',
      },
      {
        type: 'ul',
        items: [
          '**$/hour** — the single most honest number you have.',
          '**$/order** — lots of orders, low pay? You are being kept busy, not paid.',
          '**$/km** — short, dense runs beat long ones almost every time.',
          '**Best weekday and best peak** — when your effort is actually rewarded.',
        ],
      },
      {
        type: 'note',
        text: 'Your real hourly rate is **(earnings − fuel − tolls − parking) ÷ online hours**. Work it out once by hand and it stings. Orary does it for you after every session.',
      },
      { type: 'h2', text: 'A real multi-app week, day by day' },
      {
        type: 'p',
        text: 'Here is where the dashboards fall apart. Below is one rider running all three apps across five days. Each app only shows its own column — but line them up and the week finally makes sense.',
      },
      {
        type: 'table',
        headers: ['Day', 'Uber Eats', 'DoorDash', 'Menulog'],
        rows: [
          ['Mon', '$35', '$28', '$15'],
          ['Tue', '$40', '$22', '$20'],
          ['Thu', '$30', '$25', '$10'],
          ['Fri', '$60', '$45', '$30'],
          ['Sat', '$45', '$30', '$20'],
          ['**Total**', '**$210**', '**$150**', '**$95**'],
        ],
      },
      {
        type: 'p',
        text: 'On Friday, DoorDash looked like the star — $45 in one night. But spread across the whole week, Uber Eats quietly out-earned everything. One good night is not a trend, and only the combined view shows you that.',
      },
      {
        type: 'p',
        text: 'Now divide each total by the hours worked and the real ranking appears:',
      },
      {
        type: 'bars',
        items: [
          { label: 'Uber Eats — 9h', value: 23.3, display: '$23.3/h' },
          { label: 'Menulog — 5h', value: 19.0, display: '$19.0/h' },
          { label: 'DoorDash — 8h', value: 18.8, display: '$18.8/h' },
        ],
      },
      {
        type: 'p',
        text: 'Same week, completely different story: **$455** total at **$20.70/hour** overall — but Uber Eats paid almost 25% more per hour than DoorDash. Next week, this rider knows exactly which app to open first.',
      },
      { type: 'h2', text: 'Common mistakes that wreck your numbers' },
      {
        type: 'ul',
        items: [
          'Looking only at total earnings and ignoring the hours behind them.',
          'Forgetting fuel, tolls and parking — they come straight off your profit.',
          'Comparing one busy Friday against one dead Monday and calling it data.',
          'Writing off an app after a single bad shift instead of a few weeks.',
          'Running the wrong app at peak hours out of pure habit.',
        ],
      },
      {
        type: 'note',
        text: '**Pro tip:** never judge a platform on a single day. Track at least three to four weeks before deciding which app deserves more of your time — one good Friday is not a pattern.',
      },
      { type: 'h2', text: 'So which app is actually best for you?' },
      {
        type: 'p',
        text: 'It depends on your city, your hours and your day — there is no universal answer, and anyone who gives you one is guessing. The only reliable method is the one above: track a few weeks across every app you run, and let your own per-hour numbers settle the argument.',
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'Can I run Uber Eats and DoorDash at the same time?',
            a: 'Yes — multi-apping is allowed and most full-time riders do it to cut downtime. Just be ready to pause one when you accept on the other so you do not get double-booked.',
          },
          {
            q: 'Should I pause one app while I am mid-delivery on another?',
            a: 'Usually yes. Taking a second order across town mid-run wrecks your delivery time and your rating. Pause, finish, then go back online.',
          },
          {
            q: 'Which delivery app pays the most?',
            a: 'There is no single winner — it changes by city, day and hour. In the example above Uber Eats won on $/hour, but yours might not. The only honest answer comes from tracking your own weeks.',
          },
          {
            q: 'Should I count tips in my hourly rate?',
            a: 'Count them, but track them separately too. Tips tell you whether a promotion or a particular suburb is actually worth chasing.',
          },
          {
            q: 'How many weeks should I track before deciding?',
            a: 'Three to four. One week is noise — a single rainy Saturday or quiet holiday can flip the ranking. A month of data shows the real pattern.',
          },
        ],
      },
      {
        type: 'cta',
        text: 'You already have the data — it is just trapped in three apps. Add a platform to each session and Orary groups your whole week so you can finally see which app deserves your time.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Figures are illustrative examples — your real rates depend on your city and shifts.',
      },
    ],
    related: ['is-delivery-driving-worth-it', 'best-apps-casual-workers-2026'],
    translations: {
      es: {
        title: 'Cómo registrar tus ganancias de delivery entre Uber Eats, DoorDash y Menulog',
        description:
          'Manejar varias apps de delivery reparte tu plata en tres paneles y ninguno muestra tu total real. Acá tenés exactamente qué registrar, una semana multi-app real desglosada día por día, y los números que revelan qué app realmente vale tu tiempo.',
        content: [
          { type: 'p', text: 'Terminás un día de diez horas arriba de la moto, las piernas destruidas, y *sentís* que la rompiste. Uber Eats dice que ganaste **$182**. DoorDash dice **$116**. Menulog dice **$54**. Tres números, tres apps — y ninguno responde la única pregunta que importa: ¿cuánto ganaste realmente hoy, y qué app valió la pena abrir?' },
          { type: 'p', text: 'Ese punto ciego es normal. Cada plataforma te muestra su parte y esconde el resto, así que mientras más apps manejás, menos sabés de tu propia semana. Acá está cómo arreglarlo: qué registrar, cómo leerlo, y una semana real desglosada para que veas exactamente lo que los paneles te ocultan.' },
          { type: 'h2', text: 'Por qué ninguna app sola muestra tu total real' },
          { type: 'p', text: 'Cada app está diseñada para retenerte adentro, no para darte la foto completa. Uber Eats nunca te va a decir que DoorDash te pagó más por hora el martes pasado. La única forma de ver tu total real es juntar todas las plataformas en un solo lugar — y eso es justo lo único que ninguna va a hacer por vos.' },
          { type: 'table', headers: ['', 'Muestra tus ganancias', 'Muestra todas las apps'], rows: [
            ['Uber Eats', '✓', '✗'],
            ['DoorDash', '✓', '✗'],
            ['Menulog', '✓', '✗'],
            ['**Tu propio registro**', '**✓**', '**✓**'],
          ] },
          { type: 'h2', text: 'Qué registrar realmente por sesión' },
          { type: 'p', text: 'Solo podés mejorar lo que medís, y "me parece que Uber es mejor" no es una medición. Por cada sesión, en cada app, anotá esto:' },
          { type: 'table', headers: ['Registrá esto', 'Porque te dice'], rows: [
            ['Ganancias (base + propinas)', 'Tu ingreso real — no el número grande que muestra la app'],
            ['Horas online', 'La base de tu tarifa por hora real'],
            ['Pedidos', 'Tu pago promedio por pedido'],
            ['Distancia (km)', 'Lo que realmente estás gastando en combustible'],
            ['Combustible, peajes y estacionamiento', 'Los costos que convierten "ganancias" en ganancia real'],
            ['Plataforma', 'El único campo que te deja comparar apps lado a lado'],
          ] },
          { type: 'h2', text: 'Los números que vale la pena calcular' },
          { type: 'p', text: 'Las ganancias en bruto mienten. Un día de $250 puede ser peor que uno de $180 una vez que contás las horas y el combustible. Estas son las cifras que de verdad te dicen qué está pasando:' },
          { type: 'ul', items: [
            '**$/hora** — el número más honesto que tenés.',
            '**$/pedido** — ¿muchos pedidos, poca plata? Te tienen ocupado, no bien pago.',
            '**$/km** — los recorridos cortos y densos le ganan a los largos casi siempre.',
            '**Mejor día y mejor pico** — cuándo tu esfuerzo realmente se paga.',
          ] },
          { type: 'note', text: 'Tu tarifa por hora real es **(ganancias − combustible − peajes − estacionamiento) ÷ horas online**. Calculala una vez a mano y duele. Orary lo hace por vos después de cada sesión.' },
          { type: 'h2', text: 'Una semana real con varias apps, día por día' },
          { type: 'p', text: 'Acá es donde los paneles se caen a pedazos. Abajo hay un rider manejando las tres apps durante cinco días. Cada app muestra solo su columna — pero alinealas y la semana por fin tiene sentido.' },
          { type: 'table', headers: ['Día', 'Uber Eats', 'DoorDash', 'Menulog'], rows: [
            ['Lun', '$35', '$28', '$15'],
            ['Mar', '$40', '$22', '$20'],
            ['Jue', '$30', '$25', '$10'],
            ['Vie', '$60', '$45', '$30'],
            ['Sáb', '$45', '$30', '$20'],
            ['**Total**', '**$210**', '**$150**', '**$95**'],
          ] },
          { type: 'p', text: 'El viernes, DoorDash parecía la estrella — $45 en una noche. Pero repartido en toda la semana, Uber Eats ganó callado por encima de todo. Una buena noche no es una tendencia, y solo la vista combinada te lo muestra.' },
          { type: 'p', text: 'Ahora dividí cada total por las horas trabajadas y aparece el ranking real:' },
          { type: 'bars', items: [
            { label: 'Uber Eats — 9h', value: 23.3, display: '$23.3/h' },
            { label: 'Menulog — 5h', value: 19.0, display: '$19.0/h' },
            { label: 'DoorDash — 8h', value: 18.8, display: '$18.8/h' },
          ] },
          { type: 'p', text: 'Misma semana, historia totalmente distinta: **$455** en total a **$20.70/hora** en general — pero Uber Eats pagó casi 25% más por hora que DoorDash. La semana que viene, este rider sabe exactamente qué app abrir primero.' },
          { type: 'h2', text: 'Errores comunes que arruinan tus números' },
          { type: 'ul', items: [
            'Mirar solo las ganancias totales e ignorar las horas detrás.',
            'Olvidar combustible, peajes y estacionamiento — salen directo de tu ganancia.',
            'Comparar un viernes movido contra un lunes muerto y llamarlo dato.',
            'Descartar una app después de un solo turno malo en vez de unas semanas.',
            'Manejar la app equivocada en hora pico por pura costumbre.',
          ] },
          { type: 'note', text: '**Pro tip:** nunca juzgues una plataforma por un solo día. Registrá al menos tres o cuatro semanas antes de decidir qué app merece más de tu tiempo — un buen viernes no es un patrón.' },
          { type: 'h2', text: 'Entonces, ¿qué app es realmente la mejor para vos?' },
          { type: 'p', text: 'Depende de tu ciudad, tus horas y tu día — no hay respuesta universal, y quien te dé una está adivinando. El único método confiable es el de arriba: registrá unas semanas entre todas las apps que manejás, y dejá que tus propios números por hora terminen la discusión.' },
          { type: 'h2', text: 'Preguntas frecuentes' },
          { type: 'faq', items: [
            { q: '¿Puedo manejar Uber Eats y DoorDash al mismo tiempo?', a: 'Sí — usar varias apps está permitido y la mayoría de los riders full-time lo hace para reducir los tiempos muertos. Solo tené listo pausar una cuando aceptás en la otra para no quedar sobre-agendado.' },
            { q: '¿Debería pausar una app mientras estoy en medio de una entrega de otra?', a: 'Casi siempre sí. Tomar un segundo pedido del otro lado de la ciudad en medio de un recorrido te arruina el tiempo de entrega y tu calificación. Pausá, terminá, y volvé a conectarte.' },
            { q: '¿Qué app de delivery paga más?', a: 'No hay un único ganador — cambia según la ciudad, el día y la hora. En el ejemplo de arriba Uber Eats ganó en $/hora, pero la tuya puede que no. La única respuesta honesta sale de registrar tus propias semanas.' },
            { q: '¿Debería contar las propinas en mi tarifa por hora?', a: 'Contalas, pero registralas aparte también. Las propinas te dicen si una promoción o un barrio puntual realmente vale la pena perseguir.' },
            { q: '¿Cuántas semanas debería registrar antes de decidir?', a: 'Tres o cuatro. Una semana es ruido — un solo sábado lluvioso o un feriado tranquilo puede dar vuelta el ranking. Un mes de datos muestra el patrón real.' },
          ] },
          { type: 'cta', text: 'Ya tenés los datos — solo están atrapados en tres apps. Agregá una plataforma a cada sesión y Orary agrupa toda tu semana para que por fin veas qué app merece tu tiempo.', label: 'Probá Orary gratis', to: '/register' },
          { type: 'note', text: 'Las cifras son ejemplos ilustrativos — tus tarifas reales dependen de tu ciudad y tus turnos.' },
        ],
      },
      fr: {
        title: 'Comment suivre tes revenus de livraison entre Uber Eats, DoorDash et Menulog',
        description:
          "Faire tourner plusieurs apps de livraison éparpille ton argent sur trois tableaux de bord, et aucun ne montre ton vrai total. Voici exactement quoi suivre, une vraie semaine multi-apps décortiquée jour par jour, et les chiffres qui révèlent quelle app vaut vraiment ton temps.",
        content: [
          { type: 'p', text: "Tu termines une journée de dix heures sur le vélo, les jambes en compote, et tu *sens* que tu as tout déchiré. Uber Eats dit que tu as gagné **$182**. DoorDash dit **$116**. Menulog dit **$54**. Trois chiffres, trois apps — et aucun ne répond à la seule question qui compte : combien as-tu vraiment gagné aujourd'hui, et quelle app valait même la peine d'être ouverte ?" },
          { type: 'p', text: "Cet angle mort est normal. Chaque plateforme te montre sa part et cache le reste, donc plus tu fais tourner d'apps, moins tu connais ta propre semaine. Voici comment régler ça : quoi suivre, comment le lire, et une vraie semaine décortiquée pour que tu voies exactement ce que les tableaux de bord te cachent." },
          { type: 'h2', text: 'Pourquoi aucune app seule ne montre ton vrai total' },
          { type: 'p', text: "Chaque app est conçue pour te garder dedans, pas pour te donner la vue d'ensemble. Uber Eats ne te dira jamais que DoorDash t'a payé davantage par heure mardi dernier. La seule façon de voir ton vrai total est de rassembler toutes les plateformes au même endroit — et c'est précisément la seule chose qu'aucune ne fera pour toi." },
          { type: 'table', headers: ['', 'Montre tes revenus', 'Montre toutes les apps'], rows: [
            ['Uber Eats', '✓', '✗'],
            ['DoorDash', '✓', '✗'],
            ['Menulog', '✓', '✗'],
            ['**Ton propre relevé**', '**✓**', '**✓**'],
          ] },
          { type: 'h2', text: 'Quoi suivre vraiment par session' },
          { type: 'p', text: "Tu ne peux améliorer que ce que tu mesures, et « je pense qu'Uber est mieux » n'est pas une mesure. Pour chaque session, sur chaque app, note ceci :" },
          { type: 'table', headers: ['Suis ceci', 'Parce que ça te dit'], rows: [
            ['Revenus (base + pourboires)', "Ton vrai revenu — pas le gros chiffre que l'app met en avant"],
            ['Heures en ligne', 'La base de ton vrai taux horaire'],
            ['Commandes', 'Ton paiement moyen par commande'],
            ['Distance (km)', 'Ce que tu dépenses vraiment en carburant'],
            ['Carburant, péages et stationnement', "Les coûts qui transforment les « revenus » en vrai profit"],
            ['Plateforme', 'Le seul champ qui te permet de comparer les apps côte à côte'],
          ] },
          { type: 'h2', text: "Les chiffres qui valent la peine d'être calculés" },
          { type: 'p', text: "Les revenus bruts mentent. Une journée à $250 peut être pire qu'une à $180 une fois que tu comptes les heures et le carburant. Voici les chiffres qui te disent vraiment ce qui se passe :" },
          { type: 'ul', items: [
            '**$/heure** — le chiffre le plus honnête que tu aies.',
            "**$/commande** — beaucoup de commandes, peu d'argent ? On te garde occupé, pas bien payé.",
            '**$/km** — les courses courtes et denses battent les longues presque à chaque fois.',
            '**Meilleur jour et meilleur pic** — quand ton effort est réellement récompensé.',
          ] },
          { type: 'note', text: "Ton vrai taux horaire, c'est **(revenus − carburant − péages − stationnement) ÷ heures en ligne**. Fais-le une fois à la main et ça pique. Orary le fait pour toi après chaque session." },
          { type: 'h2', text: 'Une vraie semaine multi-apps, jour par jour' },
          { type: 'p', text: "C'est là que les tableaux de bord s'effondrent. Ci-dessous, un livreur fait tourner les trois apps sur cinq jours. Chaque app ne montre que sa colonne — mais aligne-les et la semaine prend enfin du sens." },
          { type: 'table', headers: ['Jour', 'Uber Eats', 'DoorDash', 'Menulog'], rows: [
            ['Lun', '$35', '$28', '$15'],
            ['Mar', '$40', '$22', '$20'],
            ['Jeu', '$30', '$25', '$10'],
            ['Ven', '$60', '$45', '$30'],
            ['Sam', '$45', '$30', '$20'],
            ['**Total**', '**$210**', '**$150**', '**$95**'],
          ] },
          { type: 'p', text: "Le vendredi, DoorDash avait l'air d'être la star — $45 en une soirée. Mais réparti sur toute la semaine, Uber Eats a gagné tranquillement au-dessus de tout. Une bonne soirée n'est pas une tendance, et seule la vue combinée te le montre." },
          { type: 'p', text: 'Maintenant divise chaque total par les heures travaillées et le vrai classement apparaît :' },
          { type: 'bars', items: [
            { label: 'Uber Eats — 9h', value: 23.3, display: '$23.3/h' },
            { label: 'Menulog — 5h', value: 19.0, display: '$19.0/h' },
            { label: 'DoorDash — 8h', value: 18.8, display: '$18.8/h' },
          ] },
          { type: 'p', text: "Même semaine, histoire totalement différente : **$455** au total à **$20.70/heure** au global — mais Uber Eats a payé près de 25 % de plus par heure que DoorDash. La semaine prochaine, ce livreur sait exactement quelle app ouvrir en premier." },
          { type: 'h2', text: 'Erreurs courantes qui faussent tes chiffres' },
          { type: 'ul', items: [
            'Ne regarder que les revenus totaux en ignorant les heures derrière.',
            'Oublier carburant, péages et stationnement — ils sortent direct de ton profit.',
            'Comparer un vendredi chargé à un lundi mort et appeler ça des données.',
            "Rayer une app après un seul mauvais quart au lieu de quelques semaines.",
            'Faire tourner la mauvaise app aux heures de pointe par pure habitude.',
          ] },
          { type: 'note', text: "**Astuce de pro :** ne juge jamais une plateforme sur une seule journée. Suis au moins trois à quatre semaines avant de décider quelle app mérite plus de ton temps — un bon vendredi n'est pas un schéma." },
          { type: 'h2', text: 'Alors quelle app est vraiment la meilleure pour toi ?' },
          { type: 'p', text: "Ça dépend de ta ville, de tes heures et de ton jour — il n'y a pas de réponse universelle, et quiconque t'en donne une devine. La seule méthode fiable est celle ci-dessus : suis quelques semaines sur toutes les apps que tu utilises, et laisse tes propres chiffres horaires trancher." },
          { type: 'h2', text: 'Questions fréquentes' },
          { type: 'faq', items: [
            { q: 'Puis-je faire tourner Uber Eats et DoorDash en même temps ?', a: "Oui — le multi-apps est autorisé et la plupart des livreurs à plein temps le font pour réduire les temps morts. Sois juste prêt à mettre l'une en pause quand tu acceptes sur l'autre pour ne pas être doublement réservé." },
            { q: 'Dois-je mettre une app en pause pendant une livraison sur une autre ?', a: "Presque toujours oui. Prendre une deuxième commande à l'autre bout de la ville en pleine course ruine ton temps de livraison et ta note. Mets en pause, termine, puis reconnecte-toi." },
            { q: 'Quelle app de livraison paie le plus ?', a: "Il n'y a pas de gagnant unique — ça change selon la ville, le jour et l'heure. Dans l'exemple ci-dessus Uber Eats a gagné en $/heure, mais la tienne peut-être pas. La seule réponse honnête vient du suivi de tes propres semaines." },
            { q: 'Dois-je compter les pourboires dans mon taux horaire ?', a: 'Compte-les, mais suis-les aussi séparément. Les pourboires te disent si une promo ou un quartier précis vaut vraiment la peine.' },
            { q: 'Combien de semaines dois-je suivre avant de décider ?', a: "Trois à quatre. Une semaine, c'est du bruit — un seul samedi pluvieux ou un jour férié calme peut renverser le classement. Un mois de données montre le vrai schéma." },
          ] },
          { type: 'cta', text: "Tu as déjà les données — elles sont juste piégées dans trois apps. Ajoute une plateforme à chaque session et Orary regroupe toute ta semaine pour que tu voies enfin quelle app mérite ton temps.", label: 'Essaie Orary gratuitement', to: '/register' },
          { type: 'note', text: 'Les chiffres sont des exemples illustratifs — tes vrais taux dépendent de ta ville et de tes quarts.' },
        ],
      },
    },
  },

  {
    slug: 'how-to-track-work-shifts',
    title: 'How to Track Your Work Shifts (and Why Spreadsheets Fail)',
    description:
      'Tracking your own shifts is the simplest way to catch underpayment and know your real earnings. Here is what to record, why spreadsheets break, and a real example of an error they hide.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Shift work',
    accent: '#EC4899',
    content: [
      {
        type: 'p',
        text: "If you don't track your own shifts, you're trusting that every employer always gets it right — and underpayment is more common than most workers think. Keeping your own record is the simplest insurance you can have, and it takes seconds per shift.",
      },
      { type: 'h2', text: 'What to record for every shift' },
      {
        type: 'ul',
        items: [
          'Date and the job/employer.',
          'Start and finish time (and any unpaid break).',
          'Your rate, including night/weekend penalty rates.',
          'Total hours and expected pay.',
        ],
      },
      { type: 'h2', text: 'Why spreadsheets break down' },
      {
        type: 'ul',
        items: [
          'One wrong formula silently miscalculates every row after it.',
          "They don't handle penalty rates or shifts crossing midnight well.",
          'Editing on your phone between shifts is painful.',
          'No reminders, no automatic weekly/monthly totals.',
        ],
      },
      { type: 'h2', text: 'Example — the error a spreadsheet hides' },
      {
        type: 'p',
        text: 'Maya logs a Sunday shift but forgets to apply the 1.5× rate in her sheet, recording it at the base $28 instead of $42. Her spreadsheet "balances" and looks correct — so when the employer also underpays that shift, nothing flags it. She’s out **$84** and never notices. A system that knows your Sunday rate would have caught it instantly.',
      },
      { type: 'h2', text: 'A better system' },
      {
        type: 'p',
        text: 'The fix is a tool that knows your rates, applies penalties automatically, totals your weeks and months, and lives on your phone. Log the shift once and the maths — and the cross-check against your payslip — happens for you.',
      },
      {
        type: 'cta',
        text: 'Track every shift in seconds and catch pay mistakes automatically.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Check your correct pay rates and entitlements at fairwork.gov.au.',
      },
    ],
    related: ['best-apps-casual-workers-2026', 'how-to-calculate-your-pay'],
    translations: {
      es: {
        title: 'Cómo registrar tus turnos de trabajo (y por qué las planillas fallan)',
        description:
          'Registrar tus propios turnos es la forma más simple de detectar pagos de menos y conocer tus ganancias reales. Acá está qué anotar, por qué las planillas fallan y un ejemplo real de un error que esconden.',
        content: [
          { type: 'p', text: 'Si no registrás tus propios turnos, estás confiando en que cada empleador siempre lo hace bien — y el pago de menos es más común de lo que la mayoría cree. Llevar tu propio registro es el seguro más simple que podés tener, y lleva segundos por turno.' },
          { type: 'h2', text: 'Qué anotar en cada turno' },
          { type: 'ul', items: [
            'Fecha y el trabajo/empleador.',
            'Hora de inicio y fin (y cualquier pausa no paga).',
            'Tu tarifa, incluyendo recargos de noche/fin de semana.',
            'Horas totales y pago esperado.',
          ] },
          { type: 'h2', text: 'Por qué las planillas se desarman' },
          { type: 'ul', items: [
            'Una fórmula mal puesta calcula mal, en silencio, cada fila que sigue.',
            'No manejan bien los recargos ni los turnos que cruzan la medianoche.',
            'Editar en el celular entre turnos es un dolor.',
            'Sin recordatorios, sin totales semanales/mensuales automáticos.',
          ] },
          { type: 'h2', text: 'Ejemplo — el error que esconde una planilla' },
          { type: 'p', text: 'Maya registra un turno de domingo pero se olvida de aplicar la tarifa 1.5× en su planilla, anotándolo al base de $28 en vez de $42. Su planilla "cuadra" y parece correcta — así que cuando el empleador también le paga de menos ese turno, nada lo marca. Pierde **$84** y nunca se entera. Un sistema que conoce tu tarifa de domingo lo habría detectado al instante.' },
          { type: 'h2', text: 'Un sistema mejor' },
          { type: 'p', text: 'La solución es una herramienta que conoce tus tarifas, aplica los recargos automáticamente, suma tus semanas y meses, y vive en tu celular. Registrás el turno una vez y las cuentas — y el cruce contra tu payslip — pasan solas.' },
          { type: 'cta', text: 'Registrá cada turno en segundos y detectá errores de pago automáticamente.', label: 'Probá Orary gratis', to: '/register' },
          { type: 'note', text: 'Consultá tus tarifas y derechos correctos en fairwork.gov.au.' },
        ],
      },
      fr: {
        title: 'Comment suivre tes quarts de travail (et pourquoi les tableurs échouent)',
        description:
          'Suivre tes propres quarts est le moyen le plus simple de repérer les sous-paiements et de connaître tes vrais revenus. Voici quoi noter, pourquoi les tableurs craquent et un exemple réel d’une erreur qu’ils cachent.',
        content: [
          { type: 'p', text: "Si tu ne suis pas tes propres quarts, tu fais confiance au fait que chaque employeur fait toujours les choses bien — et le sous-paiement est plus courant que la plupart des travailleurs ne le pensent. Tenir ton propre relevé est l'assurance la plus simple qui soit, et ça prend quelques secondes par quart." },
          { type: 'h2', text: 'Quoi noter pour chaque quart' },
          { type: 'ul', items: [
            'La date et le poste/employeur.',
            'L’heure de début et de fin (et toute pause non payée).',
            'Ton taux, y compris les majorations de nuit/week-end.',
            'Les heures totales et la paie attendue.',
          ] },
          { type: 'h2', text: 'Pourquoi les tableurs craquent' },
          { type: 'ul', items: [
            'Une seule formule fausse calcule mal, en silence, chaque ligne suivante.',
            'Ils gèrent mal les majorations et les quarts qui passent minuit.',
            'Modifier sur ton téléphone entre deux quarts est pénible.',
            'Pas de rappels, pas de totaux hebdomadaires/mensuels automatiques.',
          ] },
          { type: 'h2', text: 'Exemple — l’erreur qu’un tableur cache' },
          { type: 'p', text: 'Maya note un quart du dimanche mais oublie d’appliquer le taux 1,5× dans sa feuille, l’enregistrant au taux de base de $28 au lieu de $42. Son tableur « tombe juste » et a l’air correct — alors quand l’employeur sous-paie aussi ce quart, rien ne le signale. Elle perd **$84** sans jamais s’en rendre compte. Un système qui connaît ton taux du dimanche l’aurait détecté instantanément.' },
          { type: 'h2', text: 'Un meilleur système' },
          { type: 'p', text: 'La solution, c’est un outil qui connaît tes taux, applique les majorations automatiquement, additionne tes semaines et tes mois, et vit sur ton téléphone. Enregistre le quart une fois et les calculs — ainsi que le recoupement avec ta fiche de paie — se font pour toi.' },
          { type: 'cta', text: 'Suis chaque quart en quelques secondes et repère les erreurs de paie automatiquement.', label: 'Essaie Orary gratuitement', to: '/register' },
          { type: 'note', text: 'Vérifie tes taux et droits corrects sur fairwork.gov.au.' },
        ],
      },
    },
  },

  {
    slug: 'working-holiday-visa-new-zealand-guide',
    title: 'Working Holiday Visa in New Zealand: countries, quotas and the 3-month extension',
    description:
      "New Zealand's Working Holiday Visa works differently from Australia's 88-day rule — and your exact rules depend on your passport. Check your country's age limit, length and annual cap, then see who can extend and what it costs.",
    date: '2026-06-15',
    updated: '2026-11-18',
    readingTime: 10,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      {
        type: 'p',
        text: "If you've heard about Australia's 88 days, forget it for New Zealand — the rules here are different. There's no second-year work requirement in the same way. Instead, you get up to **12 months** (longer for a few nationalities), and a one-time **3-month extension** if you do the right seasonal work.",
      },
      {
        type: 'p',
        text: "But here's the catch nobody tells you up front: the rules are not the same for everyone. New Zealand has agreements with **45 countries**, and your age limit, how long you can stay, and whether there's an annual cap all depend on your passport. Start by checking yours.",
      },
      { type: 'h2', text: 'Check your country' },
      {
        type: 'p',
        text: 'Pick your nationality below to see your exact age limit, maximum stay, and whether your scheme has a yearly quota that can sell out.',
      },
      { type: 'embed', component: 'nzWorkingHolidayFinder' },
      { type: 'h2', text: 'How long you can stay' },
      {
        type: 'p',
        text: 'Most Working Holidaymakers get a **12-month** visa. Two nationalities get longer: **Canada** can stay up to **23 months**, and the **United Kingdom** up to **36 months** since the 2023 scheme upgrade. If your total stay reaches 24 months or more, you will need to provide police certificates.',
      },
      { type: 'h2', text: 'Capped vs uncapped: why timing is everything' },
      {
        type: 'p',
        text: "Many schemes are **capped** — once the annual quota is filled, applications close until next year. Some caps are roomy (UK 15,000, South Korea 3,000, Spain 2,000), but others are tiny: Portugal, Luxembourg and Malta have just **50 places each**, and they can vanish within hours of opening. A handful of countries — including **Germany, France, Ireland, Italy, the Netherlands, Japan, Canada and the USA** — are **uncapped**, so you can apply any time you meet the rules. The finder above tells you which group you are in.",
      },
      { type: 'h2', text: 'The 3-month extension' },
      {
        type: 'p',
        text: 'If you work in the **horticulture or viticulture** industry for at least **3 months**, you can apply to stay another **3 months** (a "Working Holiday Extension"). The work does not need to be continuous or with the same employer — but you only get this extension **once**.',
      },
      { type: 'h2', text: 'What work qualifies for the extension (and what does not)' },
      {
        type: 'p',
        text: "Qualifying work is **planting, maintaining, harvesting or packing** crops in horticulture or viticulture. Work outside those tasks — like plant nurseries, or food processing and manufacturing — does **not** count. So picking and packing grapes counts; working on a winery's bottling line may not. Keep your payslips: you will need evidence to apply.",
      },
      { type: 'h2', text: 'What it costs and what you need' },
      {
        type: 'ul',
        items: [
          'Proof of funds — around **NZD $4,200** to support yourself on arrival.',
          'A return ticket, or enough money to buy one.',
          'Medical and **travel insurance** covering your whole stay.',
          'A passport valid for at least 3 months beyond your planned departure.',
          'The visa fee and the International Visitor Levy (IVL) — amounts vary by nationality.',
        ],
      },
      { type: 'h2', text: 'Australia vs New Zealand at a glance' },
      {
        type: 'table',
        headers: ['', 'Australia', 'New Zealand'],
        rows: [
          ['Standard length', '12 months', '12 months'],
          ['Extension trigger', '88 days specified regional work', '3 months horticulture / viticulture'],
          ['Counts as', 'Full-time weeks count 7 days; otherwise days worked', 'Calendar months of work'],
          ['Repeatable', '2nd & 3rd year', 'One extension only'],
          ['Annual caps', 'Mostly uncapped', 'Many countries capped'],
        ],
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'Do I need a job lined up before I apply?',
            a: 'No. The Working Holiday Visa lets you arrive and look for work once you are there. You only need to show you can support yourself while you settle in.',
          },
          {
            q: 'How much money do I need to show?',
            a: 'Around NZD $4,200 in available funds, plus a return ticket or enough to buy one. Confirm the current figure for your nationality on immigration.govt.nz before you apply.',
          },
          {
            q: 'Can I study on a Working Holiday Visa?',
            a: 'Yes, but only one course of up to three months in total. Australian citizens are the exception and can study with no limit.',
          },
          {
            q: 'Can I do a second Working Holiday in New Zealand?',
            a: 'Generally the Working Holiday Visa is once per lifetime per country. The 3-month extension for horticulture or viticulture work is the main way to stay longer.',
          },
          {
            q: 'Can I bring my partner or children?',
            a: 'No — the Working Holiday Visa does not allow dependants. A partner would need to apply for their own visa.',
          },
        ],
      },
      {
        type: 'cta',
        text: 'Track your shifts and earnings in New Zealand, and log your horticulture days so your 3-month extension evidence is ready — free, no credit card.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'sources',
        title: 'Sources',
        items: [
          { label: 'Immigration New Zealand — Who can apply for a working holiday visa', url: 'https://www.immigration.govt.nz/work/working-holiday-visas/who-can-apply-for-a-working-holiday-visa/' },
          { label: 'Immigration New Zealand — Working holiday visas', url: 'https://www.immigration.govt.nz/work/working-holiday-visas/' },
          { label: 'New Zealand Working Holiday Visa 2026 opening dates and quotas', url: 'https://www.newzealandshores.com/news/news-new-zealand-working-holiday-visa-2026-opening-dates-quotas/' },
        ],
      },
      {
        type: 'note',
        text: 'General guidance only. Quotas, ages and costs change every year — confirm the current rules for your nationality at immigration.govt.nz before applying.',
      },
    ],
    related: ['track-88-days-working-holiday-visa', 'new-zealand-ird-tax-backpackers'],
    translations: {
      es: {
        title: 'Working Holiday Visa en Nueva Zelanda: países, cupos y la extensión de 3 meses',
        description:
          'La Working Holiday Visa de Nueva Zelanda funciona distinto a la regla de los 88 días de Australia — y tus reglas exactas dependen de tu pasaporte. Mirá el límite de edad, la duración y el cupo anual de tu país, y quién puede extender y cuánto cuesta.',
        content: [
          { type: 'p', text: 'Si escuchaste hablar de los 88 días de Australia, olvidate de eso para Nueva Zelanda — acá las reglas son distintas. No hay un requisito de trabajo para el segundo año de la misma forma. En cambio, tenés hasta **12 meses** (más para algunas nacionalidades), y una **extensión única de 3 meses** si hacés el trabajo estacional correcto.' },
          { type: 'p', text: 'Pero acá está la trampa que nadie te aclara: las reglas no son iguales para todos. Nueva Zelanda tiene acuerdos con **45 países**, y tu límite de edad, cuánto podés quedarte y si hay un cupo anual dependen de tu pasaporte. Empezá chequeando el tuyo.' },
          { type: 'h2', text: 'Chequeá tu país' },
          { type: 'p', text: 'Elegí tu nacionalidad abajo para ver tu límite de edad exacto, tu estadía máxima, y si tu esquema tiene un cupo anual que se puede agotar.' },
          { type: 'embed', component: 'nzWorkingHolidayFinder' },
          { type: 'h2', text: 'Cuánto tiempo podés quedarte' },
          { type: 'p', text: 'La mayoría obtiene una visa de **12 meses**. Dos nacionalidades obtienen más: **Canadá** puede quedarse hasta **23 meses**, y el **Reino Unido** hasta **36 meses** desde la actualización del esquema en 2023. Si tu estadía total llega a 24 meses o más, vas a tener que presentar certificados de antecedentes policiales.' },
          { type: 'h2', text: 'Con cupo vs sin cupo: por qué el timing lo es todo' },
          { type: 'p', text: 'Muchos esquemas tienen **cupo** — una vez que se llena la cuota anual, las solicitudes cierran hasta el año siguiente. Algunos cupos son amplios (Reino Unido 15.000, Corea del Sur 3.000, España 2.000), pero otros son chiquitos: Portugal, Luxemburgo y Malta tienen apenas **50 lugares cada uno**, y pueden esfumarse a las horas de abrir. Un puñado de países — entre ellos **Alemania, Francia, Irlanda, Italia, Países Bajos, Japón, Canadá y EE.UU.** — son **sin cupo**, así que podés aplicar cuando quieras mientras cumplas las reglas. El buscador de arriba te dice en qué grupo estás.' },
          { type: 'h2', text: 'La extensión de 3 meses' },
          { type: 'p', text: 'Si trabajás en la industria de **horticultura o viticultura** durante al menos **3 meses**, podés aplicar para quedarte otros **3 meses** (una "Working Holiday Extension"). El trabajo no necesita ser continuo ni con el mismo empleador — pero esta extensión la tenés **una sola vez**.' },
          { type: 'h2', text: 'Qué trabajo califica para la extensión (y qué no)' },
          { type: 'p', text: 'El trabajo que califica es **plantar, mantener, cosechar o empacar** cultivos en horticultura o viticultura. El trabajo fuera de esas tareas — como viveros, o procesamiento y manufactura de alimentos — **no** cuenta. Así que cosechar y empacar uvas cuenta; trabajar en la línea de embotellado de una bodega puede que no. Guardá tus payslips: vas a necesitar evidencia para aplicar.' },
          { type: 'h2', text: 'Cuánto cuesta y qué necesitás' },
          { type: 'ul', items: [
            'Prueba de fondos — alrededor de **NZD $4.200** para mantenerte al llegar.',
            'Un pasaje de vuelta, o dinero suficiente para comprar uno.',
            '**Seguro médico y de viaje** que cubra toda tu estadía.',
            'Un pasaporte válido por al menos 3 meses después de tu salida prevista.',
            'La tasa de la visa y el International Visitor Levy (IVL) — los montos varían según la nacionalidad.',
          ] },
          { type: 'h2', text: 'Australia vs Nueva Zelanda de un vistazo' },
          { type: 'table', headers: ['', 'Australia', 'Nueva Zelanda'], rows: [
            ['Duración estándar', '12 meses', '12 meses'],
            ['Qué activa la extensión', '88 días de trabajo regional especificado', '3 meses de horticultura / viticultura'],
            ['Se cuenta como', 'Semana completa = 7 días; si no, días trabajados', 'Meses calendario de trabajo'],
            ['Repetible', '2º y 3º año', 'Una sola extensión'],
            ['Cupos anuales', 'Mayormente sin cupo', 'Muchos países con cupo'],
          ] },
          { type: 'h2', text: 'Preguntas frecuentes' },
          { type: 'faq', items: [
            { q: '¿Necesito un trabajo conseguido antes de aplicar?', a: 'No. La Working Holiday Visa te deja llegar y buscar trabajo una vez que estás ahí. Solo necesitás demostrar que podés mantenerte mientras te acomodás.' },
            { q: '¿Cuánto dinero tengo que mostrar?', a: 'Alrededor de NZD $4.200 en fondos disponibles, más un pasaje de vuelta o lo suficiente para comprarlo. Confirmá la cifra vigente para tu nacionalidad en immigration.govt.nz antes de aplicar.' },
            { q: '¿Puedo estudiar con una Working Holiday Visa?', a: 'Sí, pero solo un curso de hasta tres meses en total. Los ciudadanos australianos son la excepción y pueden estudiar sin límite.' },
            { q: '¿Puedo hacer una segunda Working Holiday en Nueva Zelanda?', a: 'En general la Working Holiday Visa es una vez en la vida por país. La extensión de 3 meses por trabajo en horticultura o viticultura es la principal forma de quedarte más tiempo.' },
            { q: '¿Puedo llevar a mi pareja o a mis hijos?', a: 'No — la Working Holiday Visa no permite dependientes. Una pareja tendría que aplicar a su propia visa.' },
          ] },
          { type: 'cta', text: 'Registrá tus turnos y ganancias en Nueva Zelanda, y anotá tus días de horticultura para tener lista la evidencia de tu extensión de 3 meses — gratis, sin tarjeta.', label: 'Empezá gratis', to: '/register' },
          { type: 'sources', title: 'Fuentes', items: [
            { label: 'Immigration New Zealand — Quién puede aplicar a una working holiday visa', url: 'https://www.immigration.govt.nz/work/working-holiday-visas/who-can-apply-for-a-working-holiday-visa/' },
            { label: 'Immigration New Zealand — Working holiday visas', url: 'https://www.immigration.govt.nz/work/working-holiday-visas/' },
            { label: 'Fechas de apertura y cupos 2026 de la Working Holiday Visa de Nueva Zelanda', url: 'https://www.newzealandshores.com/news/news-new-zealand-working-holiday-visa-2026-opening-dates-quotas/' },
          ] },
          { type: 'note', text: 'Solo orientación general. Los cupos, edades y costos cambian cada año — confirmá las reglas vigentes para tu nacionalidad en immigration.govt.nz antes de aplicar.' },
        ],
      },
      fr: {
        title: 'Working Holiday Visa en Nouvelle-Zélande : pays, quotas et l’extension de 3 mois',
        description:
          "Le Working Holiday Visa néo-zélandais fonctionne différemment de la règle des 88 jours en Australie — et tes règles exactes dépendent de ton passeport. Vois la limite d'âge, la durée et le quota annuel de ton pays, qui peut prolonger et combien ça coûte.",
        content: [
          { type: 'p', text: "Si tu as entendu parler des 88 jours en Australie, oublie ça pour la Nouvelle-Zélande — ici les règles sont différentes. Il n'y a pas d'obligation de travail pour une deuxième année de la même manière. À la place, tu obtiens jusqu'à **12 mois** (plus pour quelques nationalités), et une **extension unique de 3 mois** si tu fais le bon travail saisonnier." },
          { type: 'p', text: "Mais voici le piège que personne ne t'annonce : les règles ne sont pas les mêmes pour tout le monde. La Nouvelle-Zélande a des accords avec **45 pays**, et ta limite d'âge, la durée de séjour et l'existence d'un quota annuel dépendent de ton passeport. Commence par vérifier le tien." },
          { type: 'h2', text: 'Vérifie ton pays' },
          { type: 'p', text: "Choisis ta nationalité ci-dessous pour voir ta limite d'âge exacte, ton séjour maximum, et si ton programme a un quota annuel qui peut être épuisé." },
          { type: 'embed', component: 'nzWorkingHolidayFinder' },
          { type: 'h2', text: 'Combien de temps tu peux rester' },
          { type: 'p', text: "La plupart obtiennent un visa de **12 mois**. Deux nationalités obtiennent plus : le **Canada** peut rester jusqu'à **23 mois**, et le **Royaume-Uni** jusqu'à **36 mois** depuis la mise à jour du programme en 2023. Si ton séjour total atteint 24 mois ou plus, tu devras fournir des certificats de police." },
          { type: 'h2', text: 'Avec ou sans quota : pourquoi le timing est primordial' },
          { type: 'p', text: "Beaucoup de programmes sont **plafonnés** — une fois le quota annuel atteint, les demandes ferment jusqu'à l'année suivante. Certains quotas sont larges (Royaume-Uni 15 000, Corée du Sud 3 000, Espagne 2 000), mais d'autres sont minuscules : le Portugal, le Luxembourg et Malte n'ont que **50 places chacun**, et elles peuvent disparaître en quelques heures après l'ouverture. Une poignée de pays — dont l'**Allemagne, la France, l'Irlande, l'Italie, les Pays-Bas, le Japon, le Canada et les États-Unis** — sont **sans quota**, donc tu peux postuler à tout moment tant que tu remplis les conditions. Le sélecteur ci-dessus te dit dans quel groupe tu es." },
          { type: 'h2', text: "L'extension de 3 mois" },
          { type: 'p', text: "Si tu travailles dans l'industrie de l'**horticulture ou de la viticulture** pendant au moins **3 mois**, tu peux demander à rester **3 mois** de plus (une « Working Holiday Extension »). Le travail n'a pas besoin d'être continu ni chez le même employeur — mais tu n'obtiens cette extension qu'**une seule fois**." },
          { type: 'h2', text: "Quel travail compte pour l'extension (et lequel ne compte pas)" },
          { type: 'p', text: "Le travail qui compte, c'est **planter, entretenir, récolter ou emballer** des cultures en horticulture ou viticulture. Le travail hors de ces tâches — comme les pépinières, ou la transformation et la fabrication alimentaires — ne compte **pas**. Donc cueillir et emballer du raisin compte ; travailler sur la ligne d'embouteillage d'un domaine peut-être pas. Garde tes fiches de paie : il te faudra des preuves pour postuler." },
          { type: 'h2', text: 'Combien ça coûte et ce qu’il te faut' },
          { type: 'ul', items: [
            'Une preuve de fonds — environ **NZD $4 200** pour subvenir à tes besoins à l’arrivée.',
            'Un billet retour, ou assez d’argent pour en acheter un.',
            'Une **assurance médicale et voyage** couvrant tout ton séjour.',
            'Un passeport valide au moins 3 mois après ta date de départ prévue.',
            "Les frais de visa et l'International Visitor Levy (IVL) — les montants varient selon la nationalité.",
          ] },
          { type: 'h2', text: 'Australie vs Nouvelle-Zélande en un coup d’œil' },
          { type: 'table', headers: ['', 'Australie', 'Nouvelle-Zélande'], rows: [
            ['Durée standard', '12 mois', '12 mois'],
            ["Déclencheur de l'extension", '88 jours de travail régional spécifié', '3 mois horticulture / viticulture'],
            ['Compté comme', 'Semaine à temps plein = 7 jours ; sinon jours travaillés', 'Mois calendaires de travail'],
            ['Renouvelable', '2e et 3e année', 'Une seule extension'],
            ['Quotas annuels', 'Surtout sans quota', 'Beaucoup de pays plafonnés'],
          ] },
          { type: 'h2', text: 'Questions fréquentes' },
          { type: 'faq', items: [
            { q: 'Dois-je avoir un emploi avant de postuler ?', a: "Non. Le Working Holiday Visa te permet d'arriver et de chercher du travail une fois sur place. Tu dois seulement prouver que tu peux subvenir à tes besoins le temps de t'installer." },
            { q: 'Combien d’argent dois-je montrer ?', a: 'Environ NZD $4 200 de fonds disponibles, plus un billet retour ou de quoi en acheter un. Confirme le montant en vigueur pour ta nationalité sur immigration.govt.nz avant de postuler.' },
            { q: 'Puis-je étudier avec un Working Holiday Visa ?', a: "Oui, mais un seul cours de trois mois maximum au total. Les citoyens australiens font exception et peuvent étudier sans limite." },
            { q: 'Puis-je faire un deuxième Working Holiday en Nouvelle-Zélande ?', a: "En général le Working Holiday Visa est une fois par vie et par pays. L'extension de 3 mois pour le travail en horticulture ou viticulture est le principal moyen de rester plus longtemps." },
            { q: 'Puis-je amener mon ou ma partenaire ou mes enfants ?', a: "Non — le Working Holiday Visa n'autorise pas les personnes à charge. Un ou une partenaire devrait demander son propre visa." },
          ] },
          { type: 'cta', text: "Suis tes quarts et tes revenus en Nouvelle-Zélande, et enregistre tes jours d'horticulture pour avoir prête la preuve de ton extension de 3 mois — gratuit, sans carte.", label: 'Commence gratuitement', to: '/register' },
          { type: 'sources', title: 'Sources', items: [
            { label: 'Immigration New Zealand — Qui peut demander un working holiday visa', url: 'https://www.immigration.govt.nz/work/working-holiday-visas/who-can-apply-for-a-working-holiday-visa/' },
            { label: 'Immigration New Zealand — Working holiday visas', url: 'https://www.immigration.govt.nz/work/working-holiday-visas/' },
            { label: 'Dates d’ouverture et quotas 2026 du Working Holiday Visa néo-zélandais', url: 'https://www.newzealandshores.com/news/news-new-zealand-working-holiday-visa-2026-opening-dates-quotas/' },
          ] },
          { type: 'note', text: 'Orientation générale uniquement. Les quotas, âges et coûts changent chaque année — confirme les règles en vigueur pour ta nationalité sur immigration.govt.nz avant de postuler.' },
        ],
      },
    },
  },

  {
    slug: 'canada-iec-working-holiday-guide',
    title: 'Working Holiday in Canada (IEC): how the program really works',
    description:
      "Canada's working holiday runs through International Experience Canada (IEC) — a pool-based system with three categories. Here is how the categories and the random selection work in 2026.",
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      {
        type: 'p',
        text: "Canada doesn't hand out working holiday visas first-come, first-served. It runs through **International Experience Canada (IEC)**, a pool-based system with three categories — and for the most popular one, you're literally selected at random. Here's how it actually works.",
      },
      { type: 'h2', text: 'The three IEC categories' },
      {
        type: 'table',
        headers: ['Category', 'Work permit', 'Best for'],
        rows: [
          ['Working Holiday', 'Open — work for almost any employer, anywhere', 'Most travellers'],
          ['Young Professionals', 'Employer-specific (NOC TEER 0–3 job)', 'Those with a job offer in their field'],
          ['International Co-op', 'Employer-specific internship', 'Students needing a placement'],
        ],
      },
      { type: 'h2', text: 'How the pools work' },
      {
        type: 'p',
        text: 'There’s **one pool per country, per category**, and you can put your profile in more than one. The **Working Holiday** pool is the popular one — usually more candidates than spots — so candidates are **randomly selected** and sent an Invitation to Apply (ITA). Young Professionals and Co-op often have more spots than candidates, so an invitation is more likely there.',
      },
      { type: 'h2', text: 'How to apply' },
      {
        type: 'ul',
        items: [
          'Check you’re eligible (your country has an agreement and you meet the age/requirements).',
          'Create your IEC profile and choose your pool(s).',
          'Wait for an Invitation to Apply in the rounds of invitations.',
          'If invited, apply for the work permit within the deadline.',
        ],
      },
      {
        type: 'cta',
        text: 'Got your permit? Track your Canadian shifts and earnings free.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General guidance only. The 2026 pools and rules are set by IRCC — confirm at canada.ca.',
      },
    ],
    related: ['working-holiday-visa-new-zealand-guide', 'track-88-days-working-holiday-visa'],
  },

  {
    slug: 'uk-ireland-tax-working-holiday',
    title: 'UK & Ireland Income Tax for Working Holiday Workers',
    description:
      'Working in the UK or Ireland on a youth-mobility or working-holiday scheme? Here are the income tax bands, how Irish tax credits work, and worked examples of what you would actually pay.',
    date: '2026-06-15',
    readingTime: 7,
    tag: 'Tax & refunds',
    accent: '#10B981',
    content: [
      {
        type: 'p',
        text: "Whether you're in the UK on the Youth Mobility Scheme or in Ireland on a working-holiday agreement, income tax works very differently in each — and Ireland's credit system in particular trips people up. Here's what you'll actually pay.",
      },
      { type: 'h2', text: 'UK income tax bands (2025/26)' },
      {
        type: 'table',
        headers: ['Income', 'Rate'],
        rows: [
          ['Up to £12,570 (Personal Allowance)', '0%'],
          ['£12,571 – £50,270', '20%'],
          ['£50,271 – £125,140', '40%'],
          ['Over £125,140', '45%'],
        ],
      },
      {
        type: 'p',
        text: 'On top of income tax there’s **National Insurance** (separate). Scotland has its own bands. **Example:** earn £25,000 → tax is 20% of (£25,000 − £12,570) = 20% × £12,430 = **£2,486** income tax for the year.',
      },
      { type: 'h2', text: 'Ireland: bands plus tax credits' },
      {
        type: 'p',
        text: 'Ireland (2025, single) charges **20%** up to €44,000 and **40%** above — but then subtracts **tax credits** (about €2,000 personal + €2,000 employee = **€4,000**). Those credits are the key: they can wipe out the tax on a modest income entirely.',
      },
      {
        type: 'p',
        text: '**Example:** earn €25,000 → 20% = €5,000, minus €4,000 credits = **€1,000** income tax. (USC and PRSI are separate.) Without understanding the credits, you’d wildly overestimate your bill.',
      },
      { type: 'h2', text: 'Getting a refund' },
      {
        type: 'p',
        text: 'Both countries over-withhold often, especially if you start mid-year or change jobs. In the UK check your **Personal Tax Account**; in Ireland use **Revenue myAccount** to claim back what you’re owed.',
      },
      {
        type: 'cta',
        text: 'Track your UK or Irish pay and get a running income-tax estimate.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Income tax only — excludes NI, USC and PRSI. General information, not advice. Confirm at gov.uk and revenue.ie.',
      },
    ],
    related: ['working-holiday-maker-tax-refund-australia', 'understand-australian-payslip'],
  },

  {
    slug: 'new-zealand-ird-tax-backpackers',
    title: 'New Zealand Tax for Backpackers: IRD rates, the IETC and refunds',
    description:
      'How income tax works for working holidaymakers in New Zealand — the IRD tax brackets (no tax-free threshold), the Independent Earner Tax Credit, ACC levy, and how to claim a refund.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Tax & refunds',
    accent: '#10B981',
    content: [
      {
        type: 'p',
        text: "New Zealand taxes working holidaymakers from the first dollar — there's no tax-free threshold like Australia's. But there's also a credit that can put money back in your pocket, and many backpackers are owed a refund they never claim.",
      },
      { type: 'h2', text: 'NZ income tax brackets' },
      {
        type: 'table',
        headers: ['Income', 'Rate'],
        rows: [
          ['$0 – $14,000', '10.5%'],
          ['$14,001 – $48,000', '17.5%'],
          ['$48,001 – $70,000', '30%'],
          ['$70,001 – $180,000', '33%'],
          ['Over $180,000', '39%'],
        ],
      },
      {
        type: 'p',
        text: '**Example:** earn $30,000 → 10.5% on the first $14,000 ($1,470) + 17.5% on the next $16,000 ($2,800) = **$4,270** income tax.',
      },
      { type: 'h2', text: 'The Independent Earner Tax Credit (IETC)' },
      {
        type: 'p',
        text: 'If you earn between roughly $24,000 and $48,000 and aren’t getting certain benefits, you may qualify for the **IETC** — a small annual credit that reduces your tax. It’s easy to miss, so check whether you’re eligible when you file.',
      },
      { type: 'h2', text: 'Don’t forget the ACC levy' },
      {
        type: 'p',
        text: 'Separate from income tax, an **ACC earners’ levy** is deducted to fund accident cover. It’s small but it’s why your take-home is a little lower than the tax brackets alone suggest.',
      },
      { type: 'h2', text: 'Claiming a refund' },
      {
        type: 'p',
        text: 'If too much was deducted (wrong tax code, mid-year start, multiple jobs), you can get it back. Check your income tax assessment in **myIR** at the end of the tax year (31 March).',
      },
      {
        type: 'cta',
        text: 'Track your NZ earnings and tax through the year in one place.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General information only. Confirm current rates and the IETC at ird.govt.nz.',
      },
    ],
    related: ['working-holiday-maker-tax-refund-australia', 'working-holiday-visa-new-zealand-guide'],
  },

  {
    slug: 'penalty-rates-australia-explained',
    title: 'Penalty Rates in Australia: weekends, nights & public holidays',
    description:
      'Penalty rates can add 50–150% to your pay for weekends, nights and public holidays — and they are often underpaid. Here is how they work, with a worked Sunday-plus-holiday example.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Earnings',
    accent: '#0EA5E9',
    content: [
      {
        type: 'p',
        text: "In Australia, working unsociable hours is supposed to pay more — sometimes a lot more. These **penalty rates** can add 50% to 150% on top of your base rate, but they're also one of the most commonly underpaid parts of a wage. Knowing yours is how you check you're getting them.",
      },
      { type: 'h2', text: 'What penalty rates are' },
      {
        type: 'p',
        text: 'A penalty rate is a **multiplier** on your base hourly rate for hours worked at certain times — evenings, weekends and public holidays. The exact multipliers come from your industry **award** or agreement, so they vary by sector.',
      },
      { type: 'h2', text: 'Typical multipliers' },
      {
        type: 'table',
        headers: ['When', 'Typical multiplier'],
        rows: [
          ['Weekday evening/night', '1.15× – 1.3×'],
          ['Saturday', '1.25× – 1.5×'],
          ['Sunday', '1.5× – 2.0×'],
          ['Public holiday', '2.0× – 2.5×'],
        ],
      },
      { type: 'h2', text: 'Worked example — a public-holiday Sunday' },
      {
        type: 'p',
        text: 'You earn $28/hour base and work 8 hours on a public holiday at 2.25×. That’s $28 × 2.25 = **$63/hour**, so 8 hours = **$504** for the day — versus $224 at the base rate. If your payslip shows anything close to the base for that shift, raise it.',
      },
      { type: 'h2', text: 'How to check your award' },
      {
        type: 'p',
        text: 'Find your award at fairwork.gov.au, note the exact multipliers for your role, and compare them to what your payslip actually paid for those hours.',
      },
      {
        type: 'cta',
        text: 'Set your penalty rates once and Orary applies them to every shift automatically.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Multipliers are illustrative — your exact rates come from your award. Check fairwork.gov.au.',
      },
    ],
    related: ['how-to-calculate-your-pay', 'am-i-being-underpaid-australia'],
  },

  {
    slug: 'casual-vs-part-time-pay-australia',
    title: 'Casual vs Part-Time vs Full-Time: what you really earn',
    description:
      'Casual loading, leave, security — the type of employment you take changes what you actually earn and keep. Here is a side-by-side comparison of the same role under each arrangement.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Earnings',
    accent: '#0EA5E9',
    content: [
      {
        type: 'p',
        text: 'Offered "casual" at a higher hourly rate, or "part-time" at a lower one? It’s not as simple as the bigger number wins. Casual loading, paid leave and job security all change what you really get. Here’s how the three compare.',
      },
      { type: 'h2', text: 'The three types, briefly' },
      {
        type: 'ul',
        items: [
          '**Casual:** higher hourly rate (casual loading, typically ~25%), but no paid leave, no guaranteed hours.',
          '**Part-time:** set hours each week, paid leave (pro-rata), more security, lower hourly rate.',
          '**Full-time:** ~38 hours/week, full leave entitlements, most security.',
        ],
      },
      { type: 'h2', text: 'Casual loading in action' },
      {
        type: 'p',
        text: 'Casual loading exists to compensate for the lack of leave and security. If a part-time base is $28/hour, the casual rate for the same role might be ~$35/hour (with 25% loading). More per hour — but you fund your own time off.',
      },
      { type: 'h2', text: 'Side by side (same role, 20 hours/week)' },
      {
        type: 'table',
        headers: ['', 'Casual', 'Part-time'],
        rows: [
          ['Hourly rate', '~$35 (with loading)', '$28'],
          ['Weekly (20h)', '$700', '$560'],
          ['Paid annual leave', 'No', 'Yes (pro-rata)'],
          ['Paid sick leave', 'No', 'Yes (pro-rata)'],
          ['Guaranteed hours', 'No', 'Yes'],
        ],
      },
      { type: 'h2', text: 'Which is better for you?' },
      {
        type: 'p',
        text: 'If you value flexibility and want the cash now, casual can pay more per hour. If you want stability, paid leave and predictable income, part-time often wins once you account for the leave you’d otherwise go without.',
      },
      {
        type: 'cta',
        text: 'Track every shift and see exactly what each arrangement earns you.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Loading and entitlements depend on your award/agreement. Check fairwork.gov.au.',
      },
    ],
    related: ['how-to-calculate-your-pay', 'am-i-being-underpaid-australia'],
  },

  {
    slug: 'am-i-being-underpaid-australia',
    title: 'Am I Being Underpaid? How to check your real hourly rate',
    description:
      'Wage underpayment is widespread, especially for casual and migrant workers. Here are the warning signs, how to check your correct rate, and a worked example of spotting an underpayment.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Earnings',
    accent: '#0EA5E9',
    content: [
      {
        type: 'p',
        text: "Wage theft isn't rare — it's common, and casual, young and migrant workers are hit hardest. The catch is that underpayment is easy to miss when you don't know your correct rate. Here's how to check whether you're actually being paid what you're owed.",
      },
      { type: 'h2', text: 'Warning signs' },
      {
        type: 'ul',
        items: [
          'A single flat rate with no extra for nights, weekends or public holidays.',
          'No payslips, or payslips that don’t show hours and rates.',
          '"Cash in hand" with no records.',
          'Pay that doesn’t change no matter when you work.',
          'A rate below the relevant award minimum.',
        ],
      },
      { type: 'h2', text: 'How to check' },
      {
        type: 'p',
        text: 'Find your award and minimum rates at fairwork.gov.au, note the correct base and penalty rates for your role, then compare them against what your payslip actually paid for each shift.',
      },
      { type: 'h2', text: 'Worked example — spotting it' },
      {
        type: 'p',
        text: 'You work 6 hours on a Sunday. Your award says Sunday is 1.75× a $28 base = $49/hour, so you should earn **$294**. Your payslip shows the flat $28 = **$168**. That’s a **$126 underpayment** for one shift — and if it happens every Sunday, it adds up to thousands a year.',
      },
      { type: 'h2', text: 'What to do' },
      {
        type: 'p',
        text: 'Keep your own shift records, raise it with your employer in writing, and if it isn’t fixed, contact the Fair Work Ombudsman. Your own log of dates, hours and rates is the evidence that makes your case.',
      },
      {
        type: 'cta',
        text: 'Keep your own shift record so underpayments can’t hide.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Check your correct pay and get help at fairwork.gov.au.',
      },
    ],
    related: ['how-to-calculate-your-pay', 'penalty-rates-australia-explained'],
  },

  {
    slug: 'best-vehicle-for-delivery',
    title: 'Best Vehicle for Delivery: bike vs e-bike vs motorbike vs car',
    description:
      'The vehicle you deliver on decides your costs, your range and your real hourly rate. Here is an honest cost-per-km comparison and when each one actually pays off.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Delivery & gig',
    accent: '#F59E0B',
    content: [
      {
        type: 'p',
        text: "The vehicle you choose for delivery quietly decides how much you keep. A car earns more per hour in some cities but bleeds money on fuel and wear; a bike costs almost nothing but limits your range. Here's how they really compare.",
      },
      { type: 'h2', text: 'The cost-per-km question' },
      {
        type: 'p',
        text: 'What matters isn’t the headline earnings — it’s **earnings minus running costs**, and running costs are mostly about your vehicle. Lower cost per kilometre means more of every delivery stays in your pocket.',
      },
      { type: 'h2', text: 'Bike vs e-bike vs motorbike vs car' },
      {
        type: 'table',
        headers: ['Vehicle', 'Running cost', 'Range / speed', 'Best for'],
        rows: [
          ['Push bike', 'Almost $0/km', 'Short range, slow', 'Dense city centres, short trips'],
          ['E-bike', 'Very low (charging)', 'Medium', 'City delivery, good all-rounder'],
          ['Motorbike/scooter', 'Low-moderate (fuel)', 'Good range, fast', 'Spread-out suburbs'],
          ['Car', 'Highest (fuel + wear)', 'Best range, weather-proof', 'Long distances, big orders, bad weather'],
        ],
      },
      { type: 'h2', text: 'When a car actually pays off' },
      {
        type: 'p',
        text: 'A car only wins if the extra earnings beat the extra costs. **Example:** a car nets you $4/hour more than an e-bike, but costs ~$15/shift more in fuel and wear. Over a 5-hour shift that’s +$20 earnings vs +$15 costs — only $5 ahead. In a compact city, the e-bike often wins outright.',
      },
      {
        type: 'cta',
        text: 'Track cost and earnings per vehicle and see which one really pays.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Figures are illustrative — your real numbers depend on your city, vehicle and platform.',
      },
    ],
    related: ['is-delivery-driving-worth-it', 'mileage-deduction-delivery-riders'],
  },

  {
    slug: 'delivery-rider-tax-deductions',
    title: 'Tax Deductions Every Delivery Rider Should Claim',
    description:
      'As a delivery contractor, the right deductions can save you hundreds at tax time. Here is the full checklist with example amounts, and a worked total for a typical rider.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Delivery & gig',
    accent: '#F59E0B',
    content: [
      {
        type: 'p',
        text: "As a delivery rider you're a contractor, which means you pay your own tax — but it also means you can claim deductions most employees can't. Every dollar of legitimate deduction lowers your taxable income. Here's what to claim.",
      },
      { type: 'h2', text: 'The deductions checklist' },
      {
        type: 'table',
        headers: ['Deduction', 'Example/year'],
        rows: [
          ['Vehicle (cents-per-km, ~$0.88/km in AU)', '$3,000+'],
          ['Phone & data (work-use portion)', '$300'],
          ['Bags, helmet, hi-vis, equipment', '$200'],
          ['Bike maintenance / servicing', '$250'],
          ['Platform service fees', 'varies'],
        ],
      },
      { type: 'h2', text: 'Cents-per-km vs logbook' },
      {
        type: 'p',
        text: 'You can claim vehicle costs two ways: the simple **cents-per-km** method (multiply work km by the set rate, up to a cap), or a **logbook** (track actual costs and your business-use percentage). For most part-time riders, cents-per-km is the easiest and gives a solid deduction.',
      },
      { type: 'h2', text: 'Worked example — the total' },
      {
        type: 'p',
        text: 'A rider claims $3,000 (kilometres) + $300 (phone) + $200 (equipment) + $250 (maintenance) = **$3,750** in deductions. On a 15% working holiday tax rate, that’s about **$562 less tax** — money that would otherwise have gone to the ATO.',
      },
      { type: 'h2', text: 'Keep the records' },
      {
        type: 'p',
        text: 'Deductions only count if you can prove them. Log your kilometres per shift and keep receipts for gear and servicing throughout the year — not the night before you lodge.',
      },
      {
        type: 'cta',
        text: 'Track kilometres and expenses per shift for an effortless tax time.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General information only, not tax advice. Confirm current rates and rules at ato.gov.au.',
      },
    ],
    related: ['tax-delivery-gig-workers-australia', 'mileage-deduction-delivery-riders'],
  },

  {
    slug: 'budgeting-irregular-income',
    title: 'Budgeting on an Irregular Income: a practical method',
    description:
      'When your pay changes every week, normal budgeting breaks. Here is the "average low" method that works for casual, shift and gig workers, with a worked three-month example.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Shift work',
    accent: '#EC4899',
    content: [
      {
        type: 'p',
        text: "Most budgeting advice assumes a steady paycheck. If you're casual, shift-based or gig, your income swings week to week — and a budget built on a good week falls apart in a quiet one. Here's a method that actually fits irregular pay.",
      },
      { type: 'h2', text: 'The problem with variable pay' },
      {
        type: 'p',
        text: 'If you budget around your *best* weeks, you’ll overspend when the slow weeks hit. The fix is to base your spending on a **reliable low**, not an optimistic average — and to smooth the peaks into the troughs yourself.',
      },
      { type: 'h2', text: 'The "average low" method' },
      {
        type: 'ul',
        items: [
          'Track your income for 2–3 months.',
          'Find a conservative baseline — roughly your lower-end month, not the best one.',
          'Build your essential budget on that baseline.',
          'In good weeks, move the surplus into a buffer instead of spending it.',
        ],
      },
      { type: 'h2', text: 'Worked example — three months' },
      {
        type: 'p',
        text: 'Your months come in at $2,800, $3,600 and $2,400. The optimistic average is $2,933 — but budgeting your rent and bills around the **$2,400** low keeps you safe. In the $3,600 month, the extra $1,200 goes to your buffer, which then covers the next quiet stretch.',
      },
      { type: 'h2', text: 'Build the buffer' },
      {
        type: 'p',
        text: 'Aim for a small buffer (even 2–4 weeks of essentials) so a slow patch doesn’t become a crisis. Knowing your real monthly numbers — not guesses — is what makes this possible.',
      },
      {
        type: 'cta',
        text: 'See your real weekly and monthly income at a glance to budget with confidence.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General guidance only, not financial advice.',
      },
    ],
    related: ['how-to-track-work-shifts', 'how-to-calculate-your-pay'],
  },

  {
    slug: 'how-orary-calculates-earnings',
    title: 'How Orary Calculates Your Earnings Automatically',
    description:
      'Set your rates once and Orary turns every shift into accurate earnings — base pay, penalty rates, breaks and totals — without a single formula. Here is how it works.',
    date: '2026-06-15',
    readingTime: 5,
    tag: 'Shift work',
    accent: '#EC4899',
    content: [
      {
        type: 'p',
        text: 'The whole point of Orary is that you should never do pay maths by hand again. You set up your jobs and rates once, log a shift in seconds, and the accurate earnings appear — penalty rates and all. Here’s what happens under the hood.',
      },
      { type: 'h2', text: 'Set your rates once' },
      {
        type: 'p',
        text: 'For each job you define your base rate and your day/afternoon/night/weekend rates (and breaks). From then on, Orary knows exactly how to value any shift you log for that job.',
      },
      { type: 'h2', text: 'It applies the right rate automatically' },
      {
        type: 'p',
        text: 'Log a Sunday evening shift and Orary applies your Sunday rate, splits hours across day/night bands if needed, subtracts unpaid breaks, and handles shifts that cross midnight — the things spreadsheets get wrong.',
      },
      { type: 'h2', text: 'Live totals across days, weeks and months' },
      {
        type: 'p',
        text: 'Every shift rolls up into running totals and statistics, so you always know what you’ve earned this week, this month and this year — across every job in one place.',
      },
      { type: 'h2', text: 'Example' },
      {
        type: 'p',
        text: 'You log Mon–Wed days, a Friday night and a Sunday. Orary shows the week at **$930** with each shift valued correctly — no formulas, no errors, no rebuilding a sheet.',
      },
      {
        type: 'cta',
        text: 'Set your rates once and never calculate pay by hand again.',
        label: 'Try Orary free',
        to: '/register',
      },
    ],
    related: ['how-to-calculate-your-pay', 'orary-vs-spreadsheet-shift-tracking'],
  },

  {
    slug: 'orary-vs-spreadsheet-shift-tracking',
    title: 'Orary vs a Spreadsheet for Tracking Shifts',
    description:
      'Spreadsheets are free and familiar, but they break in ways that cost you money and time. Here is an honest side-by-side of tracking your shifts in a spreadsheet vs in Orary.',
    date: '2026-06-15',
    readingTime: 5,
    tag: 'Shift work',
    accent: '#EC4899',
    content: [
      {
        type: 'p',
        text: 'A spreadsheet is the default way people start tracking shifts — it’s free and you already know it. But the very things that make casual work tricky (penalty rates, breaks, midnight shifts, doing it on your phone) are exactly where spreadsheets fall over.',
      },
      { type: 'h2', text: 'Side by side' },
      {
        type: 'table',
        headers: ['', 'Spreadsheet', 'Orary'],
        rows: [
          ['Penalty rates', 'Manual formulas', 'Automatic'],
          ['Shifts past midnight', 'Easy to get wrong', 'Handled'],
          ['On your phone', 'Painful', 'Built for it'],
          ['Weekly/monthly totals', 'You build them', 'Automatic'],
          ['Payslip cross-check', 'No', 'Yes'],
          ['88-day visa tracking', 'No', 'Yes'],
          ['Cost', 'Free', 'Free'],
        ],
      },
      { type: 'h2', text: 'Where spreadsheets cost you' },
      {
        type: 'p',
        text: 'One wrong formula miscalculates silently down the whole column, so an underpaid shift can hide in a sheet that "balances". And because editing a spreadsheet between shifts on your phone is a hassle, people stop updating it — and lose the record entirely.',
      },
      { type: 'h2', text: 'Where Orary wins' },
      {
        type: 'p',
        text: 'Orary knows your rates, applies penalties, totals everything, works on your phone in seconds, and cross-checks against your payslips — for free. You keep the simplicity of "log a shift" without the formula maintenance.',
      },
      {
        type: 'cta',
        text: 'Get spreadsheet-free shift tracking that does the maths for you.',
        label: 'Try Orary free',
        to: '/register',
      },
    ],
    related: ['how-to-track-work-shifts', 'best-apps-casual-workers-2026'],
  },

  {
    slug: 'export-shift-data-tax-time',
    title: 'Exporting Your Shift & Earnings Data for Tax Time',
    description:
      'Tax time is painless when your records are already in order. Here is why clean shift and earnings data matters and how to export a tidy PDF or Excel report from Orary.',
    date: '2026-06-15',
    readingTime: 5,
    tag: 'Shift work',
    accent: '#EC4899',
    content: [
      {
        type: 'p',
        text: 'The difference between a stressful tax time and a five-minute one is whether your records are already in order. If you’ve tracked your shifts and earnings through the year, exporting a clean report for your return — or your accountant — is the easy part.',
      },
      { type: 'h2', text: 'Why clean records matter' },
      {
        type: 'p',
        text: 'A tidy record of gross pay, tax withheld, hours and (for riders) kilometres and expenses is what backs up your return, supports your deductions, and — for working holidaymakers — doubles as evidence for your visa application.',
      },
      { type: 'h2', text: 'What Orary exports' },
      {
        type: 'ul',
        items: [
          'A professional **PDF report** with charts and a breakdown by month and job.',
          'An **Excel (XLSX)** export with every shift, for your accountant or your own analysis.',
          'Delivery totals including kilometres and your estimated mileage deduction.',
        ],
      },
      { type: 'h2', text: 'Example' },
      {
        type: 'p',
        text: 'At year end you export one PDF: total gross, tax withheld, monthly breakdown and delivery kilometres for deductions. You hand it to your accountant (or upload it yourself) and you’re done — no scrambling through screenshots and bank statements.',
      },
      {
        type: 'cta',
        text: 'Track all year, then export a clean report in one tap at tax time.',
        label: 'Try Orary free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Export is an Orary Premium feature. General information only — confirm what you need with your tax office or accountant.',
      },
    ],
    related: ['working-holiday-maker-tax-refund-australia', 'understand-australian-payslip'],
  },
];

export const getPost = (slug) => BLOG_POSTS.find((p) => p.slug === slug);

// Languages a post is available in (always English, plus any translations).
export const postLangs = (post) => ['en', ...Object.keys(post?.translations || {})];

// Returns a post with its localized fields (title/description/tag/content) merged
// in for `lang`. Falls back to English when no translation exists for that lang.
export const getLocalizedPost = (slug, lang = 'en') => {
  const post = getPost(slug);
  if (!post) return null;
  if (lang === 'en' || !post.translations?.[lang]) return post;
  return { ...post, ...post.translations[lang] };
};

// Posts that have a translation for `lang` (for the localized index). English
// returns all posts.
export const postsForLang = (lang = 'en') =>
  lang === 'en' ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.translations?.[lang]);
