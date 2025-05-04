import { db } from "./index";
import * as schema from "@shared/schema";

// System requirements template
const defaultMinRequirements = {
  OS: "Windows 10",
  Processor: "INTEL CORE I5-8400 or AMD RYZEN 3 3300X",
  Memory: "12 GB RAM",
  Graphics: "NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB",
  Storage: "60 GB available space"
};

const defaultRecommendedRequirements = {
  OS: "Windows 10/11",
  Processor: "INTEL CORE I7-8700K or AMD RYZEN 5 3600X",
  Memory: "16 GB RAM",
  Graphics: "NVIDIA GEFORCE GTX 1070 8 GB or AMD RADEON RX VEGA 56 8 GB",
  Storage: "60 GB available space"
};

const systemRequirements = {
  minimum: defaultMinRequirements,
  recommended: defaultRecommendedRequirements
};

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Clear existing data (be careful in production)
    console.log("Clearing existing data...");
    await db.delete(schema.transactionGames);
    await db.delete(schema.transactions);
    await db.delete(schema.userLibrary);
    await db.delete(schema.cartItems);
    await db.delete(schema.screenshots);
    await db.delete(schema.gameCategories);
    await db.delete(schema.games);
    await db.delete(schema.categories);
    await db.delete(schema.users);

    console.log("Inserting demo user...");
    // Create a demo user
    const [demoUser] = await db.insert(schema.users)
      .values({
        username: "demo_user",
        password: "password123", // In a real app, this would be hashed
        email: "demo@example.com"
      })
      .returning();

    console.log("Inserting game categories...");
    // Insert categories
    const categoriesData = [
      { name: "Action", description: "Fast-paced and intense gameplay" },
      { name: "Adventure", description: "Exploration and puzzle-solving" },
      { name: "RPG", description: "Role-playing and character development" },
      { name: "Strategy", description: "Planning and tactical gameplay" },
      { name: "Simulation", description: "Realistic mechanics and experiences" },
      { name: "Sports", description: "Competitive athletic activities" },
      { name: "Racing", description: "Vehicle competition and driving" },
      { name: "Indie", description: "Independent developer games" },
      { name: "Multiplayer", description: "Online competitive and cooperative play" },
      { name: "FPS", description: "First-person shooter games" },
      { name: "Open World", description: "Large explorable environments" },
      { name: "Souls-like", description: "Challenging combat with RPG elements" }
    ];

    const insertedCategories = await db.insert(schema.categories)
      .values(categoriesData)
      .returning();

    console.log("Inserting games...");
    // Insert games
    const gamesData = [
      {
        title: "Elden Ring",
        shortDescription: "A vast world where open fields with a variety of situations and huge dungeons with complex designs are seamlessly connected",
        description: `THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.

A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected. As you explore, the joy of discovering unknown and overwhelming threats await you, leading to a high sense of accomplishment.

Create your character, determine your playstyle, and immerse yourself in a world full of wonder and peril. The path to becoming Elden Lord will be challenging but rewarding.`,
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg?t=1683618675",
        price: 44.99,
        originalPrice: 59.99,
        discount: 25,
        releaseDate: new Date("2022-02-25"),
        developer: "FromSoftware Inc.",
        publisher: "Bandai Namco",
        languages: "English, Japanese, French, German, Italian, Spanish",
        isFeatured: false,
        isSpecialOffer: true,
        isNewRelease: false,
        isPopular: false,
        systemRequirements
      },
      {
        title: "Cyberpunk 2077",
        shortDescription: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification",
        description: "Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival. Improved and featuring all-new free additional content, customize your character and playstyle as you take on jobs, build a reputation, and unlock upgrades. The relationships you forge and the choices you make will shape the story and the world around you. Legends are made here. What will yours be?",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg?t=1686849726",
        price: 39.99,
        originalPrice: 59.99,
        discount: 33,
        releaseDate: new Date("2020-12-10"),
        developer: "CD PROJEKT RED",
        publisher: "CD PROJEKT RED",
        languages: "English, French, Italian, German, Spanish, Polish, Portuguese, Russian, Japanese, Chinese",
        isFeatured: false,
        isSpecialOffer: true,
        isNewRelease: false,
        isPopular: false,
        systemRequirements
      },
      {
        title: "God of War",
        shortDescription: "Enter the Norse realm. His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters.",
        description: "Enter the Norse realm. His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive… and teach his son to do the same.",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg?t=1650554420",
        price: 39.99,
        originalPrice: 49.99,
        discount: 20,
        releaseDate: new Date("2022-01-14"),
        developer: "Santa Monica Studio",
        publisher: "PlayStation PC LLC",
        languages: "English, French, Italian, German, Spanish, Japanese, Korean, Polish, Portuguese, Russian, Turkish",
        isFeatured: false,
        isSpecialOffer: true,
        isNewRelease: false,
        isPopular: false,
        systemRequirements
      },
      {
        title: "Resident Evil 4",
        shortDescription: "Survival is just the beginning. With modern gameplay, a reimagined storyline, and detailed graphics, Resident Evil 4 is reborn",
        description: "Survival is just the beginning. Six years have passed since the biological disaster in Raccoon City. Leon S. Kennedy, one of the survivors, tracks the president's kidnapped daughter to a secluded European village, where there is something terribly wrong with the locals.",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg?t=1682624042",
        price: 50.99,
        originalPrice: 59.99,
        discount: 15,
        releaseDate: new Date("2023-03-24"),
        developer: "CAPCOM Co., Ltd.",
        publisher: "CAPCOM Co., Ltd.",
        languages: "English, French, Italian, German, Spanish, Japanese, Korean, Polish, Portuguese, Russian, Chinese",
        isFeatured: false,
        isSpecialOffer: true,
        isNewRelease: false,
        isPopular: false,
        systemRequirements
      },
      {
        title: "Starfield",
        shortDescription: "In this next generation role-playing game, create any character you want and explore with unparalleled freedom",
        description: "Starfield is the first new universe in 25 years from Bethesda Game Studios, the award-winning creators of The Elder Scrolls V: Skyrim and Fallout 4. In this next generation role-playing game set amongst the stars, create any character you want and explore with unparalleled freedom as you embark on an epic journey to answer humanity's greatest mystery.",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg?t=1685745137",
        price: 69.99,
        originalPrice: 69.99,
        discount: 0,
        releaseDate: new Date("2023-09-06"),
        developer: "Bethesda Game Studios",
        publisher: "Bethesda Softworks",
        languages: "English, French, German, Spanish, Italian, Japanese, Polish, Portuguese, Russian, Chinese",
        isFeatured: false,
        isSpecialOffer: false,
        isNewRelease: true,
        isPopular: false,
        systemRequirements
      },
      {
        title: "Hogwarts Legacy",
        shortDescription: "Experience Hogwarts in the 1800s. Your character is a student who holds the key to an ancient secret that threatens to tear the wizarding world apart",
        description: "Hogwarts Legacy is an immersive, open-world action RPG set in the world first introduced in the Harry Potter books. Embark on a journey through familiar and new locations as you explore and discover fantastic beasts, customize your character and craft potions, master spell casting, upgrade talents, and become the wizard you want to be.",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg?t=1687383930",
        price: 59.99,
        originalPrice: 59.99,
        discount: 0,
        releaseDate: new Date("2023-02-10"),
        developer: "Avalanche Software",
        publisher: "Warner Bros. Games",
        languages: "English, French, Italian, German, Spanish, Japanese, Korean, Polish, Portuguese, Russian, Chinese",
        isFeatured: false,
        isSpecialOffer: false,
        isNewRelease: true,
        isPopular: false,
        systemRequirements
      },
      {
        title: "Street Fighter 6",
        shortDescription: "Here comes the newest challenger in the Street Fighter series! The fighting game begins a new era!",
        description: "Street Fighter 6 spans three distinct game modes, including World Tour, Fighting Ground and Battle Hub. Diverse play options combine with expanded gameplay features and the new Modern Control Type to make Street Fighter 6 accessible to players of all skill levels.",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1919590/header.jpg?t=1686847726",
        price: 59.99,
        originalPrice: 59.99,
        discount: 0,
        releaseDate: new Date("2023-06-02"),
        developer: "CAPCOM Co., Ltd.",
        publisher: "CAPCOM Co., Ltd.",
        languages: "English, French, Italian, German, Spanish, Japanese, Korean, Portuguese, Russian, Chinese",
        isFeatured: false,
        isSpecialOffer: false,
        isNewRelease: true,
        isPopular: false,
        systemRequirements
      },
      {
        title: "Diablo IV",
        shortDescription: "Fight for humanity's salvation in Diablo IV, the ultimate action RPG adventure",
        description: "Join the fight for humanity's salvation in Diablo IV, the ultimate action RPG experience. A new chapter of the Diablo saga is here: a choice of 5 classes, an expansive open world, formidable hostile families, and unimaginable nightmares waiting to be vanquished.",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg?t=1686838243",
        price: 69.99,
        originalPrice: 69.99,
        discount: 0,
        releaseDate: new Date("2023-06-06"),
        developer: "Blizzard Entertainment",
        publisher: "Blizzard Entertainment",
        languages: "English, French, Italian, German, Spanish, Japanese, Korean, Polish, Portuguese, Russian, Chinese",
        isFeatured: false,
        isSpecialOffer: false,
        isNewRelease: true,
        isPopular: false,
        systemRequirements
      },
      {
        title: "Grand Theft Auto V",
        shortDescription: "Experience Rockstar Games' critically acclaimed open world game. The ever-evolving online version comes included.",
        description: "Grand Theft Auto V for PC offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond, as well as the chance to experience the game running at 60 frames per second.",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg?t=1678296348",
        price: 29.99,
        originalPrice: 29.99,
        discount: 0,
        releaseDate: new Date("2015-04-14"),
        developer: "Rockstar North",
        publisher: "Rockstar Games",
        languages: "English, French, Italian, German, Spanish, Japanese, Korean, Polish, Portuguese, Russian, Chinese",
        isFeatured: false,
        isSpecialOffer: false,
        isNewRelease: false,
        isPopular: true,
        systemRequirements
      },
      {
        title: "Dota 2",
        shortDescription: "Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes",
        description: "Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes. And no matter if it's their 10th hour of play or 1,000th, there's always something new to discover. With regular updates that ensure a constant evolution of gameplay, features, and heroes, Dota 2 has taken on a life of its own.",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg?t=1682639497",
        price: 0,
        originalPrice: 0,
        discount: 0,
        releaseDate: new Date("2013-07-09"),
        developer: "Valve",
        publisher: "Valve",
        languages: "English, French, German, Spanish, Italian, Russian, Chinese, Japanese, Korean, Portuguese",
        isFeatured: false,
        isSpecialOffer: false,
        isNewRelease: false,
        isPopular: true,
        systemRequirements
      },
      {
        title: "Apex Legends",
        shortDescription: "A free-to-play battle royale game where legendary competitors battle for glory, fame, and fortune",
        description: "Apex Legends is the award-winning, free-to-play Hero Shooter from Respawn Entertainment. Conquer with character in Apex Legends, a free-to-play Hero Shooter where legendary characters with powerful abilities team up to battle for fame & fortune on the fringes of the Frontier.",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg?t=1683150208",
        price: 0,
        originalPrice: 0,
        discount: 0,
        releaseDate: new Date("2020-11-04"),
        developer: "Respawn Entertainment",
        publisher: "Electronic Arts",
        languages: "English, French, German, Spanish, Italian, Japanese, Korean, Polish, Portuguese, Russian, Chinese",
        isFeatured: true,
        isSpecialOffer: false,
        isNewRelease: false,
        isPopular: true,
        systemRequirements
      },
      {
        title: "Counter-Strike: Global Offensive",
        shortDescription: "A team-based first-person shooter game pitting two teams against each other: the Terrorists and the Counter-Terrorists",
        description: "Counter-Strike: Global Offensive (CS: GO) expands upon the team-based action gameplay that it pioneered when it was launched 19 years ago. CS: GO features new maps, characters, weapons, and game modes, and delivers updated versions of the classic CS content.",
        headerImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg?t=1683566506",
        price: 0,
        originalPrice: 0,
        discount: 0,
        releaseDate: new Date("2012-08-21"),
        developer: "Valve",
        publisher: "Valve",
        languages: "English, French, German, Spanish, Italian, Japanese, Korean, Polish, Portuguese, Russian, Chinese",
        isFeatured: false,
        isSpecialOffer: false,
        isNewRelease: false,
        isPopular: true,
        systemRequirements
      }
    ];

    // Insert games
    const insertedGames = await db.insert(schema.games)
      .values(gamesData)
      .returning();

    console.log("Assigning game categories...");
    // Assign categories to games
    const gameCategoriesData = [
      // Elden Ring
      { gameId: insertedGames[0].id, categoryId: insertedCategories.find(c => c.name === "RPG")!.id },
      { gameId: insertedGames[0].id, categoryId: insertedCategories.find(c => c.name === "Action")!.id },
      { gameId: insertedGames[0].id, categoryId: insertedCategories.find(c => c.name === "Open World")!.id },
      { gameId: insertedGames[0].id, categoryId: insertedCategories.find(c => c.name === "Souls-like")!.id },
      
      // Cyberpunk 2077
      { gameId: insertedGames[1].id, categoryId: insertedCategories.find(c => c.name === "RPG")!.id },
      { gameId: insertedGames[1].id, categoryId: insertedCategories.find(c => c.name === "Open World")!.id },
      { gameId: insertedGames[1].id, categoryId: insertedCategories.find(c => c.name === "Action")!.id },
      
      // God of War
      { gameId: insertedGames[2].id, categoryId: insertedCategories.find(c => c.name === "Action")!.id },
      { gameId: insertedGames[2].id, categoryId: insertedCategories.find(c => c.name === "Adventure")!.id },
      
      // Resident Evil 4
      { gameId: insertedGames[3].id, categoryId: insertedCategories.find(c => c.name === "Action")!.id },
      { gameId: insertedGames[3].id, categoryId: insertedCategories.find(c => c.name === "Adventure")!.id },
      
      // Starfield
      { gameId: insertedGames[4].id, categoryId: insertedCategories.find(c => c.name === "RPG")!.id },
      { gameId: insertedGames[4].id, categoryId: insertedCategories.find(c => c.name === "Open World")!.id },
      { gameId: insertedGames[4].id, categoryId: insertedCategories.find(c => c.name === "Adventure")!.id },
      
      // Hogwarts Legacy
      { gameId: insertedGames[5].id, categoryId: insertedCategories.find(c => c.name === "RPG")!.id },
      { gameId: insertedGames[5].id, categoryId: insertedCategories.find(c => c.name === "Open World")!.id },
      { gameId: insertedGames[5].id, categoryId: insertedCategories.find(c => c.name === "Adventure")!.id },
      
      // Street Fighter 6
      { gameId: insertedGames[6].id, categoryId: insertedCategories.find(c => c.name === "Action")!.id },
      { gameId: insertedGames[6].id, categoryId: insertedCategories.find(c => c.name === "Multiplayer")!.id },
      
      // Diablo IV
      { gameId: insertedGames[7].id, categoryId: insertedCategories.find(c => c.name === "RPG")!.id },
      { gameId: insertedGames[7].id, categoryId: insertedCategories.find(c => c.name === "Action")!.id },
      { gameId: insertedGames[7].id, categoryId: insertedCategories.find(c => c.name === "Multiplayer")!.id },
      
      // Grand Theft Auto V
      { gameId: insertedGames[8].id, categoryId: insertedCategories.find(c => c.name === "Action")!.id },
      { gameId: insertedGames[8].id, categoryId: insertedCategories.find(c => c.name === "Open World")!.id },
      { gameId: insertedGames[8].id, categoryId: insertedCategories.find(c => c.name === "Multiplayer")!.id },
      
      // Dota 2
      { gameId: insertedGames[9].id, categoryId: insertedCategories.find(c => c.name === "Strategy")!.id },
      { gameId: insertedGames[9].id, categoryId: insertedCategories.find(c => c.name === "Multiplayer")!.id },
      
      // Apex Legends
      { gameId: insertedGames[10].id, categoryId: insertedCategories.find(c => c.name === "FPS")!.id },
      { gameId: insertedGames[10].id, categoryId: insertedCategories.find(c => c.name === "Multiplayer")!.id },
      { gameId: insertedGames[10].id, categoryId: insertedCategories.find(c => c.name === "Action")!.id },
      
      // Counter-Strike: Global Offensive
      { gameId: insertedGames[11].id, categoryId: insertedCategories.find(c => c.name === "FPS")!.id },
      { gameId: insertedGames[11].id, categoryId: insertedCategories.find(c => c.name === "Multiplayer")!.id },
      { gameId: insertedGames[11].id, categoryId: insertedCategories.find(c => c.name === "Action")!.id }
    ];

    await db.insert(schema.gameCategories)
      .values(gameCategoriesData);

    console.log("Adding game screenshots...");
    // Add screenshots for games
    const screenshotsData = [
      // Elden Ring screenshots
      { gameId: insertedGames[0].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_e80a907c2c43337e53316c71555c3c3035a1343e.jpg" },
      { gameId: insertedGames[0].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_c372a517856a462d1a7a2e438cd5c7a76faa31d8.jpg" },
      { gameId: insertedGames[0].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_8b5be7ef5213fa53c786132c317bd6b43d18e5e2.jpg" },
      { gameId: insertedGames[0].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_eb131176775366dbb555dae5057a89f997d16d85.jpg" },
      
      // Cyberpunk 2077 screenshots
      { gameId: insertedGames[1].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_84f85cfe8a6ad763d4f7c7444fc9dd75b9fd8bba.jpg" },
      { gameId: insertedGames[1].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_d28af00a6a1d9f36abbfc690393fec65f0c86537.jpg" },
      { gameId: insertedGames[1].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_9284d1c5b148a948ebe7ffc1f1121b06e0a5eebf.jpg" },
      { gameId: insertedGames[1].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_b529e4cb8ef2bc0e138b75f63fa1ce21c487e4ce.jpg" },
      
      // Apex Legends screenshots  
      { gameId: insertedGames[10].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/ss_2f24571d106cbe49b68a142e5e5474e5c12b03c3.jpg" },
      { gameId: insertedGames[10].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/ss_ad14a7a36b9288aff1ae9ab600ecc3f5bc4309a1.jpg" },
      { gameId: insertedGames[10].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/ss_b5627aca62aef0b66d197b087aa9baf3a2988c8f.jpg" },
      { gameId: insertedGames[10].id, url: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/ss_ecaef8580ce257f43d3d7176a4cf8c77961f7b04.jpg" }
    ];

    await db.insert(schema.screenshots)
      .values(screenshotsData);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
