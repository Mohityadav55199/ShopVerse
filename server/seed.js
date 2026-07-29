const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Product = require("./models/Product");
const Review = require("./models/Review");
const Order = require("./models/Order");
const Cart = require("./models/Cart");
const Settings = require("./models/Settings");

// Sample users data
const users = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    active: true,
    createdAt: new Date(),
  },
  {
    username: "vendor",
    email: "vendor@example.com",
    password: "password123",
    role: "vendor",
    active: true,
    createdAt: new Date(),
  },
  {
    username: "customer",
    email: "customer@example.com",
    password: "password123",
    role: "customer",
    active: true,
    createdAt: new Date(),
    shippingAddress: {
      street: "123 Main Street",
      city: "Bucharest",
      postalCode: "12345",
      country: "Romania",
    },
  },
  {
    username: "user",
    email: "user@example.com",
    password: "password123",
    role: "customer",
    active: true,
    createdAt: new Date(),
  },
];

// Sample product categories
const categories = [
  "electronics",
  "clothing",
  "home",
  "books",
  "sports",
  "beauty",
  "toys",
];

// Sample product data with multiple images
const products = [
  // Electronics Category - FEATURED CAROUSEL ITEMS (first 3 products)
  // These will be marked for Cloudinary integration
  {
    name: "Smartphone X (5G 128GB)",
    description:
      "Latest smartphone with high-end features including 6.5-inch Super AMOLED display, 128GB storage, and 48MP AI camera. Fast charging and IP68 water resistance.",
    price: 69999,
    imageUrl:
      "https://res.cloudinary.com/dadvdmnvb/image/upload/v1744832008/smartphone-main.png",
    images: [
      "https://res.cloudinary.com/dadvdmnvb/image/upload/v1744832008/smartphone-front.png",
      "https://res.cloudinary.com/dadvdmnvb/image/upload/v1744832008/smartphone-side.png",
      "https://res.cloudinary.com/dadvdmnvb/image/upload/v1744832007/smartphone-back.png",
    ],
    imagePublicId: "smartphone-main",
    imagesPublicIds: [
      "smartphone-front",
      "smartphone-side",
      "smartphone-back",
    ],
    category: "electronics",
    stock: 25,
    featured: true,
  },
  {
    name: "Laptop Pro (16GB RAM / 512GB SSD)",
    description:
      "Powerful laptop with 16GB RAM, 512GB SSD, Intel Core i7, and dedicated NVIDIA RTX graphics card perfect for Indian creators and gamers.",
    price: 119999,
    imageUrl:
      "https://res.cloudinary.com/dadvdmnvb/image/upload/v1744832006/laptop-main.png",
    images: [
      "https://res.cloudinary.com/dadvdmnvb/image/upload/v1744832005/laptop-open.png",
      "https://res.cloudinary.com/dadvdmnvb/image/upload/v1744832004/laptop-side.png",
      "https://res.cloudinary.com/dadvdmnvb/image/upload/v1744832004/laptop-ports-right.png",
      "https://res.cloudinary.com/dadvdmnvb/image/upload/v1744832004/laptop-ports-left.png",
    ],
    imagePublicId: "laptop-main",
    imagesPublicIds: [
      "laptop-open",
      "laptop-side",
      "laptop-ports-right",
      "laptop-ports-left",
    ],
    category: "electronics",
    stock: 15,
    featured: true,
  },
  {
    name: "Sony Wireless Noise Cancelling Headphones",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life, high-resolution audio, and deep bass. Perfect for commuting.",
    price: 14999,
    imageUrl:
      "https://res.cloudinary.com/dadvdmnvb/image/upload/v1744832004/headphones-main.png",
    images: [],
    imagePublicId: "headphones-main",
    category: "electronics",
    stock: 40,
    featured: true,
  },
  {
    name: "4K Ultra HD Smart TV (55 inch)",
    description:
      "55-inch 4K Ultra HD Smart TV with Dolby Vision, HDR10+, and built-in streaming apps (Hotstar, Prime, Netflix). Perfect for home entertainment.",
    price: 42999,
    imageUrl: "https://dummyimage.com/400x300/444/fff&text=4K+Smart+TV",
    images: [
      "https://dummyimage.com/400x300/444/fff&text=TV+Side",
      "https://dummyimage.com/400x300/444/fff&text=TV+Ports",
      "https://dummyimage.com/400x300/444/fff&text=TV+Remote",
    ],
    category: "electronics",
    stock: 18,
  },
  {
    name: "boAt Airdopes 141 TWS Earbuds",
    description:
      "True wireless earbuds with 42H playtime, Beast Mode for gaming, ENx Tech, and IPX4 water resistance.",
    price: 1299,
    imageUrl: "https://dummyimage.com/400x300/555/fff&text=boAt+Airdopes",
    images: [
      "https://dummyimage.com/400x300/555/fff&text=Earbuds+Open",
      "https://dummyimage.com/400x300/555/fff&text=Earbuds+Fit",
    ],
    category: "electronics",
    stock: 50,
  },
  {
    name: "Fastrack Limitless Smartwatch",
    description:
      "Ultra-large 1.91-inch display smartwatch with BT calling, 100+ sports modes, and 7-day battery backup.",
    price: 1799,
    imageUrl: "https://dummyimage.com/400x300/333/fff&text=Fastrack+Smartwatch",
    images: [],
    category: "electronics",
    stock: 30,
  },

  // Clothing Category
  {
    name: "FabIndia Pure Cotton Kurta",
    description:
      "Handcrafted 100% pure cotton straight knee-length kurta with mandarin collar and full sleeves. Classic traditional fit.",
    price: 2199,
    imageUrl: "https://dummyimage.com/400x300/666/fff&text=Cotton+Kurta",
    images: [
      "https://dummyimage.com/400x300/666/fff&text=Kurta+Detail",
      "https://dummyimage.com/400x300/666/fff&text=Kurta+Back",
    ],
    category: "clothing",
    stock: 60,
  },
  {
    name: "Men's Premium Denim Jeans",
    description:
      "Slim-fit stretch denim jeans crafted for comfort and durability. Deep indigo wash suitable for everyday wear.",
    price: 1999,
    imageUrl: "https://dummyimage.com/400x300/777/fff&text=Denim+Jeans",
    images: [
      "https://dummyimage.com/400x300/777/fff&text=Jeans+Back",
    ],
    category: "clothing",
    stock: 75,
  },
  {
    name: "Puma Sports Running Shoes",
    description:
      "Lightweight athletic shoes with SoftFoam+ comfort sockliner and durable rubber outsole for high performance.",
    price: 3499,
    imageUrl: "https://dummyimage.com/400x300/888/fff&text=Puma+Shoes",
    images: [
      "https://dummyimage.com/400x300/888/fff&text=Shoes+Top",
    ],
    category: "clothing",
    stock: 50,
  },

  // Home Category
  {
    name: "Prestige Induction Cooktop 2000W",
    description:
      "Indian menu presets, dual heat sensors, push-button controls, and automatic voltage regulator.",
    price: 2695,
    imageUrl: "https://dummyimage.com/400x300/bbb/fff&text=Prestige+Induction",
    images: [],
    category: "home",
    stock: 25,
  },
  {
    name: "Sheesham Wood Coffee Table",
    description:
      "Handcrafted solid Sheesham wood coffee table with honey finish. Brings natural warmth and timeless style to living rooms.",
    price: 8999,
    imageUrl: "https://dummyimage.com/400x300/ccc/333&text=Wooden+Table",
    images: [],
    category: "home",
    stock: 12,
  },
  {
    name: "100% Cotton King Double Bed Sheet Set",
    description:
      "Soft 210 TC cotton double bedsheet with 2 matching pillow covers. Breathable and machine washable.",
    price: 1499,
    imageUrl: "https://dummyimage.com/400x300/ddd/333&text=Bedsheet+Set",
    images: [],
    category: "home",
    stock: 40,
  },

  // Books Category
  {
    name: "Atomic Habits by James Clear",
    description:
      "An easy & proven way to build good habits & break bad ones. The million-copy bestseller.",
    price: 499,
    imageUrl: "https://dummyimage.com/400x300/000/fff&text=Atomic+Habits",
    images: [],
    category: "books",
    stock: 100,
  },
  {
    name: "The Psychology of Money by Morgan Housel",
    description:
      "Timeless lessons on wealth, greed, and happiness. Essential reading for personal finance.",
    price: 399,
    imageUrl: "https://dummyimage.com/400x300/222/fff&text=Psychology+of+Money",
    images: [],
    category: "books",
    stock: 80,
  },
  {
    name: "Self-Help Book",
    description:
      "Guide to personal development and achieving your goals with practical exercises and proven techniques.",
    price: 18.99,
    imageUrl: "https://dummyimage.com/400x300/333/fff&text=Self-Help+Cover",
    images: [
      "https://dummyimage.com/400x300/333/fff&text=Self-Help+Back",
      "https://dummyimage.com/400x300/333/fff&text=Self-Help+Chapter",
      "https://dummyimage.com/400x300/333/fff&text=Self-Help+Exercise",
    ],
    category: "books",
    stock: 45,
  },
  {
    name: "History Book",
    description:
      "Comprehensive history of the modern world with detailed accounts of major events and their impact on society.",
    price: 29.99,
    imageUrl: "https://dummyimage.com/400x300/444/fff&text=History+Cover",
    images: [
      "https://dummyimage.com/400x300/444/fff&text=History+Back",
      "https://dummyimage.com/400x300/444/fff&text=History+Photos",
      "https://dummyimage.com/400x300/444/fff&text=History+Timeline",
    ],
    category: "books",
    stock: 22,
  },
  {
    name: "Science Book",
    description:
      "Exploration of modern scientific discoveries and theories, written for the general reader with beautiful illustrations.",
    price: 27.99,
    imageUrl: "https://dummyimage.com/400x300/555/fff&text=Science+Cover",
    images: [
      "https://dummyimage.com/400x300/555/fff&text=Science+Back",
      "https://dummyimage.com/400x300/555/fff&text=Science+Diagram",
      "https://dummyimage.com/400x300/555/fff&text=Science+Chapter",
    ],
    category: "books",
    stock: 18,
  },

  // Sports Category
  {
    name: "Yoga Mat",
    description:
      "Non-slip yoga mat made from eco-friendly materials. Perfect thickness for joint protection and stability during practice.",
    price: 29.99,
    imageUrl: "https://dummyimage.com/400x300/666/fff&text=Yoga+Mat+Rolled",
    images: [
      "https://dummyimage.com/400x300/666/fff&text=Yoga+Mat+Open",
      "https://dummyimage.com/400x300/666/fff&text=Yoga+Mat+Texture",
      "https://dummyimage.com/400x300/666/fff&text=Yoga+Mat+Colors",
    ],
    category: "sports",
    stock: 40,
  },
  {
    name: "Dumbbells Set",
    description:
      "Set of adjustable dumbbells ranging from 5 to 25 lbs. Compact design perfect for home workouts and strength training.",
    price: 149.99,
    imageUrl: "https://dummyimage.com/400x300/777/fff&text=Dumbbells+Set",
    images: [
      "https://dummyimage.com/400x300/777/fff&text=Dumbbells+Single",
      "https://dummyimage.com/400x300/777/fff&text=Dumbbells+Weights",
      "https://dummyimage.com/400x300/777/fff&text=Dumbbells+Adjustment",
    ],
    category: "sports",
    stock: 15,
  },
  {
    name: "Basketball",
    description:
      "Official size and weight basketball with superior grip and durability. Suitable for indoor and outdoor play.",
    price: 24.99,
    imageUrl: "https://dummyimage.com/400x300/888/fff&text=Basketball+Front",
    images: [
      "https://dummyimage.com/400x300/888/fff&text=Basketball+Grip",
      "https://dummyimage.com/400x300/888/fff&text=Basketball+Valve",
      "https://dummyimage.com/400x300/888/fff&text=Basketball+Logo",
    ],
    category: "sports",
    stock: 30,
  },
  {
    name: "Tennis Racket",
    description:
      "Professional tennis racket with balanced weight distribution and optimal string tension for powerful shots.",
    price: 89.99,
    imageUrl: "https://dummyimage.com/400x300/999/fff&text=Racket+Front",
    images: [
      "https://dummyimage.com/400x300/999/fff&text=Racket+Back",
      "https://dummyimage.com/400x300/999/fff&text=Racket+Grip",
      "https://dummyimage.com/400x300/999/fff&text=Racket+Strings",
    ],
    category: "sports",
    stock: 20,
  },
  {
    name: "Fitness Tracker",
    description:
      "Advanced fitness tracker with heart rate monitor, GPS, and sleep tracking. Waterproof and with long battery life.",
    price: 79.99,
    imageUrl: "https://dummyimage.com/400x300/aaa/fff&text=Tracker+Front",
    images: [
      "https://dummyimage.com/400x300/aaa/fff&text=Tracker+Side",
      "https://dummyimage.com/400x300/aaa/fff&text=Tracker+Back",
      "https://dummyimage.com/400x300/aaa/fff&text=Tracker+Screen",
      "https://dummyimage.com/400x300/aaa/fff&text=Tracker+Charger",
    ],
    category: "sports",
    stock: 25,
  },

  // Beauty Category
  {
    name: "Skincare Set",
    description:
      "Complete skincare regimen including cleanser, toner, serum, and moisturizer. Made with natural ingredients for all skin types.",
    price: 59.99,
    imageUrl: "https://dummyimage.com/400x300/bbb/fff&text=Skincare+Set",
    images: [
      "https://dummyimage.com/400x300/bbb/fff&text=Skincare+Cleanser",
      "https://dummyimage.com/400x300/bbb/fff&text=Skincare+Toner",
      "https://dummyimage.com/400x300/bbb/fff&text=Skincare+Serum",
      "https://dummyimage.com/400x300/bbb/fff&text=Skincare+Moisturizer",
    ],
    category: "beauty",
    stock: 20,
  },
  {
    name: "Hair Dryer",
    description:
      "Professional hair dryer with multiple heat and speed settings. Includes diffuser and concentrator attachments.",
    price: 49.99,
    imageUrl: "https://dummyimage.com/400x300/ccc/333&text=Hairdryer+Side",
    images: [
      "https://dummyimage.com/400x300/ccc/333&text=Hairdryer+Front",
      "https://dummyimage.com/400x300/ccc/333&text=Hairdryer+Back",
      "https://dummyimage.com/400x300/ccc/333&text=Hairdryer+Attachments",
    ],
    category: "beauty",
    stock: 15,
  },
  {
    name: "Makeup Palette",
    description:
      "Versatile eyeshadow palette with 24 highly pigmented colors. Mix of matte and shimmer finishes for endless looks.",
    price: 34.99,
    imageUrl: "https://dummyimage.com/400x300/ddd/333&text=Palette+Closed",
    images: [
      "https://dummyimage.com/400x300/ddd/333&text=Palette+Open",
      "https://dummyimage.com/400x300/ddd/333&text=Palette+Swatches",
      "https://dummyimage.com/400x300/ddd/333&text=Palette+Mirror",
    ],
    category: "beauty",
    stock: 30,
  },
  {
    name: "Electric Shaver",
    description:
      "Precision electric shaver with multiple cutting elements. Suitable for wet and dry use with up to 60 minutes of cordless operation.",
    price: 89.99,
    imageUrl: "https://dummyimage.com/400x300/eee/333&text=Shaver+Front",
    images: [
      "https://dummyimage.com/400x300/eee/333&text=Shaver+Head",
      "https://dummyimage.com/400x300/eee/333&text=Shaver+Charger",
      "https://dummyimage.com/400x300/eee/333&text=Shaver+Case",
    ],
    category: "beauty",
    stock: 22,
  },
  {
    name: "Perfume",
    description:
      "Elegant perfume with notes of jasmine, vanilla, and sandalwood. Long-lasting fragrance in a beautiful glass bottle.",
    price: 69.99,
    imageUrl: "https://dummyimage.com/400x300/fff/333&text=Perfume+Bottle",
    images: [
      "https://dummyimage.com/400x300/fff/333&text=Perfume+Box",
      "https://dummyimage.com/400x300/fff/333&text=Perfume+Spray",
      "https://dummyimage.com/400x300/fff/333&text=Perfume+Set",
    ],
    category: "beauty",
    stock: 18,
  },

  // Toys Category
  {
    name: "Building Blocks Set",
    description:
      "Creative building blocks set with 500+ pieces in various colors and shapes. Compatible with all major building block brands.",
    price: 29.99,
    imageUrl: "https://dummyimage.com/400x300/000/fff&text=Blocks+Set",
    images: [
      "https://dummyimage.com/400x300/000/fff&text=Blocks+Built",
      "https://dummyimage.com/400x300/000/fff&text=Blocks+Colors",
      "https://dummyimage.com/400x300/000/fff&text=Blocks+Storage",
    ],
    category: "toys",
    stock: 25,
  },
  {
    name: "Remote Control Car",
    description:
      "High-speed remote control car with durable construction and responsive controls. Battery provides up to 30 minutes of play time.",
    price: 39.99,
    imageUrl: "https://dummyimage.com/400x300/222/fff&text=RC+Car+Side",
    images: [
      "https://dummyimage.com/400x300/222/fff&text=RC+Car+Front",
      "https://dummyimage.com/400x300/222/fff&text=RC+Car+Controller",
      "https://dummyimage.com/400x300/222/fff&text=RC+Car+Battery",
    ],
    category: "toys",
    stock: 20,
  },
  {
    name: "Stuffed Animal",
    description:
      "Soft and cuddly stuffed animal made with high-quality plush material. Safe for all ages and machine washable.",
    price: 19.99,
    imageUrl:
      "https://dummyimage.com/400x300/333/fff&text=Stuffed+Animal+Front",
    images: [
      "https://dummyimage.com/400x300/333/fff&text=Stuffed+Animal+Side",
      "https://dummyimage.com/400x300/333/fff&text=Stuffed+Animal+Back",
      "https://dummyimage.com/400x300/333/fff&text=Stuffed+Animal+Face",
    ],
    category: "toys",
    stock: 35,
  },
  {
    name: "Board Game",
    description:
      "Family board game suitable for 2-6 players. Combines strategy and luck for hours of entertainment. Ages 8 and up.",
    price: 24.99,
    imageUrl: "https://dummyimage.com/400x300/444/fff&text=Board+Game+Box",
    images: [
      "https://dummyimage.com/400x300/444/fff&text=Board+Game+Board",
      "https://dummyimage.com/400x300/444/fff&text=Board+Game+Pieces",
      "https://dummyimage.com/400x300/444/fff&text=Board+Game+Cards",
    ],
    category: "toys",
    stock: 15,
  },
  {
    name: "Art Set",
    description:
      "Complete art set with colored pencils, markers, paints, and drawing paper. Perfect for young artists and creative activities.",
    price: 22.99,
    imageUrl: "https://dummyimage.com/400x300/555/fff&text=Art+Set+Box",
    images: [
      "https://dummyimage.com/400x300/555/fff&text=Art+Set+Open",
      "https://dummyimage.com/400x300/555/fff&text=Art+Set+Pencils",
      "https://dummyimage.com/400x300/555/fff&text=Art+Set+Paints",
    ],
    category: "toys",
    stock: 28,
  },
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    return true;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Generate a random date within the last 30 days
const getRandomDate = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(
    thirtyDaysAgo.getTime() +
      Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
  );
};

