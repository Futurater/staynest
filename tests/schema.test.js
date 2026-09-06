const { listingSchema, reviewSchema } = require("../schema.js");

describe("Joi Schema Validation Tests", () => {
  describe("listingSchema", () => {
    test("should validate a complete, valid listing payload", () => {
      const validPayload = {
        listing: {
          title: "Nordic Minimalist Sanctuary",
          description: "An architectural wonder perched in the fjords.",
          price: 2400,
          location: "Tromsø",
          country: "Norway",
          category: "Cabins",
          image: {
            url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            filename: "nordic_retreat",
          },
        },
      };

      const { error, value } = listingSchema.validate(validPayload);
      expect(error).toBeUndefined();
      expect(value.listing.title).toBe("Nordic Minimalist Sanctuary");
      expect(value.listing.price).toBe(2400);
      expect(value.listing.category).toBe("Cabins");
    });

    test("should fail validation if title is missing", () => {
      const invalidPayload = {
        listing: {
          description: "Missing title here",
          price: 1500,
          location: "Kyoto",
          country: "Japan",
        },
      };

      const { error } = listingSchema.validate(invalidPayload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/title.*required/i);
    });

    test("should fail validation if price is negative", () => {
      const invalidPayload = {
        listing: {
          title: "Brutalist Concrete Villa",
          description: "Concrete and light interplay in perfection.",
          price: -100,
          location: "Berlin",
          country: "Germany",
        },
      };

      const { error } = listingSchema.validate(invalidPayload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/price.*must be greater than or equal to 0/i);
    });

    test("should fail validation if category is invalid", () => {
      const invalidPayload = {
        listing: {
          title: "Floating Glass Cube",
          description: "Modern architectural feat.",
          price: 3200,
          location: "Zurich",
          country: "Switzerland",
          category: "UnderwaterSpaceship",
        },
      };

      const { error } = listingSchema.validate(invalidPayload);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/category.*must be one of/i);
    });

    test("should assign default 'Trending' category if none specified", () => {
      const payload = {
        listing: {
          title: "Desert Monolith",
          description: "Ram-earthen residence designed by world-class architects.",
          price: 1800,
          location: "Scottsdale",
          country: "United States",
        },
      };

      const { error, value } = listingSchema.validate(payload);
      expect(error).toBeUndefined();
      expect(value.listing.category).toBe("Trending");
    });
  });

  describe("reviewSchema", () => {
    test("should validate a valid review payload with rating between 1 and 5", () => {
      const validReview = {
        review: {
          rating: 5,
          comment: "Architectural perfection. Light and materiality were unmatched.",
        },
      };

      const { error, value } = reviewSchema.validate(validReview);
      expect(error).toBeUndefined();
      expect(value.review.rating).toBe(5);
    });

    test("should fail if rating is less than 1", () => {
      const invalidReview = {
        review: {
          rating: 0,
          comment: "Subpar finishings.",
        },
      };

      const { error } = reviewSchema.validate(invalidReview);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/rating.*must be greater than or equal to 1/i);
    });

    test("should fail if rating is greater than 5", () => {
      const invalidReview = {
        review: {
          rating: 6,
          comment: "Beyond exceptional.",
        },
      };

      const { error } = reviewSchema.validate(invalidReview);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/rating.*must be less than or equal to 5/i);
    });

    test("should fail if comment is missing", () => {
      const invalidReview = {
        review: {
          rating: 4,
        },
      };

      const { error } = reviewSchema.validate(invalidReview);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/comment.*required/i);
    });
  });
});
