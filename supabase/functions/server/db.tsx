// ============================================
// DATABASE HELPER FUNCTIONS
// Supabase Postgres Database Operations
// ============================================

import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Admin client with service role key for all database operations
export const db = createClient(supabaseUrl, supabaseServiceKey);

console.log('🗄️ Database client initialized');

// ============================================
// PROPERTIES - Database Operations
// ============================================

export async function getAllProperties(filters: any = {}) {
  try {
    let query = db.from('properties').select('*');

    // Apply filters
    if (filters.listingType) {
      query = query.eq('listing_type', filters.listingType.toUpperCase());
    }
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters.location) {
      query = query.or(`location.ilike.%${filters.location}%,city.ilike.%${filters.location}%`);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.furnishedType) {
      query = query.eq('furnished_type', filters.furnishedType);
    }
    if (filters.constructionStatus) {
      query = query.eq('construction_status', filters.constructionStatus);
    }
    if (filters.preferredTenant) {
      query = query.or(`preferred_tenant.eq.${filters.preferredTenant},preferred_tenant.eq.All`);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    } else {
      query = query.eq('status', 'active'); // Default: only active properties
    }

    // Sort by created_at (newest first)
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('❌ Database error fetching properties:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('❌ Error in getAllProperties:', error);
    throw error;
  }
}

export async function getFeaturedProperties() {
  try {
    const { data, error } = await db
      .from('properties')
      .select('*')
      .eq('featured', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error) {
    console.error('❌ Error fetching featured properties:', error);
    throw error;
  }
}

export async function getPropertyById(id: string) {
  try {
    const { data, error } = await db
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('❌ Error fetching property by ID:', error);
    throw error;
  }
}

export async function incrementPropertyViews(id: string) {
  try {
    // First get current views
    const { data: property } = await db
      .from('properties')
      .select('views')
      .eq('id', id)
      .single();

    const currentViews = property?.views || 0;

    // Then update views
    const { error } = await db
      .from('properties')
      .update({ views: currentViews + 1 })
      .eq('id', id);

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error('❌ Error incrementing views:', error);
    // Don't throw - views increment is not critical
  }
}

export async function createProperty(propertyData: any) {
  try {
    const { data, error } = await db
      .from('properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('❌ Error creating property:', error);
    throw error;
  }
}

export async function updateProperty(id: string, propertyData: any) {
  try {
    const { data, error } = await db
      .from('properties')
      .update({ ...propertyData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('❌ Error updating property:', error);
    throw error;
  }
}

export async function deleteProperty(id: string) {
  try {
    const { error } = await db
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error('❌ Error deleting property:', error);
    throw error;
  }
}

// ============================================
// INQUIRIES - Database Operations
// ============================================

export async function getAllInquiries(filters: any = {}) {
  try {
    let query = db.from('inquiries').select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error) {
    console.error('❌ Error fetching inquiries:', error);
    throw error;
  }
}

export async function createInquiry(inquiryData: any) {
  try {
    const { data, error } = await db
      .from('inquiries')
      .insert([inquiryData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('❌ Error creating inquiry:', error);
    throw error;
  }
}

export async function updateInquiry(id: string, inquiryData: any) {
  try {
    const { data, error } = await db
      .from('inquiries')
      .update({ ...inquiryData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('❌ Error updating inquiry:', error);
    throw error;
  }
}

export async function deleteInquiry(id: string) {
  try {
    const { error } = await db
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error('❌ Error deleting inquiry:', error);
    throw error;
  }
}

// ============================================
// CONTACTS - Database Operations
// ============================================

export async function getAllContacts() {
  try {
    const { data, error } = await db
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    throw error;
  }
}

export async function getContactById(id: string) {
  try {
    const { data, error } = await db
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('❌ Error fetching contact by ID:', error);
    throw error;
  }
}

export async function createContact(contactData: any) {
  try {
    const { data, error } = await db
      .from('contacts')
      .insert([contactData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('❌ Error creating contact:', error);
    throw error;
  }
}

export async function updateContact(id: string, contactData: any) {
  try {
    const { data, error } = await db
      .from('contacts')
      .update({ ...contactData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('❌ Error updating contact:', error);
    throw error;
  }
}

export async function deleteContact(id: string) {
  try {
    const { error } = await db
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error('❌ Error deleting contact:', error);
    throw error;
  }
}

// ============================================
// FAQs - Database Operations
// ============================================

export async function getAllFAQs() {
  try {
    const { data, error } = await db
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error) {
    console.error('❌ Error fetching FAQs:', error);
    throw error;
  }
}

export async function createFAQ(faqData: any) {
  try {
    const { data, error } = await db
      .from('faqs')
      .insert([faqData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('❌ Error creating FAQ:', error);
    throw error;
  }
}

export async function updateFAQ(id: string, faqData: any) {
  try {
    const { data, error } = await db
      .from('faqs')
      .update({ ...faqData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('❌ Error updating FAQ:', error);
    throw error;
  }
}

export async function deleteFAQ(id: string) {
  try {
    const { error } = await db
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error('❌ Error deleting FAQ:', error);
    throw error;
  }
}

// ============================================
// TERMS & CONDITIONS - Database Operations
// ============================================

export async function getTermsAndConditions() {
  try {
    const { data, error } = await db
      .from('terms_conditions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(error.message);
    }
    return data || { content: '', updated_at: null };
  } catch (error) {
    console.error('❌ Error fetching terms:', error);
    return { content: '', updated_at: null };
  }
}

export async function updateTermsAndConditions(content: string) {
  try {
    // First, try to get existing record
    const existing = await getTermsAndConditions();

    if (existing && existing.id) {
      // Update existing record
      const { data, error } = await db
        .from('terms_conditions')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    } else {
      // Create new record
      const { data, error } = await db
        .from('terms_conditions')
        .insert([{ content }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }
  } catch (error) {
    console.error('❌ Error updating terms:', error);
    throw error;
  }
}

// ============================================
// PRIVACY POLICY - Database Operations
// ============================================

export async function getPrivacyPolicy() {
  try {
    const { data, error } = await db
      .from('privacy_policy')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(error.message);
    }
    return data || { content: '', updated_at: null };
  } catch (error) {
    console.error('❌ Error fetching privacy policy:', error);
    return { content: '', updated_at: null };
  }
}

export async function updatePrivacyPolicy(content: string) {
  try {
    // First, try to get existing record
    const existing = await getPrivacyPolicy();

    if (existing && existing.id) {
      // Update existing record
      const { data, error } = await db
        .from('privacy_policy')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    } else {
      // Create new record
      const { data, error } = await db
        .from('privacy_policy')
        .insert([{ content }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }
  } catch (error) {
    console.error('❌ Error updating privacy policy:', error);
    throw error;
  }
}
