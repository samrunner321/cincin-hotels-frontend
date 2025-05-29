const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

export async function fetchDestinationCategories() {
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/destination_categories?filter[status][_eq]=published&sort=sort&fields=id,name,slug,description,image.*,hotel_category.id,hotel_category.name,hotel_category.slug`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_CATEGORY ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_CATEGORY) : 1800 }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch destination categories:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];

  } catch (error) {
    console.error('Error fetching destination categories:', error);
    return [];
  }
}

export async function fetchDestinationsByCategory(categorySlug) {
  try {
    // First get the category ID
    const categoryResponse = await fetch(
      `${DIRECTUS_URL}/items/destination_categories?filter[slug][_eq]=${categorySlug}&fields=id,name`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_CATEGORY ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_CATEGORY) : 1800 }
      }
    );

    if (!categoryResponse.ok || !(await categoryResponse.json()).data?.length) {
      return { category: null, destinations: [] };
    }

    const categoryData = await categoryResponse.json();
    const category = categoryData.data[0];

    // Then get destinations in that category
    const destinationsResponse = await fetch(
      `${DIRECTUS_URL}/items/destinations?filter[destination_category][_eq]=${category.id}&filter[status][_eq]=published&fields=*,translations.*,destination_category.name,destination_category.slug`,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_DESTINATION) : 600 }
      }
    );

    if (!destinationsResponse.ok) {
      console.error('Failed to fetch destinations by category:', destinationsResponse.statusText);
      return { category, destinations: [] };
    }

    const destinationsData = await destinationsResponse.json();
    return { 
      category, 
      destinations: destinationsData.data || [] 
    };

  } catch (error) {
    console.error('Error fetching destinations by category:', error);
    return { category: null, destinations: [] };
  }
}