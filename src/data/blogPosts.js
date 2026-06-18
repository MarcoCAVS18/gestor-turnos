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

export const BLOG_POSTS = [
  {
    slug: 'track-88-days-working-holiday-visa',
    title: 'How to Track Your 88 Days for the Australian Working Holiday Visa',
    description:
      'A clear guide to the 88-day specified work rule for the Australian Working Holiday Visa (subclass 417 and 462) — how visa days are actually counted, what work qualifies, which regions count, and how to track your progress.',
    date: '2026-06-14',
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
        text: 'Working Holiday Visa holders on **subclass 417** and **subclass 462** must complete 88 days of eligible "specified work" in a regional area during their first visa year to apply for a second-year extension. A third year requires a further 88 days — **176 in total** — completed during the second year.',
      },
      { type: 'h2', text: "The biggest myth: they're not calendar days" },
      {
        type: 'p',
        text: "Here's the part that trips everyone up. The 88 days are **visa-accredited days**, calculated from the hours you work in each Monday–Sunday week using an official formula from the Department of Home Affairs. A full-time week earns you 7 visa days — even though there are only 5 or 6 working days in it. A light week earns fewer. So your visa-day total can be **higher or lower** than the number of days you actually clocked in.",
      },
      { type: 'h2', text: 'How visa days are calculated (the weekly formula)' },
      {
        type: 'p',
        text: 'Each Monday–Sunday week converts to visa days based on total hours worked that week:',
      },
      {
        type: 'ul',
        items: [
          '4 – 7.24 hours = 1 visa day',
          '7.25 – 14.24 hours = 2 visa days',
          '14.25 – 21.24 hours = 3 visa days',
          '21.25 – 28.24 hours = 4 visa days',
          '28.25 – 35.24 hours = 5 visa days',
          '35.25 hours or more = 7 visa days',
        ],
      },
      {
        type: 'note',
        text: 'You need at least **4 hours in a single Monday–Sunday week** to earn even 1 visa day. Any week below 4 hours contributes zero — even if you worked several short shifts.',
      },
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
        text: 'Subclass 417 covers passport holders from the UK, Ireland, Canada, France, Germany, Italy, the Netherlands, South Korea, Japan and others. Subclass 462 covers the USA, China, India, Vietnam, Argentina, Chile and others. Both require 88 days for a second year and 176 total for a third, but eligible work categories and age limits can vary by country.',
      },
      { type: 'h2', text: 'Common mistakes to avoid' },
      {
        type: 'ul',
        items: [
          'Counting calendar days instead of visa days from weekly hours.',
          'Working under 4 hours in a week and assuming it still counts.',
          'Not keeping payslips and employer declarations (Form 1263) as evidence.',
          'Working in a non-eligible postcode or job category.',
          'Leaving it until the last minute — track from your very first shift.',
        ],
      },
      { type: 'h2', text: 'How to track your 88 days without spreadsheets' },
      {
        type: 'p',
        text: 'The reliable way is to log every shift with its hours, group them into Monday–Sunday weeks, apply the government formula to each week, and add up the visa days. Doing that by hand in a spreadsheet works, but it’s easy to make mistakes — and a mistake here can cost you a whole visa year.',
      },
      {
        type: 'p',
        text: 'Orary does it automatically: log your shifts, and it groups them into weeks, applies the official visa-day formula, and shows a live progress bar toward 88 and 176 days — with payslips and earnings tracked alongside, so the same records back up both your visa application and your taxes.',
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
          { type: 'p', text: 'Los titulares de Working Holiday Visa de **subclase 417** y **subclase 462** deben completar 88 días de "trabajo especificado" elegible en una zona regional durante su primer año de visa para pedir la extensión del segundo año. El tercer año requiere otros 88 días — **176 en total** — durante el segundo año.' },
          { type: 'h2', text: 'El mito más grande: no son días de calendario' },
          { type: 'p', text: 'Acá es donde todos se confunden. Los 88 días son **días acreditados de visa**, calculados a partir de las horas que trabajás cada semana de lunes a domingo con una fórmula oficial del Department of Home Affairs. Una semana full-time (35.25+ horas) te da 7 días de visa esa semana — aunque hayas trabajado 5 o 6 días. Menos horas dan menos días. **No** es la cantidad de días que pasaste en el trabajo.' },
          { type: 'h2', text: 'Cómo se calculan los días de visa (la fórmula semanal)' },
          { type: 'p', text: 'Cada semana de lunes a domingo se convierte en días de visa según las horas trabajadas:' },
          { type: 'ul', items: [
            '4 – 7.24 horas = 1 día de visa',
            '7.25 – 14.24 horas = 2 días de visa',
            '14.25 – 21.24 horas = 3 días de visa',
            '21.25 – 28.24 horas = 4 días de visa',
            '28.25 – 35.24 horas = 5 días de visa',
            '35.25 horas o más = 7 días de visa',
          ] },
          { type: 'note', text: 'Necesitás al menos **4 horas en una sola semana (lun–dom)** para ganar siquiera 1 día de visa. Cualquier semana con menos de 4 horas suma cero — aunque hayas trabajado varios turnos cortos.' },
          { type: 'h2', text: 'Qué cuenta como trabajo especificado' },
          { type: 'p', text: 'Las categorías elegibles incluyen cultivo de plantas y animales (cosecha de fruta, poda, trabajo de campo), pesca y perlería, silvicultura y tala, minería y construcción. Desde 2023, cierto trabajo de turismo y hostelería en zonas regionales específicas también califica. Las categorías cambian, así que confirmá siempre la lista vigente antes de empezar.' },
          { type: 'h2', text: 'Qué regiones cuentan' },
          { type: 'p', text: 'Cuentan todo el Northern Territory, South Australia y Tasmania. También Queensland regional (excepto Greater Brisbane), Western Australia regional (excepto el área metro de Perth), New South Wales regional (excepto Sídney, Newcastle y Wollongong) y Victoria regional (excepto Melbourne). El Department publica los códigos postales exactos — revisá el tuyo antes de firmar.' },
          { type: 'h2', text: 'Subclase 417 vs 462' },
          { type: 'p', text: 'La subclase 417 es para pasaportes de Reino Unido, Irlanda, Canadá, Francia, Alemania, Italia, Países Bajos, Corea del Sur, Japón y otros. La 462 es para EE.UU., China, India, Vietnam, Argentina, Chile y otros. Ambas requieren 88 días para un segundo año y 176 en total para un tercero, pero las categorías de trabajo y los límites de edad pueden variar por país.' },
          { type: 'h2', text: 'Errores comunes a evitar' },
          { type: 'ul', items: [
            'Contar días de calendario en vez de días de visa según las horas semanales.',
            'Trabajar menos de 4 horas en una semana y asumir que igual cuenta.',
            'No guardar payslips ni la declaración del empleador (Form 1263) como evidencia.',
            'Trabajar en un código postal o categoría no elegibles.',
            'Dejarlo para último momento — registrá desde tu primer turno.',
          ] },
          { type: 'h2', text: 'Cómo seguir tus 88 días sin planillas' },
          { type: 'p', text: 'La forma confiable es registrar cada turno con sus horas, agruparlos en semanas de lunes a domingo, aplicar la fórmula oficial a cada semana y sumar los días de visa. Hacerlo a mano en una planilla funciona, pero es fácil equivocarse — y un error acá puede costarte un año entero de visa.' },
          { type: 'p', text: 'Orary lo hace automático: registrás tus turnos y los agrupa en semanas, aplica la fórmula oficial de días de visa y te muestra una barra de progreso en vivo hacia los 88 y 176 días — con payslips y ganancias registradas al lado, así los mismos datos respaldan tu solicitud de visa y tus impuestos.' },
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
          { type: 'p', text: 'Les titulaires d’un Working Holiday Visa de **sous-classe 417** et **462** doivent compléter 88 jours de « travail spécifié » éligible dans une zone régionale pendant leur première année de visa pour demander une deuxième année. La troisième année exige 88 jours de plus — **176 au total** — pendant la deuxième année.' },
          { type: 'h2', text: 'Le plus grand mythe : ce ne sont pas des jours de calendrier' },
          { type: 'p', text: "Voici ce qui piège tout le monde. Les 88 jours sont des **jours accrédités de visa**, calculés à partir des heures travaillées chaque semaine du lundi au dimanche selon une formule officielle du Department of Home Affairs. Une semaine à temps plein (35,25+ heures) donne 7 jours de visa — même si tu n'as travaillé que 5 ou 6 jours. Moins d'heures, moins de jours. Ce n'est **pas** le nombre de jours physiquement passés au travail." },
          { type: 'h2', text: 'Comment les jours de visa sont calculés (la formule hebdomadaire)' },
          { type: 'p', text: 'Chaque semaine du lundi au dimanche se convertit en jours de visa selon les heures travaillées :' },
          { type: 'ul', items: [
            '4 – 7,24 heures = 1 jour de visa',
            '7,25 – 14,24 heures = 2 jours de visa',
            '14,25 – 21,24 heures = 3 jours de visa',
            '21,25 – 28,24 heures = 4 jours de visa',
            '28,25 – 35,24 heures = 5 jours de visa',
            '35,25 heures ou plus = 7 jours de visa',
          ] },
          { type: 'note', text: 'Il te faut au moins **4 heures dans une seule semaine (lun–dim)** pour gagner ne serait-ce qu’1 jour de visa. Toute semaine sous 4 heures compte pour zéro — même avec plusieurs courts quarts.' },
          { type: 'h2', text: 'Qu’est-ce qui compte comme travail spécifié' },
          { type: 'p', text: 'Les catégories éligibles incluent la culture de plantes et d’animaux (cueillette de fruits, taille, travail agricole), la pêche et la perliculture, la sylviculture et l’abattage, l’exploitation minière et la construction. Depuis 2023, certains emplois du tourisme et de l’hôtellerie dans des zones régionales spécifiées comptent aussi. Les catégories changent — vérifie toujours la liste à jour avant de commencer.' },
          { type: 'h2', text: 'Quelles régions comptent' },
          { type: 'p', text: 'Tout le Northern Territory, le South Australia et la Tasmanie comptent. Aussi le Queensland régional (hors Greater Brisbane), le Western Australia régional (hors zone métro de Perth), le New South Wales régional (hors Sydney, Newcastle et Wollongong) et le Victoria régional (hors Melbourne). Le Department publie les codes postaux exacts — vérifie le tien avant de signer.' },
          { type: 'h2', text: 'Sous-classe 417 vs 462' },
          { type: 'p', text: 'La sous-classe 417 concerne les passeports du Royaume-Uni, d’Irlande, du Canada, de France, d’Allemagne, d’Italie, des Pays-Bas, de Corée du Sud, du Japon et d’autres. La 462 concerne les États-Unis, la Chine, l’Inde, le Vietnam, l’Argentine, le Chili et d’autres. Les deux exigent 88 jours pour une deuxième année et 176 au total pour une troisième, mais les catégories de travail et limites d’âge peuvent varier selon le pays.' },
          { type: 'h2', text: 'Erreurs courantes à éviter' },
          { type: 'ul', items: [
            'Compter des jours de calendrier au lieu des jours de visa selon les heures hebdomadaires.',
            'Travailler moins de 4 heures dans une semaine et croire que ça compte quand même.',
            'Ne pas garder les fiches de paie ni la déclaration de l’employeur (Form 1263) comme preuve.',
            'Travailler dans un code postal ou une catégorie non éligibles.',
            'Tout laisser à la dernière minute — enregistre dès ton premier quart.',
          ] },
          { type: 'h2', text: 'Comment suivre tes 88 jours sans tableurs' },
          { type: 'p', text: 'La méthode fiable : enregistrer chaque quart avec ses heures, les regrouper en semaines du lundi au dimanche, appliquer la formule officielle à chaque semaine et additionner les jours de visa. Le faire à la main dans un tableur fonctionne, mais c’est facile de se tromper — et une erreur ici peut te coûter une année entière de visa.' },
          { type: 'p', text: 'Orary le fait automatiquement : enregistre tes quarts et il les regroupe en semaines, applique la formule officielle des jours de visa et affiche une barre de progression en direct vers 88 et 176 jours — avec fiches de paie et revenus suivis à côté, pour que les mêmes données appuient ta demande de visa et tes impôts.' },
          { type: 'cta', text: 'Suis tes 88 jours automatiquement — gratuit, sans carte bancaire.', label: 'Commence gratuitement', to: '/register' },
          { type: 'note', text: 'Ceci n’est qu’une orientation générale. Les règles changent — vérifie toujours les exigences à jour sur immi.homeaffairs.gov.au.' },
        ],
      },
    },
  },

  {
    slug: 'working-holiday-visa-days-calculator',
    title: 'How Visa Days Are Calculated: the 88-day weekly hours formula',
    description:
      'The Working Holiday Visa 88-day count is calculated from your weekly hours, not the days you worked. Here is the exact formula, worked examples week by week, and how many weeks it really takes to reach 88 days.',
    date: '2026-06-15',
    readingTime: 8,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      {
        type: 'p',
        text: "Almost every backpacker counts their 88 days wrong, and it's not their fault — the rule is genuinely counter-intuitive. Your **88 days for the Working Holiday Visa are calculated from the hours you work each week**, not the number of days you showed up. This guide shows the exact formula and walks through real weekly examples so you can calculate your own total with confidence.",
      },
      { type: 'h2', text: 'The rule in one sentence' },
      {
        type: 'p',
        text: 'Take each **Monday–Sunday week**, add up all the hours you worked in eligible specified work, convert those hours into "visa days" using the official table below, then add up the visa days from every week. When the total hits 88, you qualify for a second year (176 for a third).',
      },
      { type: 'h2', text: 'The official conversion table' },
      {
        type: 'ul',
        items: [
          '4 – 7.24 hours in the week = 1 visa day',
          '7.25 – 14.24 hours = 2 visa days',
          '14.25 – 21.24 hours = 3 visa days',
          '21.25 – 28.24 hours = 4 visa days',
          '28.25 – 35.24 hours = 5 visa days',
          '35.25 hours or more = 7 visa days',
        ],
      },
      {
        type: 'note',
        text: 'Notice the jump from 5 to **7** at full time — there is no "6". And anything **under 4 hours in a week counts as zero**, no matter how many separate shifts you did.',
      },
      { type: 'h2', text: 'Worked example 1 — a full-time harvest week' },
      {
        type: 'p',
        text: "Maria picks strawberries Monday to Saturday, about 7 hours a day. That's **42 hours** in the week. 42 is well above 35.25, so the whole week is worth **7 visa days** — even though she had Sunday off and only physically worked 6 days. One solid full-time week = a full 7 days toward your 88.",
      },
      { type: 'h2', text: 'Worked example 2 — a part-time week' },
      {
        type: 'p',
        text: "Tom works three café shifts of 6 hours each: **18 hours** total. 18 falls in the 14.25–21.24 band, so that week is **3 visa days**. It's a coincidence that he worked 3 days and got 3 days — change those shifts to two 9-hour days (still 18 hours) and he'd still get exactly 3. It's always the hours, never the days.",
      },
      { type: 'h2', text: 'Worked example 3 — the light week that costs you' },
      {
        type: 'p',
        text: "A rainy week on the farm: Lena only gets two short shifts of 1.5 hours, **3 hours** total. Because that's under 4 hours, the entire week is worth **0 visa days**. This is the single most common way people lose progress — a sub-4-hour week is wasted. If a week is going to be light, it's often worth picking up one more short shift to clear the 4-hour minimum and bank at least 1 day.",
      },
      { type: 'h2', text: 'Putting it together — one month of work' },
      {
        type: 'p',
        text: 'Add the weeks up. Say a month looks like this:',
      },
      {
        type: 'ul',
        items: [
          'Week 1: 42 hours → 7 days',
          'Week 2: 18 hours → 3 days',
          'Week 3: 30 hours → 5 days',
          'Week 4: 38 hours → 7 days',
        ],
      },
      {
        type: 'p',
        text: 'Total for the month = 7 + 3 + 5 + 7 = **22 visa days**. At that pace you would reach 88 in roughly four months — but a couple of full-time weeks would get you there much faster, and a few light weeks would slow you down a lot.',
      },
      { type: 'h2', text: 'How many weeks does it really take to reach 88 days?' },
      {
        type: 'p',
        text: 'It depends entirely on your weekly hours. Here is the honest math:',
      },
      {
        type: 'ul',
        items: [
          'Full time (35.25 h+) → 7 days/week → about 13 weeks (~3 months)',
          '28.25–35.24 h → 5 days/week → about 18 weeks',
          '21.25–28.24 h → 4 days/week → about 22 weeks',
          '14.25–21.24 h → 3 days/week → about 30 weeks',
          '7.25–14.24 h → 2 days/week → about 44 weeks',
          '4–7.24 h → 1 day/week → 88 weeks',
        ],
      },
      {
        type: 'note',
        text: 'This is why full-time, consistent work is the fastest route — and why scattered part-time hours can stretch "88 days" across most of your visa year.',
      },
      { type: 'h2', text: 'Track the calculation automatically' },
      {
        type: 'p',
        text: 'Doing this by hand means rebuilding the table every week and hoping you grouped the dates correctly. Orary does it for you: log your shifts, and it slices them into Monday–Sunday weeks, applies this exact formula to each week, and shows a live total and progress bar toward 88 and 176 days — with your payslips and earnings tracked in the same place as evidence.',
      },
      {
        type: 'cta',
        text: 'See your 88-day total update automatically as you log shifts — free.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General guidance only. The Department of Home Affairs sets and updates these rules — always confirm the current formula and eligibility at immi.homeaffairs.gov.au.',
      },
    ],
    related: ['track-88-days-working-holiday-visa'],
    translations: {
      es: {
        title: 'Cómo se calculan los días de visa: la fórmula semanal de los 88 días',
        description:
          'El conteo de 88 días de la Working Holiday Visa se calcula a partir de tus horas semanales, no de los días que trabajaste. Acá está la fórmula exacta, ejemplos semana a semana y cuántas semanas lleva de verdad llegar a 88 días.',
        content: [
          { type: 'p', text: 'Casi todos los backpackers cuentan mal sus 88 días, y no es su culpa — la regla es genuinamente contraintuitiva. Tus **88 días de la Working Holiday Visa se calculan a partir de las horas que trabajás cada semana**, no de la cantidad de días que fuiste. Esta guía muestra la fórmula exacta y recorre ejemplos semanales reales para que calcules tu propio total con confianza.' },
          { type: 'h2', text: 'La regla en una frase' },
          { type: 'p', text: 'Tomá cada **semana de lunes a domingo**, sumá todas las horas que trabajaste en trabajo especificado elegible, convertí esas horas en "días de visa" con la tabla oficial de abajo, y después sumá los días de visa de cada semana. Cuando el total llega a 88, calificás para un segundo año (176 para un tercero).' },
          { type: 'h2', text: 'La tabla de conversión oficial' },
          { type: 'ul', items: [
            '4 – 7.24 horas en la semana = 1 día de visa',
            '7.25 – 14.24 horas = 2 días de visa',
            '14.25 – 21.24 horas = 3 días de visa',
            '21.25 – 28.24 horas = 4 días de visa',
            '28.25 – 35.24 horas = 5 días de visa',
            '35.25 horas o más = 7 días de visa',
          ] },
          { type: 'note', text: 'Fijate en el salto de 5 a **7** en jornada completa — no existe el "6". Y cualquier semana **por debajo de 4 horas cuenta como cero**, sin importar cuántos turnos distintos hayas hecho.' },
          { type: 'h2', text: 'Ejemplo 1 — una semana de cosecha a tiempo completo' },
          { type: 'p', text: 'Maria cosecha frutillas de lunes a sábado, unas 7 horas por día. Eso son **42 horas** en la semana. 42 está muy por encima de 35.25, así que toda la semana vale **7 días de visa** — aunque tuvo libre el domingo y físicamente trabajó solo 6 días. Una semana sólida a tiempo completo = 7 días enteros hacia tus 88.' },
          { type: 'h2', text: 'Ejemplo 2 — una semana part-time' },
          { type: 'p', text: 'Tom hace tres turnos de café de 6 horas cada uno: **18 horas** en total. 18 cae en la banda de 14.25–21.24, así que esa semana son **3 días de visa**. Es casualidad que trabajara 3 días y le dieran 3 días — cambiá esos turnos por dos días de 9 horas (siguen siendo 18 horas) y seguiría dando exactamente 3. Siempre son las horas, nunca los días.' },
          { type: 'h2', text: 'Ejemplo 3 — la semana floja que te cuesta' },
          { type: 'p', text: 'Una semana de lluvia en la granja: Lena solo consigue dos turnos cortos de 1.5 horas, **3 horas** en total. Como es menos de 4 horas, toda la semana vale **0 días de visa**. Esta es la forma más común de perder progreso — una semana de menos de 4 horas se desperdicia. Si una semana va a venir floja, muchas veces conviene agarrar un turno corto más para pasar el mínimo de 4 horas y guardar al menos 1 día.' },
          { type: 'h2', text: 'Juntando todo — un mes de trabajo' },
          { type: 'p', text: 'Sumá las semanas. Digamos que un mes se ve así:' },
          { type: 'ul', items: [
            'Semana 1: 42 horas → 7 días',
            'Semana 2: 18 horas → 3 días',
            'Semana 3: 30 horas → 5 días',
            'Semana 4: 38 horas → 7 días',
          ] },
          { type: 'p', text: 'Total del mes = 7 + 3 + 5 + 7 = **22 días de visa**. A ese ritmo llegarías a 88 en unos cuatro meses — pero un par de semanas a tiempo completo te llevarían mucho más rápido, y unas pocas semanas flojas te frenarían bastante.' },
          { type: 'h2', text: '¿Cuántas semanas lleva de verdad llegar a 88 días?' },
          { type: 'p', text: 'Depende totalmente de tus horas semanales. Acá está la matemática honesta:' },
          { type: 'ul', items: [
            'Tiempo completo (35.25 h+) → 7 días/semana → unas 13 semanas (~3 meses)',
            '28.25–35.24 h → 5 días/semana → unas 18 semanas',
            '21.25–28.24 h → 4 días/semana → unas 22 semanas',
            '14.25–21.24 h → 3 días/semana → unas 30 semanas',
            '7.25–14.24 h → 2 días/semana → unas 44 semanas',
            '4–7.24 h → 1 día/semana → 88 semanas',
          ] },
          { type: 'note', text: 'Por esto el trabajo a tiempo completo y constante es la ruta más rápida — y por esto las horas part-time dispersas pueden estirar los "88 días" a casi todo tu año de visa.' },
          { type: 'h2', text: 'Seguí el cálculo automáticamente' },
          { type: 'p', text: 'Hacerlo a mano significa rearmar la tabla cada semana y rezar para haber agrupado bien las fechas. Orary lo hace por vos: registrás tus turnos y los corta en semanas de lunes a domingo, aplica esta fórmula exacta a cada semana y muestra un total en vivo y una barra de progreso hacia los 88 y 176 días — con tus payslips y ganancias registradas en el mismo lugar como evidencia.' },
          { type: 'cta', text: 'Mirá tu total de 88 días actualizarse solo a medida que registrás turnos — gratis.', label: 'Empezá gratis', to: '/register' },
          { type: 'note', text: 'Solo orientación general. El Department of Home Affairs fija y actualiza estas reglas — confirmá siempre la fórmula y la elegibilidad vigentes en immi.homeaffairs.gov.au.' },
        ],
      },
      fr: {
        title: 'Comment les jours de visa sont calculés : la formule hebdomadaire des 88 jours',
        description:
          'Le décompte des 88 jours du Working Holiday Visa se calcule à partir de tes heures hebdomadaires, pas des jours travaillés. Voici la formule exacte, des exemples semaine par semaine et combien de semaines il faut vraiment pour atteindre 88 jours.',
        content: [
          { type: 'p', text: "Presque tous les backpackers comptent mal leurs 88 jours, et ce n'est pas leur faute — la règle est vraiment contre-intuitive. Tes **88 jours du Working Holiday Visa se calculent à partir des heures travaillées chaque semaine**, pas du nombre de jours où tu es allé. Ce guide montre la formule exacte et déroule des exemples hebdomadaires réels pour que tu calcules ton propre total en confiance." },
          { type: 'h2', text: 'La règle en une phrase' },
          { type: 'p', text: 'Prends chaque **semaine du lundi au dimanche**, additionne toutes les heures travaillées en travail spécifié éligible, convertis ces heures en « jours de visa » avec le tableau officiel ci-dessous, puis additionne les jours de visa de chaque semaine. Quand le total atteint 88, tu es éligible pour une deuxième année (176 pour une troisième).' },
          { type: 'h2', text: 'Le tableau de conversion officiel' },
          { type: 'ul', items: [
            '4 – 7,24 heures dans la semaine = 1 jour de visa',
            '7,25 – 14,24 heures = 2 jours de visa',
            '14,25 – 21,24 heures = 3 jours de visa',
            '21,25 – 28,24 heures = 4 jours de visa',
            '28,25 – 35,24 heures = 5 jours de visa',
            '35,25 heures ou plus = 7 jours de visa',
          ] },
          { type: 'note', text: 'Remarque le saut de 5 à **7** à temps plein — il n’y a pas de « 6 ». Et toute semaine **sous 4 heures compte pour zéro**, peu importe le nombre de quarts distincts.' },
          { type: 'h2', text: 'Exemple 1 — une semaine de récolte à temps plein' },
          { type: 'p', text: 'Maria cueille des fraises du lundi au samedi, environ 7 heures par jour. Cela fait **42 heures** dans la semaine. 42 est bien au-dessus de 35,25, donc toute la semaine vaut **7 jours de visa** — même si elle a eu son dimanche libre et n’a physiquement travaillé que 6 jours. Une bonne semaine à temps plein = 7 jours entiers vers tes 88.' },
          { type: 'h2', text: 'Exemple 2 — une semaine à temps partiel' },
          { type: 'p', text: 'Tom fait trois quarts de café de 6 heures chacun : **18 heures** au total. 18 tombe dans la tranche 14,25–21,24, donc cette semaine vaut **3 jours de visa**. C’est une coïncidence qu’il ait travaillé 3 jours et obtenu 3 jours — change ces quarts pour deux journées de 9 heures (toujours 18 heures) et il obtiendrait encore exactement 3. Ce sont toujours les heures, jamais les jours.' },
          { type: 'h2', text: 'Exemple 3 — la semaine légère qui te coûte' },
          { type: 'p', text: 'Une semaine de pluie à la ferme : Lena n’obtient que deux courts quarts de 1,5 heure, **3 heures** au total. Comme c’est moins de 4 heures, toute la semaine vaut **0 jour de visa**. C’est la façon la plus courante de perdre de la progression — une semaine sous 4 heures est gâchée. Si une semaine s’annonce légère, ça vaut souvent le coup de prendre un quart court de plus pour franchir le minimum de 4 heures et engranger au moins 1 jour.' },
          { type: 'h2', text: 'On assemble tout — un mois de travail' },
          { type: 'p', text: 'Additionne les semaines. Disons qu’un mois ressemble à ça :' },
          { type: 'ul', items: [
            'Semaine 1 : 42 heures → 7 jours',
            'Semaine 2 : 18 heures → 3 jours',
            'Semaine 3 : 30 heures → 5 jours',
            'Semaine 4 : 38 heures → 7 jours',
          ] },
          { type: 'p', text: 'Total du mois = 7 + 3 + 5 + 7 = **22 jours de visa**. À ce rythme tu atteindrais 88 en environ quatre mois — mais quelques semaines à temps plein t’y mèneraient bien plus vite, et quelques semaines légères te ralentiraient beaucoup.' },
          { type: 'h2', text: 'Combien de semaines faut-il vraiment pour atteindre 88 jours ?' },
          { type: 'p', text: 'Cela dépend entièrement de tes heures hebdomadaires. Voici le calcul honnête :' },
          { type: 'ul', items: [
            'Temps plein (35,25 h+) → 7 jours/semaine → environ 13 semaines (~3 mois)',
            '28,25–35,24 h → 5 jours/semaine → environ 18 semaines',
            '21,25–28,24 h → 4 jours/semaine → environ 22 semaines',
            '14,25–21,24 h → 3 jours/semaine → environ 30 semaines',
            '7,25–14,24 h → 2 jours/semaine → environ 44 semaines',
            '4–7,24 h → 1 jour/semaine → 88 semaines',
          ] },
          { type: 'note', text: 'Voilà pourquoi un travail à temps plein et régulier est la voie la plus rapide — et pourquoi des heures partielles éparpillées peuvent étaler « 88 jours » sur presque toute ton année de visa.' },
          { type: 'h2', text: 'Suis le calcul automatiquement' },
          { type: 'p', text: 'Le faire à la main, c’est reconstruire le tableau chaque semaine en espérant avoir bien regroupé les dates. Orary le fait pour toi : enregistre tes quarts et il les découpe en semaines du lundi au dimanche, applique cette formule exacte à chaque semaine et affiche un total en direct et une barre de progression vers 88 et 176 jours — avec tes fiches de paie et revenus suivis au même endroit comme preuve.' },
          { type: 'cta', text: 'Vois ton total de 88 jours se mettre à jour tout seul à mesure que tu enregistres tes quarts — gratuit.', label: 'Commence gratuitement', to: '/register' },
          { type: 'note', text: 'Orientation générale uniquement. Le Department of Home Affairs fixe et met à jour ces règles — confirme toujours la formule et l’éligibilité en vigueur sur immi.homeaffairs.gov.au.' },
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
    title: 'Specified Work & Eligible Postcodes for Your Second-Year Visa',
    description:
      'Not all work counts toward your 88 days, and the wrong postcode means zero progress. Here is what qualifies as specified work, which regions count, and how to check a job before you take it.',
    date: '2026-06-15',
    readingTime: 7,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      {
        type: 'p',
        text: "You can work 88 days straight and still not qualify for a second year — if the **job type** or the **postcode** doesn't count. Two things have to be true at the same time: the work must be an eligible **specified work** category, and it must be in an eligible **regional area**. Get either wrong and those days are worth zero.",
      },
      { type: 'h2', text: 'What counts as specified work' },
      {
        type: 'ul',
        items: [
          'Plant and animal cultivation — fruit picking, harvesting, pruning, planting, general farm work.',
          'Fishing and pearling.',
          'Tree farming and felling.',
          'Mining.',
          'Construction.',
          'Bushfire and flood recovery work.',
          'Since 2023, certain tourism and hospitality work in eligible regional areas.',
        ],
      },
      { type: 'h2', text: 'What usually does NOT count' },
      {
        type: 'p',
        text: 'Hospitality or retail in a **major city**, office/admin work, au pair or domestic roles, and unpaid "volunteering" for accommodation typically do not qualify. Example: waitressing in central Sydney = no. The same waitressing job in an eligible regional town (under the post-2023 hospitality rules) = potentially yes. The job title alone never tells you — the **category plus the location** does.',
      },
      { type: 'h2', text: 'Which regions count' },
      {
        type: 'table',
        headers: ['State / Territory', 'Eligible area'],
        rows: [
          ['Northern Territory', 'All of it'],
          ['South Australia', 'All of it'],
          ['Tasmania', 'All of it'],
          ['Queensland', 'Regional — excludes Greater Brisbane'],
          ['Western Australia', 'Regional — excludes Perth metro'],
          ['New South Wales', 'Regional — excludes Sydney, Newcastle, Wollongong'],
          ['Victoria', 'Regional — excludes Melbourne'],
        ],
      },
      { type: 'h2', text: 'How to check before you take a job' },
      {
        type: 'ul',
        items: [
          'Confirm the **job category** is on the current specified-work list.',
          'Check the workplace **postcode** against the eligible list published by Home Affairs.',
          'Ask the employer if they can provide **payslips** and sign a **Form 1263** — no evidence, no days.',
        ],
      },
      {
        type: 'cta',
        text: 'Log every qualifying shift and watch your 88-day total build automatically.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'Categories and postcodes change. Always confirm the current lists at immi.homeaffairs.gov.au before starting work.',
      },
    ],
    related: ['track-88-days-working-holiday-visa', 'working-holiday-visa-evidence-payslips'],
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
    readingTime: 7,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      {
        type: 'p',
        text: 'After 88 days of hard regional work, the last thing you want is a refusal over something avoidable. Almost every second-year problem traces back to one of these six mistakes — and all of them are easy to dodge if you know about them early.',
      },
      { type: 'h2', text: '1. Counting calendar days instead of visa days' },
      {
        type: 'p',
        text: 'Visa days come from your **weekly hours**, not the days you turned up. A full-time week is 7 visa days; a sub-4-hour week is 0. Example: Liam thought "88 shifts = 88 days" and stopped early — he was actually 20 visa days short.',
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
        text: 'A week under 4 hours is worth zero. Several scattered light weeks can quietly cost you a month of progress. If a week is slow, pick up enough hours to clear the 4-hour minimum.',
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
    title: 'Mileage Deductions for Delivery Riders (AU, UK, US & Canada)',
    description:
      'Every kilometre you drive for delivery can lower your tax. Here are the official cents-per-km rates for Australia, the UK, the US and Canada, with a worked example of what 200 km a week is worth.',
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
          ['United States (IRS)', '72.5¢ / mile (2026)', 'Standard business mileage'],
          ['Canada (CRA)', '72¢ / km', 'First 5,000 km, then 66¢'],
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
        text: 'Rates change every year and have conditions/caps. Confirm current figures with your tax office (ato.gov.au, gov.uk, irs.gov, canada.ca).',
      },
    ],
    related: ['tax-delivery-gig-workers-australia', 'is-delivery-driving-worth-it'],
    translations: {
      es: {
        title: 'Deducción por kilómetros para riders de delivery (AU, UK, US y Canadá)',
        description:
          'Cada kilómetro que manejás para delivery puede bajar tus impuestos. Acá están las tasas oficiales de centavos por km de Australia, Reino Unido, EE.UU. y Canadá, con un ejemplo de cuánto valen 200 km por semana.',
        content: [
          { type: 'p', text: 'Si hacés delivery, los kilómetros que manejás son plata — en la temporada de impuestos. La mayoría de las oficinas fiscales te dejan reclamar un monto fijo por kilómetro (o milla) de manejo laboral, sin necesidad de recibos de combustible. Los riders que no registran su distancia dejan plata real sobre la mesa cada semana.' },
          { type: 'h2', text: 'Cómo funciona el método de centavos por km' },
          { type: 'p', text: 'Multiplicás tus **kilómetros laborales** por la tasa oficial para obtener una deducción que baja tu ingreso gravable. Junta combustible, desgaste y costos de operación en un solo número simple — solo necesitás un registro honesto de cuánto manejaste por trabajo.' },
          { type: 'h2', text: 'Tasas oficiales por país' },
          { type: 'table', headers: ['País', 'Tasa', 'Notas'], rows: [
            ['Australia (ATO)', '~$0.88 / km', 'Método de centavos por km'],
            ['Reino Unido (HMRC)', '45p / milla', 'Primeras 10,000 millas, luego 25p'],
            ['Estados Unidos (IRS)', '72.5¢ / milla (2026)', 'Mileage estándar de negocio'],
            ['Canadá (CRA)', '72¢ / km', 'Primeros 5,000 km, luego 66¢'],
          ] },
          { type: 'h2', text: 'Ejemplo trabajado — 200 km por semana' },
          { type: 'p', text: 'Un rider de Uber Eats en Sídney maneja unos **200 km/semana** por trabajo. A la tasa de la ATO de $0.88/km eso son **$176/semana** en deducciones. En un año de 40 semanas, son **~$7,040** menos de ingreso gravable — a la tasa del 15% de working holiday, unos **$1,056** ahorrados en impuestos. De kilómetros que ibas a manejar igual.' },
          { type: 'h2', text: 'Logbook vs centavos por km' },
          { type: 'p', text: 'El método de centavos por km es el más simple y suele tener un tope de distancia reclamable. Un logbook (registrar costos reales y porcentaje de uso laboral) puede valer más si manejás mucho — pero es más trabajo. Para la mayoría de los riders part-time, centavos por km gana en esfuerzo vs recompensa.' },
          { type: 'cta', text: 'Registrá tus kilómetros por turno y mirá tu deducción estimada sumar.', label: 'Probá Orary gratis', to: '/register' },
          { type: 'note', text: 'Las tasas cambian cada año y tienen condiciones/topes. Confirmá las cifras vigentes con tu oficina fiscal (ato.gov.au, gov.uk, irs.gov, canada.ca).' },
        ],
      },
      fr: {
        title: 'Déduction kilométrique pour les livreurs (AU, UK, US et Canada)',
        description:
          'Chaque kilomètre parcouru pour la livraison peut réduire ton impôt. Voici les taux officiels au kilomètre (ou au mile) pour l’Australie, le Royaume-Uni, les États-Unis et le Canada, avec un exemple de ce que valent 200 km par semaine.',
        content: [
          { type: 'p', text: "Si tu livres, les kilomètres que tu parcours, c'est de l'argent — à la période fiscale. La plupart des administrations fiscales te laissent réclamer un montant fixe par kilomètre (ou mile) parcouru pour le travail, sans reçus de carburant. Les livreurs qui ne notent pas leur distance laissent de l'argent réel sur la table chaque semaine." },
          { type: 'h2', text: 'Comment fonctionne la méthode au kilomètre' },
          { type: 'p', text: 'Tu multiplies tes **kilomètres professionnels** par le taux officiel pour obtenir une déduction qui réduit ton revenu imposable. Elle regroupe carburant, usure et frais de fonctionnement dans un seul chiffre simple — il te faut juste un relevé honnête de la distance parcourue pour le travail.' },
          { type: 'h2', text: 'Taux officiels par pays' },
          { type: 'table', headers: ['Pays', 'Taux', 'Notes'], rows: [
            ['Australie (ATO)', '~$0.88 / km', 'Méthode au kilomètre'],
            ['Royaume-Uni (HMRC)', '45p / mile', 'Premiers 10 000 miles, puis 25p'],
            ['États-Unis (IRS)', '72,5¢ / mile (2026)', 'Mileage professionnel standard'],
            ['Canada (CRA)', '72¢ / km', 'Premiers 5 000 km, puis 66¢'],
          ] },
          { type: 'h2', text: 'Exemple chiffré — 200 km par semaine' },
          { type: 'p', text: 'Un livreur Uber Eats à Sydney parcourt environ **200 km/semaine** pour le travail. Au taux ATO de $0.88/km, cela fait **$176/semaine** de déductions. Sur une année de 40 semaines, c’est **~$7,040** de moins sur le revenu imposable — au taux working holiday de 15%, environ **$1,056** d’impôt économisés. À partir de kilomètres que tu parcourais de toute façon.' },
          { type: 'h2', text: 'Carnet de bord vs méthode au kilomètre' },
          { type: 'p', text: 'La méthode au kilomètre est la plus simple et a généralement un plafond de distance réclamable. Un carnet de bord (suivi des coûts réels et du pourcentage d’usage professionnel) peut valoir plus si tu roules beaucoup — mais c’est plus de travail. Pour la plupart des livreurs à temps partiel, la méthode au kilomètre l’emporte sur le rapport effort/récompense.' },
          { type: 'cta', text: 'Note tes kilomètres par quart et regarde ta déduction estimée s’accumuler.', label: 'Essaie Orary gratuitement', to: '/register' },
          { type: 'note', text: 'Les taux changent chaque année et ont des conditions/plafonds. Confirme les chiffres en vigueur auprès de ton administration fiscale (ato.gov.au, gov.uk, irs.gov, canada.ca).' },
        ],
      },
    },
  },

  {
    slug: 'track-delivery-earnings-multiple-apps',
    title: 'How to Track Delivery Earnings Across Uber Eats, DoorDash & Menulog',
    description:
      'Working multiple delivery apps splits your money across three dashboards and none show your real total. Here is how to bring it together, with a worked example of one multi-app week.',
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Delivery & gig',
    accent: '#F59E0B',
    content: [
      {
        type: 'p',
        text: "Smart riders run several apps at once to keep the orders flowing — but that means your earnings live in three different dashboards, each showing only its slice. Without one combined view, you can't actually tell what you made, or which app is pulling its weight.",
      },
      { type: 'h2', text: 'Why one view matters' },
      {
        type: 'p',
        text: 'You can only improve what you measure. Combine every platform and you can see your **true weekly total**, your **real hourly rate**, and — crucially — **which app earns you the most per hour** so you can lean into the good ones and drop the duds.',
      },
      { type: 'h2', text: 'What to track per platform' },
      {
        type: 'ul',
        items: [
          'Earnings (base + tips).',
          'Number of orders.',
          'Hours online.',
          'Kilometres driven.',
        ],
      },
      { type: 'h2', text: 'Worked example — one week across three apps' },
      {
        type: 'table',
        headers: ['App', 'Earnings', 'Hours', '$/hour'],
        rows: [
          ['Uber Eats', '$210', '9', '$23.3'],
          ['DoorDash', '$150', '8', '$18.8'],
          ['Menulog', '$95', '5', '$19.0'],
          ['**Total**', '**$455**', '**22**', '**$20.7**'],
        ],
      },
      {
        type: 'p',
        text: 'The combined picture says it all: **$455** for the week at **$20.70/hour** overall — but Uber Eats paid noticeably better per hour. Next week, this rider knows where to start.',
      },
      { type: 'h2', text: 'Which app is actually best for you' },
      {
        type: 'p',
        text: 'It varies by city, time and day — there’s no universal answer. The only reliable method is to track a few weeks across all your apps and let the per-hour numbers decide for you.',
      },
      {
        type: 'cta',
        text: 'Add a platform to each session and Orary breaks down your earnings by app.',
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
          'Trabajar con varias apps de delivery reparte tu plata en tres paneles y ninguno muestra tu total real. Acá está cómo unirlo todo, con un ejemplo trabajado de una semana multi-app.',
        content: [
          { type: 'p', text: 'Los riders inteligentes manejan varias apps a la vez para mantener el flujo de pedidos — pero eso significa que tus ganancias viven en tres paneles distintos, cada uno mostrando solo su parte. Sin una vista combinada, no podés saber realmente cuánto hiciste, ni qué app está rindiendo.' },
          { type: 'h2', text: 'Por qué importa una sola vista' },
          { type: 'p', text: 'Solo podés mejorar lo que medís. Combiná todas las plataformas y vas a ver tu **total semanal real**, tu **tarifa por hora real** y — lo más importante — **qué app te paga más por hora**, para apostar a las buenas y soltar las que no rinden.' },
          { type: 'h2', text: 'Qué registrar por plataforma' },
          { type: 'ul', items: [
            'Ganancias (base + propinas).',
            'Cantidad de pedidos.',
            'Horas online.',
            'Kilómetros manejados.',
          ] },
          { type: 'h2', text: 'Ejemplo trabajado — una semana entre tres apps' },
          { type: 'table', headers: ['App', 'Ganancias', 'Horas', '$/hora'], rows: [
            ['Uber Eats', '$210', '9', '$23.3'],
            ['DoorDash', '$150', '8', '$18.8'],
            ['Menulog', '$95', '5', '$19.0'],
            ['**Total**', '**$455**', '**22**', '**$20.7**'],
          ] },
          { type: 'p', text: 'La foto combinada lo dice todo: **$455** en la semana a **$20.70/hora** en general — pero Uber Eats pagó notablemente mejor por hora. La semana que viene, este rider ya sabe por dónde empezar.' },
          { type: 'h2', text: 'Qué app es realmente la mejor para vos' },
          { type: 'p', text: 'Varía según la ciudad, la hora y el día — no hay una respuesta universal. El único método confiable es registrar unas semanas entre todas tus apps y dejar que los números por hora decidan por vos.' },
          { type: 'cta', text: 'Agregá una plataforma a cada sesión y Orary desglosa tus ganancias por app.', label: 'Probá Orary gratis', to: '/register' },
          { type: 'note', text: 'Las cifras son ejemplos ilustrativos — tus tarifas reales dependen de tu ciudad y tus turnos.' },
        ],
      },
      fr: {
        title: 'Comment suivre tes revenus de livraison entre Uber Eats, DoorDash et Menulog',
        description:
          'Travailler sur plusieurs apps de livraison éparpille ton argent sur trois tableaux de bord, et aucun ne montre ton vrai total. Voici comment tout rassembler, avec un exemple chiffré d’une semaine multi-apps.',
        content: [
          { type: 'p', text: "Les livreurs malins font tourner plusieurs apps à la fois pour garder le flux de commandes — mais cela signifie que tes revenus vivent sur trois tableaux de bord différents, chacun n'affichant que sa part. Sans une vue combinée, tu ne peux pas vraiment savoir ce que tu as gagné, ni quelle app tire son épingle du jeu." },
          { type: 'h2', text: 'Pourquoi une vue unique compte' },
          { type: 'p', text: 'Tu ne peux améliorer que ce que tu mesures. Combine toutes les plateformes et tu verras ton **vrai total hebdomadaire**, ton **taux horaire réel** et — surtout — **quelle app te rapporte le plus par heure**, pour miser sur les bonnes et lâcher les mauvaises.' },
          { type: 'h2', text: 'Quoi suivre par plateforme' },
          { type: 'ul', items: [
            'Revenus (base + pourboires).',
            'Nombre de commandes.',
            'Heures en ligne.',
            'Kilomètres parcourus.',
          ] },
          { type: 'h2', text: 'Exemple chiffré — une semaine sur trois apps' },
          { type: 'table', headers: ['App', 'Revenus', 'Heures', '$/heure'], rows: [
            ['Uber Eats', '$210', '9', '$23.3'],
            ['DoorDash', '$150', '8', '$18.8'],
            ['Menulog', '$95', '5', '$19.0'],
            ['**Total**', '**$455**', '**22**', '**$20.7**'],
          ] },
          { type: 'p', text: 'L’image combinée dit tout : **$455** sur la semaine à **$20.70/heure** au global — mais Uber Eats a payé nettement mieux par heure. La semaine prochaine, ce livreur sait par où commencer.' },
          { type: 'h2', text: 'Quelle app est vraiment la meilleure pour toi' },
          { type: 'p', text: 'Ça varie selon la ville, l’heure et le jour — il n’y a pas de réponse universelle. La seule méthode fiable est de suivre quelques semaines sur toutes tes apps et de laisser les chiffres horaires décider pour toi.' },
          { type: 'cta', text: 'Ajoute une plateforme à chaque session et Orary répartit tes revenus par app.', label: 'Essaie Orary gratuitement', to: '/register' },
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
    title: 'Working Holiday Visa in New Zealand: how it works (and the 3-month extension)',
    description:
      "New Zealand's Working Holiday Visa works differently from Australia's 88-day rule. Here is how long you can stay, who can extend, and exactly what work earns the 3-month extension.",
    date: '2026-06-15',
    readingTime: 6,
    tag: 'Working Holiday Visa',
    accent: '#6366F1',
    content: [
      {
        type: 'p',
        text: "If you've heard about Australia's 88 days, forget it for New Zealand — the rules here are different. There's no second-year work requirement in the same way. Instead, you get up to 12 months (longer for a few nationalities), and a one-time **3-month extension** if you do the right seasonal work.",
      },
      { type: 'h2', text: 'How long you can stay' },
      {
        type: 'p',
        text: 'Most Working Holidaymakers get a **12-month** visa. Some nationalities (for example UK citizens) can stay longer under their specific agreement. If your total stay reaches 24 months or more, you’ll need to provide police certificates.',
      },
      { type: 'h2', text: 'The 3-month extension' },
      {
        type: 'p',
        text: 'If you work in the **horticulture or viticulture** industry for at least **3 months**, you can apply to stay another **3 months** (a "Working Holiday Extension"). The work doesn’t need to be continuous or with the same employer — but you only get this extension **once**.',
      },
      { type: 'h2', text: 'What work qualifies (and what does not)' },
      {
        type: 'p',
        text: 'Qualifying work is **planting, maintaining, harvesting or packing** crops in horticulture or viticulture. Work outside those tasks — like plant nurseries, or food processing and manufacturing — does **not** count. So picking and packing grapes counts; working in a winery’s bottling line may not.',
      },
      { type: 'h2', text: 'Australia vs New Zealand at a glance' },
      {
        type: 'table',
        headers: ['', 'Australia', 'New Zealand'],
        rows: [
          ['Standard length', '12 months', '12 months'],
          ['Extension trigger', '88 days specified regional work', '3 months horticulture/viticulture'],
          ['Counts as', 'Visa days from weekly hours', 'Calendar months of work'],
          ['Repeatable', '2nd & 3rd year', 'One extension only'],
        ],
      },
      {
        type: 'cta',
        text: 'Track your shifts and earnings in New Zealand — free, no credit card.',
        label: 'Start tracking free',
        to: '/register',
      },
      {
        type: 'note',
        text: 'General guidance only. Confirm current rules at immigration.govt.nz.',
      },
    ],
    related: ['track-88-days-working-holiday-visa', 'new-zealand-ird-tax-backpackers'],
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