// Generate a mock Stripe payment intent ID
const generateMockPaymentIntentId = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "pi_";
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Seed database function
const seedDatabase = async (clearDB = false) => {
  try {
    // Connect to the database
    await connectDB();

    if (clearDB) {
      // Clear existing data
      console.log("Clearing existing data...");
      await User.deleteMany({});
      await Product.deleteMany({});
      await Order.deleteMany({});
      await Cart.deleteMany({});
      console.log("Database cleared.");
    }

    console.log("Starting database seeding...");

    // Seed users - IMPORTANT: Manually hash passwords instead of relying on pre-save hook
    console.log("Seeding users...");
    const createdUsers = [];
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        // Manually hash the password with 10 salt rounds
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Create user with pre-hashed password and explicitly set fields
        const user = await User.create({
          ...userData,
          password: hashedPassword,
          active: true, // Explicitly set active status
          createdAt: new Date(), // Explicitly set creation date
        });

        createdUsers.push(user);
        console.log(`User created: ${user.username} (${user.role})`);
        console.log(`  - Active: ${user.active}`);
        console.log(`  - Created At: ${user.createdAt}`);
      } else {
        // For existing users, ensure password is correctly hashed and update fields
        let needsUpdate = false;

        // Test if the password is already hashed by attempting to compare
        try {
          const isMatch = await bcrypt.compare(
            userData.password,
            existingUser.password
          );
          if (!isMatch) {
            needsUpdate = true;
          }
        } catch (error) {
          // If error during comparison, the password is likely not properly hashed
          needsUpdate = true;
        }

        // Check if active status and createdAt needs update
        if (existingUser.active !== true || !existingUser.createdAt) {
          needsUpdate = true;
        }

        if (needsUpdate) {
          // Update with properly hashed password and other fields
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(userData.password, salt);

          existingUser.password = hashedPassword;
          existingUser.active = true; // Ensure active is true

          // Set createdAt if it doesn't exist
          if (!existingUser.createdAt) {
            existingUser.createdAt = new Date();
          }

          await existingUser.save();
          console.log(`User updated: ${existingUser.username}`);
          console.log(`  - Active: ${existingUser.active}`);
          console.log(`  - Created At: ${existingUser.createdAt}`);
        } else {
          console.log(
            `User already exists with correct settings: ${existingUser.username} (${existingUser.role})`
          );
          console.log(`  - Active: ${existingUser.active}`);
          console.log(`  - Created At: ${existingUser.createdAt}`);
        }

        createdUsers.push(existingUser);
      }

      // Verify the password hash works
      const user = await User.findOne({ email: userData.email });
      const passwordValid = await bcrypt.compare(
        userData.password,
        user.password
      );
      if (passwordValid) {
        console.log(`✓ Password verification successful for ${user.username}`);
      } else {
        console.error(`✗ Password verification FAILED for ${user.username}`);
      }
    }

    // Seed products
    console.log("Seeding products...");
    const createdProducts = [];

    for (const productData of products) {
      try {
        const existingProduct = await Product.findOne({
          name: productData.name,
        });

        if (!existingProduct) {
          // For new products, make sure to include Cloudinary fields
          // The first 5 featured products already have these placeholders
          // For others, initialize with empty values
          const productToCreate = { ...productData };

          // Add Cloudinary fields if not already present
          if (!productToCreate.hasOwnProperty("imagePublicId")) {
            productToCreate.imagePublicId = ""; // Empty for non-featured products
          }

          if (!productToCreate.hasOwnProperty("imagesPublicIds")) {
            // Create empty array matching the length of images array
            productToCreate.imagesPublicIds = Array(
              productToCreate.images?.length || 0
            ).fill("");
          }

          const product = await Product.create(productToCreate);
          createdProducts.push(product);
          console.log(`Product created: ${product.name} (${product.category})`);
        } else {
          // Update existing product
          existingProduct.description = productData.description;
          existingProduct.price = productData.price;
          existingProduct.imageUrl = productData.imageUrl;
          existingProduct.images = productData.images || [];
          existingProduct.category = productData.category;
          existingProduct.stock = productData.stock;
          existingProduct.featured = productData.featured || false;

          // Update Cloudinary fields
          if (productData.imagePublicId) {
            existingProduct.imagePublicId = productData.imagePublicId;
          } else if (!existingProduct.imagePublicId) {
            existingProduct.imagePublicId = "";
          }

          if (productData.imagesPublicIds) {
            existingProduct.imagesPublicIds = productData.imagesPublicIds;
          } else if (
            !existingProduct.imagesPublicIds ||
            existingProduct.imagesPublicIds.length !==
              existingProduct.images.length
          ) {
            // Ensure imagesPublicIds array matches images array length
            existingProduct.imagesPublicIds = Array(
              existingProduct.images.length
            ).fill("");
          }

          await existingProduct.save();
          createdProducts.push(existingProduct);
          console.log(
            `Product updated: ${existingProduct.name} (${existingProduct.category})`
          );
        }
      } catch (error) {
        console.error(
          `Error creating/updating product ${productData.name}:`,
          error
        );
      }
    }

    // Seed orders (for regular user)
    const regularUser = createdUsers.find((user) => user.role === "user");

    // Only create orders if they don't exist for this user already
    const existingOrders = await Order.countDocuments({
      user: regularUser._id,
    });

    if (existingOrders === 0) {
      console.log("Seeding orders...");

      // Create some sample orders
      const numberOfOrders = 5; // Increased from 3 to 5 for better testing
      for (let i = 0; i < numberOfOrders; i++) {
        // Randomly select 1-4 products
        const numProducts = Math.floor(Math.random() * 4) + 1;
        const orderProducts = [];
        const usedProductIds = new Set();

        for (let j = 0; j < numProducts; j++) {
          let randomProduct;

          // Ensure we don't add the same product twice
          do {
            randomProduct =
              createdProducts[
                Math.floor(Math.random() * createdProducts.length)
              ];
          } while (usedProductIds.has(randomProduct._id.toString()));

          usedProductIds.add(randomProduct._id.toString());

          // Random quantity between 1 and 3
          const quantity = Math.floor(Math.random() * 3) + 1;

          orderProducts.push({
            product: randomProduct._id,
            name: randomProduct.name,
            quantity: quantity,
            price: randomProduct.price,
          });
        }

        // Calculate total
        const total = orderProducts.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Random status
        const statuses = ["pending", "processing", "shipped", "delivered"];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Randomly choose between credit_card and cash_on_delivery
        const paymentMethods = ["credit_card", "cash_on_delivery"];
        const paymentMethod =
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

        // Create order object
        const orderData = {
          user: regularUser._id,
          items: orderProducts,
          total: total,
          shippingAddress: {
            street: "123 Main St",
            city: "Anytown",
            postalCode: "12345",
            country: "Country",
          },
          paymentMethod: paymentMethod,
          status: status,
          createdAt: getRandomDate(),
        };

        // Add payment details for credit card orders
        if (paymentMethod === "credit_card") {
          orderData.paymentDetails = {
            paymentIntentId: generateMockPaymentIntentId(),
            paymentStatus: "succeeded",
          };
        }

        // Create the order
        const order = await Order.create(orderData);

        console.log(
          `Order created: ${order._id} (${status}) with ${numProducts} products, payment: ${paymentMethod}`
        );
      }
    } else {
      console.log(
        `${existingOrders} orders already exist for user ${regularUser.username}.`
      );
    }

    // Seed settings
    console.log("Checking for settings...");

    // Check and create carousel settings
    const carouselSettings = await Settings.findOne({ key: "carousel" });
    if (!carouselSettings) {
      console.log("Creating carousel settings...");
      await Settings.create({
        key: "carousel",
        value: {
          autoPlay: true,
          interval: 3000,
        },
      });
      console.log("Carousel settings created");
    } else {
      console.log("Carousel settings already exist");
    }

    console.log("Database seeding completed successfully!");

    // Print login credentials for quick testing
    console.log("\n----- TEST ACCOUNTS -----");
    for (const user of users) {
      console.log(
        `${user.role.toUpperCase()}: Email: ${user.email}, Password: ${
          user.password
        }`
      );
    }
    console.log("-----------------------\n");

    return true;
  } catch (err) {
    console.error("Error seeding database:", err);
    return false;
  } finally {
    // Disconnect from database if run directly from CLI
    if (require.main === module && mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  }
};

// Check for command line arguments
if (require.main === module) {
  // This script is being run directly
  const clearDB = process.argv.includes("--clear");

  seedDatabase(clearDB)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else {
  // This script is being required/imported
  module.exports = seedDatabase;
}
