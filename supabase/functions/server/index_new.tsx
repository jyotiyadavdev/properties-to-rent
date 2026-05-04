import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';
import * as DB from './db.tsx';

const app = new Hono();

// ============================================
// MIDDLEWARE - CORS & LOGGING
// ============================================
app.use('*', cors());
app.use('*', logger(console.log));

console.log('');
console.log('='.repeat(60));
console.log('🚀 ROM REAL ESTATE SERVER v3.0');
console.log('🔧 Supabase Database Integration');
console.log('📅 Server Started:', new Date().toISOString());
console.log('='.repeat(60));
console.log('');

// Initialize Supabase clients
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

console.log('🔧 Supabase Configuration Check:');
console.log('  URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
console.log('  SERVICE_ROLE_KEY:', supabaseServiceKey ? `✅ Present` : '❌ Missing');
console.log('  ANON_KEY:', supabaseAnonKey ? `✅ Present` : '❌ Missing');
console.log('🚀 Server Version: v3.0 - Full Database Integration');
console.log('');

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase clients initialized');
console.log('');

// Initialize Supabase Storage Bucket for images
const BUCKET_NAME = 'make-9d116660-property-images';

async function initializeStorage() {
  try {
    console.log('🗄️ Initializing Supabase Storage...');
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log('📦 Creating storage bucket:', BUCKET_NAME);
      const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (error) {
        console.error('❌ Error creating bucket:', error);
      } else {
        console.log('✅ Storage bucket created successfully');
      }
    } else {
      console.log('✅ Storage bucket already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing storage:', error);
  }
}

// Initialize storage on startup
initializeStorage();

// ============================================
// HEALTH CHECK
// ============================================

app.get('/make-server-9d116660/health', async (c) => {
  try {
    // Test database connectivity
    const { data, error } = await DB.db.from('properties').select('count').limit(1);
    
    return c.json({
      success: true,
      version: 'v3.0',
      database: error ? 'Error' : 'Connected',
      timestamp: new Date().toISOString(),
      message: 'ROM Real Estate Server - Database Integration Active',
    });
  } catch (error) {
    return c.json({
      success: false,
      version: 'v3.0',
      error: String(error),
    }, 500);
  }
});

// ============================================
// PUBLIC ROUTES - Properties
// ============================================

// GET all properties with filters
app.get('/make-server-9d116660/properties', async (c) => {
  try {
    const {
      listingType,
      propertyType,
      category,
      location,
      minPrice,
      maxPrice,
      furnishedType,
      constructionStatus,
      preferredTenant,
      page = '1',
      limit = '12',
    } = c.req.query();

    // Get filtered properties from database
    const allProperties = await DB.getAllProperties({
      listingType,
      propertyType,
      category,
      location,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      furnishedType,
      constructionStatus,
      preferredTenant,
      status: 'active',
    });

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const total = allProperties.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProperties = allProperties.slice(startIndex, endIndex);

    return c.json({
      success: true,
      data: paginatedProperties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return c.json({ success: false, error: 'Failed to fetch properties' }, 500);
  }
});

// GET featured properties
app.get('/make-server-9d116660/properties/featured', async (c) => {
  try {
    const featured = await DB.getFeaturedProperties();
    return c.json({
      success: true,
      data: featured,
    });
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return c.json({ success: false, error: 'Failed to fetch featured properties' }, 500);
  }
});

// GET single property by ID
app.get('/make-server-9d116660/properties/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const property = await DB.getPropertyById(id);

    if (!property) {
      return c.json({ success: false, error: 'Property not found' }, 404);
    }

    // Increment views
    await DB.incrementPropertyViews(id);

    return c.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return c.json({ success: false, error: 'Failed to fetch property' }, 500);
  }
});

// ============================================
// PUBLIC ROUTES - Inquiries
// ============================================

// POST create inquiry
app.post('/make-server-9d116660/inquiries', async (c) => {
  try {
    const body = await c.req.json();
    const { 
      propertyId, 
      propertyTitle, 
      propertyUrl,
      propertyPrice,
      propertyLocation,
      propertyType,
      listingType,
      name, 
      email, 
      phone, 
      message 
    } = body;

    if (!propertyId || !name || !email || !phone) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    const inquiryData = {
      property_id: propertyId,
      property_title: propertyTitle,
      property_url: propertyUrl,
      property_price: propertyPrice,
      property_location: propertyLocation,
      property_type: propertyType,
      listing_type: listingType?.toUpperCase() || 'RENT',
      name,
      email,
      phone,
      message,
      status: 'new',
    };

    const inquiry = await DB.createInquiry(inquiryData);
    console.log('✅ Inquiry saved successfully:', inquiry.id);

    return c.json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry,
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return c.json({ success: false, error: 'Failed to submit inquiry' }, 500);
  }
});

// ============================================
// AUTH ROUTES
// ============================================

// POST signup
app.post('/make-server-9d116660/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    console.log('📝 Signup request received:', { email, name });

    if (!email || !password || !name) {
      console.error('❌ Missing required fields');
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    console.log('🔵 Creating user with Supabase auth...');
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.error('❌ Supabase auth error:', error);
      return c.json({ success: false, error: error.message }, 400);
    }

    console.log('✅ User created in Supabase:', data.user.id);

    // User profile is automatically created by database trigger
    // Store user info in KV for token management
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    console.log('✅ User data saved');

    return c.json({
      success: true,
      message: 'Admin account created successfully',
      data: { id: userId, email, name, role: 'admin' },
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    return c.json({ success: false, error: 'Failed to create account' }, 500);
  }
});

// POST signin
app.post('/make-server-9d116660/auth/signin', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    console.log('🔐 Signin request received for:', email);

    if (!email || !password) {
      console.error('❌ Missing credentials');
      return c.json({ success: false, error: 'Missing email or password' }, 400);
    }

    console.log('🔑 Attempting signin...');
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Supabase signin error:', error);
      return c.json({ success: false, error: error.message }, 401);
    }

    console.log('✅ Supabase signin successful');
    
    // Create a simple token using user ID
    const userId = data.user.id;
    const simpleToken = `rom_${userId}_${Date.now()}`;
    
    // Store token in KV with expiry (24 hours)
    await kv.set(`token:${simpleToken}`, {
      userId: userId,
      email: data.user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    console.log('✅ Token created and stored');

    const user = await kv.get(`user:${userId}`);

    return c.json({
      success: true,
      accessToken: simpleToken,
      user: user || { id: userId, email: data.user.email, name: data.user.user_metadata?.name },
    });
  } catch (error) {
    console.error('❌ Signin error:', error);
    return c.json({ success: false, error: 'Failed to sign in' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - Auth Middleware
// ============================================

async function verifyAuth(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader) {
    return c.json({ success: false, error: 'Unauthorized - No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  if (!token || token === 'null' || token === 'undefined') {
    return c.json({ success: false, error: 'Unauthorized - Invalid token format' }, 401);
  }

  try {
    // Check if token exists in KV store
    const tokenData = await kv.get(`token:${token}`);
    
    if (!tokenData) {
      return c.json({ 
        success: false, 
        error: 'Unauthorized - Invalid or expired token',
      }, 401);
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expiresAt);
    const now = new Date();
    
    if (now > expiresAt) {
      await kv.del(`token:${token}`);
      return c.json({ 
        success: false, 
        error: 'Unauthorized - Token expired',
      }, 401);
    }
    
    c.set('userId', tokenData.userId);
    await next();
  } catch (err) {
    console.error('❌ Token verification error:', err);
    return c.json({ 
      success: false, 
      error: 'Unauthorized - Token verification failed',
    }, 401);
  }
}

// ============================================
// ADMIN ROUTES - Image Upload
// ============================================

app.post('/make-server-9d116660/admin/upload-image', verifyAuth, async (c) => {
  try {
    console.log('📤 Image upload request received');
    
    const formData = await c.req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ success: false, error: 'Invalid file type' }, 400);
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ success: false, error: 'File size too large (max 10MB)' }, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `property-images/${fileName}`;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileData, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('❌ Upload error:', error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return c.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: urlData.publicUrl,
        fileName,
        filePath,
      },
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return c.json({ success: false, error: 'Failed to upload image' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - Properties
// ============================================

// GET all properties (Admin)
app.get('/make-server-9d116660/admin/properties', verifyAuth, async (c) => {
  try {
    const allProperties = await DB.getAllProperties({ status: undefined }); // Get all statuses
    return c.json({
      success: true,
      data: allProperties,
    });
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    return c.json({ success: false, error: 'Failed to fetch properties' }, 500);
  }
});

// POST create property (Admin)
app.post('/make-server-9d116660/admin/properties', verifyAuth, async (c) => {
  try {
    console.log('📝 Create property request received');
    const body = await c.req.json();
    
    const propertyData = {
      title: body.title,
      description: body.description,
      listing_type: body.listingType?.toUpperCase() || 'RENT',
      property_type: body.propertyType,
      category: body.category,
      price: body.price,
      location: body.location,
      city: body.city,
      area: body.area,
      area_unit: body.areaUnit || 'sq.ft',
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      furnished_type: body.furnishedType,
      construction_status: body.constructionStatus,
      preferred_tenant: body.preferredTenant,
      images: body.images || [],
      amenities: body.amenities || [],
      featured: body.featured || false,
      status: body.status || 'active',
      views: 0,
    };

    const property = await DB.createProperty(propertyData);
    console.log('✅ Property created:', property.id);

    return c.json({
      success: true,
      message: 'Property created successfully',
      data: property,
    });
  } catch (error) {
    console.error('❌ Error creating property:', error);
    return c.json({ success: false, error: 'Failed to create property' }, 500);
  }
});

// PUT update property (Admin)
app.put('/make-server-9d116660/admin/properties/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const propertyData = {
      title: body.title,
      description: body.description,
      listing_type: body.listingType?.toUpperCase() || 'RENT',
      property_type: body.propertyType,
      category: body.category,
      price: body.price,
      location: body.location,
      city: body.city,
      area: body.area,
      area_unit: body.areaUnit || 'sq.ft',
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      furnished_type: body.furnishedType,
      construction_status: body.constructionStatus,
      preferred_tenant: body.preferredTenant,
      images: body.images || [],
      amenities: body.amenities || [],
      featured: body.featured || false,
      status: body.status || 'active',
    };

    const property = await DB.updateProperty(id, propertyData);

    return c.json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    console.error('Error updating property:', error);
    return c.json({ success: false, error: 'Failed to update property' }, 500);
  }
});

// DELETE property (Admin)
app.delete('/make-server-9d116660/admin/properties/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await DB.deleteProperty(id);

    return c.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return c.json({ success: false, error: 'Failed to delete property' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - Inquiries
// ============================================

// GET all inquiries (Admin)
app.get('/make-server-9d116660/admin/inquiries', verifyAuth, async (c) => {
  try {
    const { status, page = '1', limit = '20' } = c.req.query();
    
    const allInquiries = await DB.getAllInquiries({ status });

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const total = allInquiries.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginated = allInquiries.slice(startIndex, endIndex);

    return c.json({
      success: true,
      data: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return c.json({ success: false, error: 'Failed to fetch inquiries' }, 500);
  }
});

// PUT update inquiry status (Admin)
app.put('/make-server-9d116660/admin/inquiries/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const inquiry = await DB.updateInquiry(id, { status: body.status });

    return c.json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: inquiry,
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return c.json({ success: false, error: 'Failed to update inquiry' }, 500);
  }
});

// DELETE inquiry (Admin)
app.delete('/make-server-9d116660/admin/inquiries/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await DB.deleteInquiry(id);

    return c.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return c.json({ success: false, error: 'Failed to delete inquiry' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - Dashboard
// ============================================

app.get('/make-server-9d116660/admin/dashboard', verifyAuth, async (c) => {
  try {
    const allProperties = await DB.getAllProperties({ status: undefined });
    const allInquiries = await DB.getAllInquiries();

    const activeProperties = allProperties.filter((p: any) => p.status === 'active');
    const newInquiries = allInquiries.filter((i: any) => i.status === 'new');

    return c.json({
      success: true,
      data: {
        totalProperties: allProperties.length,
        activeProperties: activeProperties.length,
        totalInquiries: allInquiries.length,
        newInquiries: newInquiries.length,
        recentProperties: allProperties.slice(0, 5),
        recentInquiries: allInquiries.slice(0, 10),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return c.json({ success: false, error: 'Failed to fetch dashboard data' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - FAQs
// ============================================

// GET all FAQs (Admin)
app.get('/make-server-9d116660/admin/faqs', verifyAuth, async (c) => {
  try {
    const faqs = await DB.getAllFAQs();
    return c.json({ success: true, data: faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return c.json({ success: false, error: 'Failed to fetch FAQs' }, 500);
  }
});

// POST create FAQ (Admin)
app.post('/make-server-9d116660/admin/faqs', verifyAuth, async (c) => {
  try {
    const body = await c.req.json();
    const faq = await DB.createFAQ({
      question: body.question,
      answer: body.answer,
      display_order: body.order || 0,
    });
    return c.json({ success: true, message: 'FAQ created successfully', data: faq });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return c.json({ success: false, error: 'Failed to create FAQ' }, 500);
  }
});

// PUT update FAQ (Admin)
app.put('/make-server-9d116660/admin/faqs/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const faq = await DB.updateFAQ(id, {
      question: body.question,
      answer: body.answer,
      display_order: body.order || 0,
    });
    return c.json({ success: true, message: 'FAQ updated successfully', data: faq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return c.json({ success: false, error: 'Failed to update FAQ' }, 500);
  }
});

// DELETE FAQ (Admin)
app.delete('/make-server-9d116660/admin/faqs/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await DB.deleteFAQ(id);
    return c.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return c.json({ success: false, error: 'Failed to delete FAQ' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - Terms & Conditions
// ============================================

app.get('/make-server-9d116660/admin/terms', verifyAuth, async (c) => {
  try {
    const terms = await DB.getTermsAndConditions();
    return c.json({ success: true, data: terms });
  } catch (error) {
    console.error('Error fetching terms:', error);
    return c.json({ success: false, error: 'Failed to fetch terms' }, 500);
  }
});

app.put('/make-server-9d116660/admin/terms', verifyAuth, async (c) => {
  try {
    const body = await c.req.json();
    const terms = await DB.updateTermsAndConditions(body.content);
    return c.json({ success: true, message: 'Terms updated successfully', data: terms });
  } catch (error) {
    console.error('Error updating terms:', error);
    return c.json({ success: false, error: 'Failed to update terms' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - Privacy Policy
// ============================================

app.get('/make-server-9d116660/admin/privacy', verifyAuth, async (c) => {
  try {
    const privacy = await DB.getPrivacyPolicy();
    return c.json({ success: true, data: privacy });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return c.json({ success: false, error: 'Failed to fetch privacy policy' }, 500);
  }
});

app.put('/make-server-9d116660/admin/privacy', verifyAuth, async (c) => {
  try {
    const body = await c.req.json();
    const privacy = await DB.updatePrivacyPolicy(body.content);
    return c.json({ success: true, message: 'Privacy policy updated successfully', data: privacy });
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    return c.json({ success: false, error: 'Failed to update privacy policy' }, 500);
  }
});

// ============================================
// PUBLIC ROUTES - Content Pages
// ============================================

// GET all FAQs (Public)
app.get('/make-server-9d116660/faqs', async (c) => {
  try {
    const faqs = await DB.getAllFAQs();
    return c.json({ success: true, data: faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return c.json({ success: false, error: 'Failed to fetch FAQs' }, 500);
  }
});

// GET terms & conditions (Public)
app.get('/make-server-9d116660/terms', async (c) => {
  try {
    const terms = await DB.getTermsAndConditions();
    return c.json({ success: true, data: terms });
  } catch (error) {
    console.error('Error fetching terms:', error);
    return c.json({ success: false, error: 'Failed to fetch terms' }, 500);
  }
});

// GET privacy policy (Public)
app.get('/make-server-9d116660/privacy', async (c) => {
  try {
    const privacy = await DB.getPrivacyPolicy();
    return c.json({ success: true, data: privacy });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return c.json({ success: false, error: 'Failed to fetch privacy policy' }, 500);
  }
});

// ============================================
// CONTACT ROUTES
// ============================================

// POST contact submission (Public)
app.post('/make-server-9d116660/contact', async (c) => {
  try {
    const body = await c.req.json();
    const contact = await DB.createContact({
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
      status: 'new',
    });
    console.log('✅ Contact submission received:', contact.id);
    return c.json({ success: true, message: 'Contact submission received', data: contact });
  } catch (error) {
    console.error('Error saving contact:', error);
    return c.json({ success: false, error: 'Failed to save contact' }, 500);
  }
});

// GET all contacts (Admin)
app.get('/make-server-9d116660/admin/contacts', verifyAuth, async (c) => {
  try {
    const contacts = await DB.getAllContacts();
    return c.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return c.json({ success: false, error: 'Failed to fetch contacts' }, 500);
  }
});

// GET single contact (Admin)
app.get('/make-server-9d116660/admin/contacts/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const contact = await DB.getContactById(id);
    if (!contact) {
      return c.json({ success: false, error: 'Contact not found' }, 404);
    }
    return c.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return c.json({ success: false, error: 'Failed to fetch contact' }, 500);
  }
});

// PUT update contact (Admin)
app.put('/make-server-9d116660/admin/contacts/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const contact = await DB.updateContact(id, { status: body.status });
    return c.json({ success: true, message: 'Contact updated', data: contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    return c.json({ success: false, error: 'Failed to update contact' }, 500);
  }
});

// DELETE contact (Admin)
app.delete('/make-server-9d116660/admin/contacts/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await DB.deleteContact(id);
    return c.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return c.json({ success: false, error: 'Failed to delete contact' }, 500);
  }
});

// ============================================
// START SERVER
// ============================================

Deno.serve(app.fetch);

console.log('');
console.log('✅ ROM Real Estate Server v3.0 Running!');
console.log('✅ Database integration active');
console.log('✅ All routes registered');
console.log('');
