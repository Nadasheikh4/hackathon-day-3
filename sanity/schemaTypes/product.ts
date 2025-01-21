export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name:'id',
      type:"number",
      description: 'Unique identifier for the product',
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name of the product',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A URL-friendly version of the product name',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Category the product belongs to',
    },
    {
      name: 'colors',
      title: 'Colors',
      type: 'string',
      description: 'Available colors for the product',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Price of the product',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Product image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for the image',
        },
      ],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Detailed description of the product',
    },
  ],
};
