/* =====================================================================
   SUNSA — site settings
   This is the ONLY code file you normally need to edit.
   ===================================================================== */

window.SUNSA = {

  /* Cloudinary "cloud name" — shown on your Cloudinary dashboard (top left). */
  cloudName: "vycwgmay",

  /* Google Sheet ID — the long code in the Sheet's address:
     https://docs.google.com/spreadsheets/d/  THIS_PART  /edit
     The Sheet must be shared as "Anyone with the link: Viewer". */
  sheetId: "18Dgkj1s9CtBRblt0X4KYEMcnvV7MedpyVgmJjHuwJXg",

  photosPerPage: 50,

  /* ---------------------------------------------------------------
     STUDIES — pages with notes + links + photos.
       slug    : short name used in the web address; notes live in content/<slug>.md
       title   : name shown on the site (also what you type in the Sheet's Category column)
       tag     : the Cloudinary TAG on this study's photos (capitals don't matter)
       pigment : just decoration — the swatch colour on the card
     --------------------------------------------------------------- */
  studies: [
    { slug: "edges",         title: "Edges",         tag: "edges",         pigment: ["#5a3a24", "Burnt Umber"] },
    { slug: "shadows",       title: "Shadows & Washes", tag: "shadows",       pigment: ["#26305e", "Ultramarine"] },
    { slug: "color",         title: "Color Work",    tag: "color_work",    pigment: ["#c8562a", "Cadmium Orange"] },
    { slug: "human-imagery", title: "Human Imagery", tag: "human_imagery", pigment: ["#c98f72", "Flesh Tint"] },
    { slug: "mountains",     title: "Mountains",     tag: "mountains",     pigment: ["#5d6b7a", "Payne's Grey"] },
    { slug: "beaches",       title: "Beaches",       tag: "beaches",       pigment: ["#d9b77a", "Naples Yellow"] },
    { slug: "alleyways",     title: "Alleyways",     tag: "alleyways",     pigment: ["#8a4b3a", "Venetian Red"] },
    { slug: "sky-clouds",    title: "Sky / Clouds",  tag: "sky_clouds",    pigment: ["#7fa8c9", "Cerulean"] },
    { slug: "rocks",         title: "Rocks",         tag: "rocks",         pigment: ["#8b7d6b", "Raw Umber"] },
    { slug: "trees",         title: "Trees",         tag: "trees",         pigment: ["#4f6b35", "Sap Green"] },
    { slug: "water",         title: "Water",         tag: "water",         pigment: ["#2f6f73", "Phthalo Turquoise"] },
    { slug: "flowers",       title: "Flowers",       tag: "flowers",       pigment: ["#b03a6e", "Quinacridone Magenta"] }
  ],

  /* ---------------------------------------------------------------
     PHOTO-ONLY folders — photos, no notes.
     tag = the Cloudinary TAG on those photos.
     --------------------------------------------------------------- */
  collections: [
    { slug: "asia-africa",   title: "Asia & Africa",  tag: "asia_africa" },
    { slug: "other-artists", title: "Other Artists",  tag: "other_artists" },
    { slug: "travel",        title: "Travel",         tag: "travel_pics" },
    { slug: "treetop-ridge", title: "Treetop Ridge",  tag: "treetop_ridge" }
  ],

  /* Used only if the Google Sheet can't be reached (or isn't set up yet). */
  fallbackLinks: [
    ["https://www.patreon.com/cw/paintwithkevin", "Kevin Hill", "Artists"],
    ["https://www.michaeljamessmith.com/mjs-tv", "Michael James Smith", "Artists"],
    ["https://www.patreon.com/cw/staycreativepainting", "Ryan O'Rourke", "Artists"],
    ["https://www.patreon.com/cw/johnsilverart", "John Silver", "Artists"],
    ["https://www.youtube.com/@philstarke.artist", "Phil Starke", "Artists"],
    ["https://www.painters-academy.com/acrylic-painting-from-beginner-to-master", "Painters Academy — Acrylic, Beginner to Master", "Courses"],
    ["https://www.udemy.com/topic/acrylic-painting/", "Udemy — Acrylic Painting Courses", "Courses"],
    ["https://youtu.be/ma-knl2Bu6s", "Hard & Soft Edges in Portraits", "Edges"],
    ["https://www.youtube.com/watch?v=giUACK8XwDI&t=228s", "5 Tips to Hard & Soft Edges", "Edges"],
    ["https://www.youtube.com/watch?v=C0YkHg52k-4", "5 Methods of Blending", "Edges"],
    ["https://www.youtube.com/watch?v=8g-_7OWQTQw", "Glazing — How To", "Edges"],
    ["https://www.youtube.com/watch?v=kNN2dHWKKaQ", "Blending Using Layers", "Edges"]
  ]
};
