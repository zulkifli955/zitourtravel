import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // add other tables here

    tours: defineTable({
      name: v.string(), // display name of the tour package
      slug: v.string(), // url-ish identifier
      tagline: v.string(), // one-line pitch shown on cards
      description: v.string(), // full description shown in the tour detail view
      category: v.string(), // browse filter, e.g. "City & Culture"
      imageUrl: v.string(), // hero photo for the card / detail view
      price: v.number(), // price in Indonesian Rupiah, per person
      durationHours: v.number(), // typical duration in hours
      location: v.string(), // area of Batam where the tour runs
      rating: v.number(), // average review score 0-5
      reviewCount: v.number(), // number of reviews
      highlights: v.array(v.string()), // bullet points for the detail view
      includes: v.array(v.string()), // what's included in the price
      availableDays: v.array(v.string()), // e.g. ["Sat", "Sun"]
      featured: v.boolean(), // shown in the featured section
      sortOrder: v.number(), // controls display order in the grid
    })
      .index("by_category", ["category"])
      .index("by_featured", ["featured"])
      .index("by_slug", ["slug"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
