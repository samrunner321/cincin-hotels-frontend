const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

export async function fetchHotelCategories() {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/hotel_categories?filter[status][_eq]=published&sort=sort&fields=id,name,slug,description,image.*`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_CATEGORY ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_CATEGORY) : 1800 }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch hotel categories:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];

  } catch (error) {
    console.error('Error fetching hotel categories:', error);
    return [];
  }
}

export async function fetchHotelsByCategory(categorySlug) {
  try {
    // First get the category ID
    const categoryResponse = await fetch(
      `${DIRECTUS_URL}/items/hotel_categories?filter[slug][_eq]=${categorySlug}&fields=id,name`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_CATEGORY ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_CATEGORY) : 1800 }
      }
    );

    if (!categoryResponse.ok || !(await categoryResponse.json()).data?.length) {
      return { category: null, hotels: [] };
    }

    const categoryData = await categoryResponse.json();
    const category = categoryData.data[0];

    // Then get hotels in that category
    const hotelsResponse = await fetch(
      `${DIRECTUS_URL}/items/hotels?filter[categories][hotel_categories_id][_eq]=${category.id}&filter[status][_eq]=Published&fields=*,translations.*,categories.hotel_categories_id.name,categories.hotel_categories_id.slug`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 }
      }
    );

    if (!hotelsResponse.ok) {
      console.error('Failed to fetch hotels by category:', hotelsResponse.statusText);
      return { category, hotels: [] };
    }

    const hotelsData = await hotelsResponse.json();
    return { 
      category, 
      hotels: hotelsData.data || [] 
    };

  } catch (error) {
    console.error('Error fetching hotels by category:', error);
    return { category: null, hotels: [] };
  }
}