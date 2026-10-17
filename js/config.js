/* =====================================================================
   SUNSA — site settings
   This is the ONLY code file you normally need to edit.
   ===================================================================== */

window.SUNSA = {

  /* Cloudinary "cloud name" — shown on your Cloudinary dashboard (top left). */
  cloudName: "vycwgmay",

  /* Links file in this repo — columns Link, Title, Category.
     Edit it on github.com (pencil icon) or in Excel, then upload. */
  linksFile: "links.csv",

  photosPerPage: 50,

  /* ---------------------------------------------------------------
     STUDIES — pages with notes + links + photos.
       slug    : short name used in the web address; notes live in content/<slug>.md
       title   : name shown on the site (also what you type in links.csv's Category column)
       tag     : the Cloudinary TAG on this study's photos (capitals don't matter)
       pigment : just decoration — the swatch colour on the card
     --------------------------------------------------------------- */
  studies: [
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
     TECHNICAL — how-to pages for a method (impasto, glazing…).
     Same fields as Studies; notes live in content/<slug>.md,
     links.csv uses the title as Category, photos use the tag.
     --------------------------------------------------------------- */
  techniques: [
    { slug: "edges",         title: "Edges",         tag: "edges",         pigment: ["#5a3a24", "Burnt Umber"] },
    { slug: "shadows",       title: "Shadows",       tag: "shadows",       pigment: ["#26305e", "Ultramarine"] },
    { slug: "color",         title: "Color Work",    tag: "color_work",    pigment: ["#c8562a", "Cadmium Orange"] },
    { slug: "impasto", title: "Impasto", tag: "impasto", pigment: ["#c9a24a", "Yellow Ochre"] },
    { slug: "glazing", title: "Glazing & Washes", tag: "glazing", pigment: ["#4a3470", "Dioxazine Purple"] },
    { slug: "underpainting", title: "Underpainting & Toned Ground", tag: "underpainting", pigment: ["#a0522d", "Burnt Sienna"] }
  ],

  /* NEXT UP — the "to paint next" photo folder shown under Courses on the home page.
     tag = the Cloudinary TAG on those photos. */
  nextUp: { slug: "next-up", title: "Next Up", tag: "next_up" },

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

  /* Used only if links.csv can't be read. */
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
    ["https://www.youtube.com/watch?v=8g-_7OWQTQw", "Glazing — How To", "Glazing"],
    ["https://www.youtube.com/watch?v=kNN2dHWKKaQ", "Blending Using Layers", "Edges"]
  ]
};
