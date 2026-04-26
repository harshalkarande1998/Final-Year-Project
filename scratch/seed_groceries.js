const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Final precision grocery update...');
  
  const categories = await prisma.category.findMany({
    where: { storeType: 'GROCERY' }
  });

  const catIds = categories.map(c => c.id);
  
  // CLEAR ALL grocery products across ALL vendors to ensure no ghost data
  await prisma.product.deleteMany({
    where: { categoryId: { in: catIds } }
  });

  const vendor = await prisma.vendorProfile.findFirst({
    where: { storeType: 'GROCERY' }
  });

  if (!vendor) return console.error('No grocery vendor found');

  const items = [
    // Vegetables
    { name: 'Organic Carrots', slug: 'vegetables', price: 45, img: '/uploads/instamart_carrot.png' },
    { name: 'Broccoli Premium', slug: 'vegetables', price: 90, img: '/uploads/instamart_broccoli.png' },
    { name: 'Fresh Spinach (Palak)', slug: 'vegetables', price: 25, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80' },
    { name: 'Green Capsicum', slug: 'vegetables', price: 35, img: 'https://images.unsplash.com/photo-1563599175592-c58dc214deff?auto=format&fit=crop&w=600&q=80' },
    { name: 'Fresh Ginger', slug: 'vegetables', price: 15, img: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80' },

    // Fruits
    { name: 'Alphonso Mangoes', slug: 'fruits', price: 450, img: '/uploads/instamart_mango.png' },
    { name: 'Green Grapes', slug: 'fruits', price: 80, img: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Fresh Watermelon', slug: 'fruits', price: 60, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80' },
    { name: 'Golden Pineapple', slug: 'fruits', price: 120, img: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80' },
    { name: 'Red Pomegranate', slug: 'fruits', price: 180, img: 'https://images.unsplash.com/photo-1615485290382-441e4d019cb5?auto=format&fit=crop&w=600&q=80' },

    // Dairy
    { name: 'Fresh Milk 1L', slug: 'dairy', price: 60, img: 'https://images.unsplash.com/photo-1563636619-e910009355dc?auto=format&fit=crop&w=600&q=80' },
    { name: 'Amul Butter 500g', slug: 'dairy', price: 255, img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Cheese Slices', slug: 'dairy', price: 145, img: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=600&q=80' },
    { name: 'Malai Paneer', slug: 'dairy', price: 95, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80' },
    { name: 'Fresh Curd', slug: 'dairy', price: 35, img: 'https://images.unsplash.com/photo-1480619749602-28243f790c3d?auto=format&fit=crop&w=600&q=80' },

    // Groceries
    { name: 'Basmati Rice 5kg', slug: 'groceries', price: 550, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Whole Wheat Atta 10kg', slug: 'groceries', price: 420, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Refined Sugar 1kg', slug: 'groceries', price: 48, img: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80' },
    { name: 'Iodized Salt 1kg', slug: 'groceries', price: 22, img: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&w=600&q=80' },
    { name: 'Sunflower Oil 1L', slug: 'groceries', price: 165, img: 'https://images.unsplash.com/photo-1474979266404-7eaacabc8805?auto=format&fit=crop&w=600&q=80' },

    // Electronics
    { name: 'Duracell AA Batteries', slug: 'electronics', price: 180, img: 'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&w=600&q=80' },
    { name: '9W LED Bulb', slug: 'electronics', price: 99, img: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=600&q=80' },
    { name: 'Charging Cable USB-C', slug: 'electronics', price: 299, img: 'https://images.unsplash.com/photo-1589133907772-520e75a6c4b2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Extension Board', slug: 'electronics', price: 450, img: '/uploads/instamart_electronics.png' },
    { name: 'Smart Plug', slug: 'electronics', price: 599, img: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80' },

    // Clothing
    { name: 'Plain White T-shirt', slug: 'clothing', price: 350, img: '/uploads/instamart_tshirt.png' },
    { name: 'Cotton Socks', slug: 'clothing', price: 199, img: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=600&q=80' },
    { name: 'Gym Shorts', slug: 'clothing', price: 499, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hand Towel', slug: 'clothing', price: 120, img: 'https://images.unsplash.com/photo-1616627561839-0744651da9bb?auto=format&fit=crop&w=600&q=80' },
    { name: 'Casual Sweatshirt', slug: 'clothing', price: 899, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80' },

    // Home & Kitchen
    { name: 'Dinner Plate', slug: 'home-kitchen', price: 150, img: 'https://images.unsplash.com/photo-1591113063234-928ecf51889a?auto=format&fit=crop&w=600&q=80' },
    { name: 'Glass Bowl', slug: 'home-kitchen', price: 99, img: 'https://images.unsplash.com/photo-1610725664338-235ee20f0197?auto=format&fit=crop&w=600&q=80' },
    { name: 'Chef Knife', slug: 'home-kitchen', price: 220, img: 'https://images.unsplash.com/photo-1593611664567-689956dc4488?auto=format&fit=crop&w=600&q=80' },
    { name: 'Stainless Steel Spoon', slug: 'home-kitchen', price: 45, img: 'https://images.unsplash.com/photo-1589539140411-21b2f7906fc4?auto=format&fit=crop&w=600&q=80' },
    { name: 'Drinking Glass', slug: 'home-kitchen', price: 65, img: 'https://images.unsplash.com/photo-1516919549054-e08258825f80?auto=format&fit=crop&w=600&q=80' },
  ];

  const catMap = categories.reduce((acc, cat) => { acc[cat.slug] = cat.id; return acc; }, {});
  const productData = items.map(item => ({
    name: item.name,
    description: `Fresh and high quality ${item.name}.`,
    price: item.price,
    image: item.img,
    vendorId: vendor.id,
    categoryId: catMap[item.slug]
  }));

  await prisma.product.createMany({ data: productData });
  console.log('Final update complete: 35 items with precise, high-quality images.');
}

main().finally(() => prisma.$disconnect());
