import { createClient } from '@sanity/client'
import axios from 'axios'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
// Create Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2021-08-31'
})

async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`)
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data)
    const asset = await client.assets.upload('image', buffer, {
      filename: imageUrl.split('/').pop()
    })
    console.log(`Image uploaded successfully: ${asset._id}`)
    return asset._id
  } catch (error) {
    console.error('Failed to upload image:', imageUrl, error)
    return null
  }
}

async function importData() {
  try {
    console.log('Fetching products from API...')
    const response = await axios.get('https://6784fdee1ec630ca33a6b00b.mockapi.io/products')
    const products = response.data
    console.log(`Fetched ${products.length} products`)
    
    for (const product of products) {
      console.log(`Processing product: ${product.title}`)
      let imageRef = null
      if (product.image) {
        imageRef = await uploadImageToSanity(product.image)
      }
      const slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') // Generate slug from product name

      const existingProduct = await client.fetch(`*[_type == "product" && id == $id][0]`, { id: product.id })
      
      if (existingProduct) {
        console.log(`Updating product: ${product.title}`)
        // Update the slug for the existing product
        const updatedProduct = await client.patch(existingProduct._id)
          .set({ slug: { _type: 'slug', current: slug } })
          .commit()
        console.log(`Product updated successfully: ${updatedProduct._id}`)
      } else {
        const sanityProduct = {
          _type: 'product',
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          colors: product.colors,
          price: product.price,
          image: imageRef ? {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageRef,
            },
          } : undefined,
          slug: {
            _type: 'slug',
            current: slug, // Set the slug value
          },
        }
        console.log('Uploading new product to Sanity:', sanityProduct.name)
        const result = await client.create(sanityProduct)
        console.log(`Product uploaded successfully: ${result._id}`)
      }
    }
    console.log('Data import completed successfully!')
  } catch (error) {
    console.error('Error importing data:', error)
  }
}

importData()
