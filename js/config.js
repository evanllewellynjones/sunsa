/* =====================================================================
   SUNSA — site settings
   This is the ONLY code file you normally need to edit.
   ===================================================================== */

window.SUNSA = {

  /* Cloudinary "cloud name" — shown on your Cloudinary dashboard (top left). */
  cloudName: cloudName: "vycwgmay",

  /* Google Sheet ID — the long code in the Sheet's address:
     https://docs.google.com/spreadsheets/d/  THIS_PART  /edit
     The Sheet must be shared as "Anyone with the link: Viewer". */
  sheetId: "18Dgkj1s9CtBRblt0X4KYEMcnvV7MedpyVgmJjHuwJXg",

  photosPerPage: 50,

  /* ---------------------------------------------------------------
     STUDIES — pages with notes + links + photos.
       slug    : short name used in web addresses and as the Cloudinary TAG for its photos
       title   : name shown on the site (also what you type in the Sheet's Category column)
       pigment : just decoration — the swatch colour on the card
     Notes for each study live in  content/<slug>.md
     --------------------------------------------------------------- */
  studies: [
    { slug: "edges",         title: "Edges",         pigment: ["#5a3a24", "Burnt Umber"] },
    { slug: "shadows",       title: "Shadows",       pigment: ["#26305e", "Ultramarine"] },
    { slug: "color",         title: "Color Work",    pigment: ["#c8562a", "Cadmium Orange"] },
    { slug: "human-imagery", title: "Human Imagery", pigment: ["#c98f72", "Flesh Tint"] },
    { slug: "mountains",     title: "Mountains",     pigment: ["#5d6b7a", "Payne's Grey"] },
    { slug: "beaches",       title: "Beaches",       pigment: ["#d9b77a", "Naples Yellow"] },
    { slug: "alleyways",     title: "Alleyways",     pigment: ["#8a4b3a", "Venetian Red"] },
    { slug: "sky-clouds",    title: "Sky / Clouds",  pigment: ["#7fa8c9", "Cerulean"] },
    { slug: "rocks",         title: "Rocks",         pigment: ["#8b7d6b", "Raw Umber"] },
    { slug: "trees",         title: "Trees",         pigment: ["#4f6b35", "Sap Green"] },
    { slug: "water",         title: "Water",         pigment: ["#2f6f73", "Phthalo Turquoise"] }
  ],

  /* ---------------------------------------------------------------
     PHOTO-ONLY collections — photos, no notes.
     slug = the Cloudinary TAG to put on those photos.
     --------------------------------------------------------------- */
  collections: [
    { slug: "asian",         title: "Asian" },
    { slug: "copenhagen",    title: "Copenhagen" },
    { slug: "norway",        title: "Norway" },
    { slug: "treetop",       title: "Treetop" },
    { slug: "other-artists", title: "Other Artist Examples" },
    { slug: "murals",        title: "Murals" }
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
