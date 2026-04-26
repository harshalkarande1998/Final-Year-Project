const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting tailored seed generation...')

  // 1. Seed Categories
  const categories = [
    { name: 'Groceries', slug: 'groceries', color: '#10b981', order: 1, storeType: 'GROCERY', image: '/uploads/grocery_dairy.png' },
    { name: 'Vegetables', slug: 'vegetables', color: '#3b82f6', order: 2, storeType: 'GROCERY', image: '/uploads/grocery_veg.png' },
    { name: 'Fruits', slug: 'fruits', color: '#8b5cf6', order: 3, storeType: 'GROCERY', image: '/uploads/grocery_fruits.png' },
    { name: 'Dairy', slug: 'dairy', color: '#f59e0b', order: 4, storeType: 'GROCERY', image: '/uploads/grocery_dairy.png' },
    
    { name: 'Pizzas', slug: 'pizzas', color: '#ef4444', order: 1, storeType: 'RESTAURANT', image: '/uploads/pizza_icon.png' },
    { name: 'Burgers', slug: 'burgers', color: '#f97316', order: 2, storeType: 'RESTAURANT', image: '/uploads/burger_icon.png' },
    { name: 'Desserts', slug: 'desserts', color: '#ec4899', order: 4, storeType: 'RESTAURANT', image: '/uploads/food_desserts.png' },
    { name: 'Indian', slug: 'indian', color: '#f59e0b', order: 5, storeType: 'RESTAURANT', image: '/uploads/landing_food_banner.png' },
  ]

  const categoryMap = {}
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
    categoryMap[cat.slug] = created.id
  }
  console.log('Categories seeded')

  const passwordHash = await bcrypt.hash('password123', 10)

  // Clear existing to avoid duplicates when running multiple times
  await prisma.product.deleteMany({})
  await prisma.vendorProfile.deleteMany({})
  await prisma.user.deleteMany({ where: { role: 'vendor' } })
  console.log('Cleared existing vendor data')

  // Data Generators
  const adjectives = ['Spicy', 'Royal', 'Urban', 'Classic', 'Golden']
  const nouns = ['Bites', 'Kitchen', 'Cafe', 'Diner', 'Bistro']
  
  const dishPrefixes = ['Special', 'Classic', 'Spicy', 'Double', 'Supreme', 'Deluxe', 'Premium', 'Jumbo']
  const pizzaNames = ['Margherita', 'Pepperoni', 'Veggie Supreme', 'Chicken Tikka', 'BBQ Meat', 'Cheese Burst', 'Farmhouse', 'Hawaiian']
  const burgerNames = ['Beef Burger', 'Crispy Chicken', 'Veggie Patty', 'Mushroom Swiss', 'Bacon King', 'Fish Fillet', 'Spicy Paneer']
  const dessertNames = ['Chocolate Cake', 'Vanilla Ice Cream', 'Brownie Sundae', 'Cheesecake', 'Fruit Tart', 'Waffles', 'Donut']
  const indianNames = ['Butter Chicken', 'Paneer Tikka', 'Biryani', 'Dal Makhani', 'Naan', 'Chole Bhature', 'Rajma Chawal']

  const restImages = ['/uploads/rest_royal.png', '/uploads/rest_urban.png', '/uploads/rest_classic.png', '/uploads/rest_golden.png', '/uploads/rest_spicy.png']

  const generateRestaurant = (index) => {
    const name = `${adjectives[(index - 1) % adjectives.length]} ${nouns[(index - 1) % nouns.length]}`
    const imgUrl = restImages[(index - 1) % restImages.length]
    
    // Generate 10-15 products per restaurant
    const products = []
    const categoriesList = ['pizzas', 'burgers', 'desserts', 'indian']
    
    for (let i = 0; i < 12; i++) {
      const catSlug = categoriesList[i % categoriesList.length]
      let baseName = ''
      
      if (catSlug === 'pizzas') baseName = pizzaNames[i % pizzaNames.length]
      if (catSlug === 'burgers') baseName = burgerNames[i % burgerNames.length]
      if (catSlug === 'desserts') baseName = dessertNames[i % dessertNames.length]
      if (catSlug === 'indian') baseName = indianNames[i % indianNames.length]

      let img = '/uploads/landing_food_banner.png'
      if (catSlug === 'pizzas') img = '/uploads/pizza_icon.png'
      if (catSlug === 'burgers') img = '/uploads/burger_icon.png'
      if (catSlug === 'desserts') img = '/uploads/food_desserts.png'

      products.push({
        name: `${dishPrefixes[i % dishPrefixes.length]} ${baseName}`,
        description: `Delicious and freshly prepared ${baseName} made with premium ingredients.`,
        price: Math.floor(Math.random() * 400) + 99,
        image: img,
        categorySlug: catSlug
      })
    }

    return {
      email: `restaurant${index}@localswig.com`,
      name: name,
      profile: {
        shopName: name,
        storeType: 'RESTAURANT',
        address: `${Math.floor(Math.random() * 999)} Main Street, Block ${index}`,
        phone: `555-01${index.toString().padStart(2, '0')}`,
        image: imgUrl
      },
      products
    }
  }

  // Grocery Data
  const groceryNouns = ['Mart', 'Store', 'Supermarket', 'Bazaar', 'Fresh']
  const vegNames = ['Tomatoes 1kg', 'Onions 1kg', 'Potatoes 2kg', 'Fresh Spinach', 'Carrots 500g', 'Broccoli 1pc']
  const fruitNames = ['Apples 1kg', 'Bananas 1 Dozen', 'Oranges 1kg', 'Grapes 500g', 'Mangoes 1kg', 'Watermelon 1pc']
  const dairyNames = ['Fresh Milk 1L', 'Butter 500g', 'Cheese Slices', 'Paneer 200g', 'Yogurt 400g', 'Eggs 1 Dozen']

  const groceryImages = ['/uploads/grocery_royal.png', '/uploads/grocery_urban.png', '/uploads/grocery_classic.png', '/uploads/grocery_golden.png', '/uploads/grocery_spicy.png']

  const generateGrocery = (index) => {
    const name = `${adjectives[(index - 1) % adjectives.length]} ${groceryNouns[(index - 1) % groceryNouns.length]}`
    const imgUrl = groceryImages[(index - 1) % groceryImages.length]
    
    const products = []
    const categoriesList = ['vegetables', 'fruits', 'dairy', 'groceries']
    
    for (let i = 0; i < 15; i++) {
      const catSlug = categoriesList[i % categoriesList.length]
      let baseName = ''
      
      if (catSlug === 'vegetables') baseName = vegNames[i % vegNames.length]
      if (catSlug === 'fruits') baseName = fruitNames[i % fruitNames.length]
      if (catSlug === 'dairy' || catSlug === 'groceries') baseName = dairyNames[i % dairyNames.length]

      let img = '/uploads/grocery_dairy.png'
      if (catSlug === 'vegetables') img = '/uploads/grocery_veg.png'
      if (catSlug === 'fruits') img = '/uploads/grocery_fruits.png'

      products.push({
        name: baseName,
        description: `Farm fresh and authentic ${baseName}.`,
        price: Math.floor(Math.random() * 200) + 40,
        image: img,
        categorySlug: catSlug
      })
    }

    return {
      email: `grocery${index}@localswig.com`,
      name: name,
      profile: {
        shopName: name,
        storeType: 'GROCERY',
        address: `${Math.floor(Math.random() * 999)} Market Road, Sector ${index}`,
        phone: `555-02${index.toString().padStart(2, '0')}`,
        image: imgUrl
      },
      products
    }
  }

  // Generate 5 Restaurants
  console.log('Generating 5 restaurants with custom AI pictures...')
  for (let i = 1; i <= 5; i++) {
    const vData = generateRestaurant(i)
    
    const user = await prisma.user.create({
      data: {
        email: vData.email,
        name: vData.name,
        password: passwordHash,
        role: 'vendor',
        vendorProfiles: {
          create: vData.profile
        }
      },
      include: { vendorProfiles: true }
    })

    // Batch create products for performance
    const productData = vData.products.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      vendorId: user.vendorProfiles[0].id,
      categoryId: categoryMap[p.categorySlug]
    }))

    await prisma.product.createMany({ data: productData })
    console.log(`Created restaurant: ${vData.name}`)
  }

  // Generate 5 Grocery Stores
  console.log('Generating 5 Instamart grocery stores with custom AI pictures...')
  for (let i = 1; i <= 5; i++) {
    const vData = generateGrocery(i)
    
    const user = await prisma.user.create({
      data: {
        email: vData.email,
        name: vData.name,
        password: passwordHash,
        role: 'vendor',
        vendorProfiles: {
          create: vData.profile
        }
      },
      include: { vendorProfiles: true }
    })

    const productData = vData.products.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      vendorId: user.vendorProfiles[0].id,
      categoryId: categoryMap[p.categorySlug]
    }))

    await prisma.product.createMany({ data: productData })
    console.log(`Created grocery: ${vData.name}`)
  }

  console.log('Seeding complete! You now have exactly 5 restaurants and 5 grocery stores with unique AI pictures!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
