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
// Admin client for admin operations (user creation, verification)
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

console.log('🔧 Supabase Configuration Check:');
console.log('  URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
console.log('  Full URL:', supabaseUrl);
console.log('  SERVICE_ROLE_KEY:', supabaseServiceKey ? `✅ Present (${supabaseServiceKey.substring(0, 20)}...)` : '❌ Missing');
console.log('  ANON_KEY:', supabaseAnonKey ? `✅ Present (${supabaseAnonKey.substring(0, 20)}...)` : '❌ Missing');
console.log('🚀 Server Version: v2.1 - Custom Token Auth System (Fixed)');
console.log('📅 Deployed:', new Date().toISOString());

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

// Helper function to generate unique ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/make-server-9d116660/health', async (c) => {
  try {
    // Test KV connectivity
    let kvTest = { status: 'unknown', error: null };
    try {
      await kv.set('_health_test', { timestamp: Date.now() });
      const testData = await kv.get('_health_test');
      kvTest = { status: testData ? 'working' : 'failed', error: null };
    } catch (err) {
      kvTest = { status: 'error', error: String(err) };
    }

    return c.json({
      success: true,
      version: 'v2.0',
      authSystem: 'Custom Token (KV Store)',
      timestamp: new Date().toISOString(),
      message: 'Server is running with custom auth system - no JWT validation',
      environment: {
        supabaseUrl: supabaseUrl ? 'Present' : 'Missing',
        serviceKey: supabaseServiceKey ? 'Present' : 'Missing',
        anonKey: supabaseAnonKey ? 'Present' : 'Missing',
      },
      kvStore: kvTest,
    });
  } catch (error) {
    return c.json({
      success: false,
      version: 'v2.0',
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

    // Get all properties
    const allProperties = await kv.getByPrefix('property:');
    
    // Filter properties
    let filtered = allProperties.filter((p: any) => p.status === 'active');

    if (listingType) {
      filtered = filtered.filter((p: any) => p.listingType === listingType);
    }
    if (propertyType) {
      filtered = filtered.filter((p: any) => p.propertyType === propertyType);
    }
    if (category) {
      filtered = filtered.filter((p: any) => p.category === category);
    }
    if (location) {
      filtered = filtered.filter((p: any) =>
        p.location?.toLowerCase().includes(location.toLowerCase()) ||
        p.city?.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (minPrice) {
      filtered = filtered.filter((p: any) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p: any) => p.price <= Number(maxPrice));
    }
    if (furnishedType) {
      filtered = filtered.filter((p: any) => p.furnishedType === furnishedType);
    }
    if (constructionStatus) {
      filtered = filtered.filter((p: any) => p.constructionStatus === constructionStatus);
    }
    if (preferredTenant) {
      filtered = filtered.filter((p: any) => p.preferredTenant === preferredTenant || p.preferredTenant === 'All');
    }

    // Sort by createdAt (newest first)
    filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProperties = filtered.slice(startIndex, endIndex);

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
    const allProperties = await kv.getByPrefix('property:');
    const featured = allProperties
      .filter((p: any) => p.featured === true && p.status === 'active')
      .slice(0, 8);

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
    const property = await kv.get(`property:${id}`);

    if (!property) {
      return c.json({ success: false, error: 'Property not found' }, 404);
    }

    // Increment views
    property.views = (property.views || 0) + 1;
    await kv.set(`property:${id}`, property);

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

    const inquiryId = generateId();
    const inquiry = {
      id: inquiryId,
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
      message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`inquiry:${inquiryId}`, inquiry);

    console.log('✅ Inquiry saved successfully:', inquiryId);

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

    // Store user info in KV
    const userId = data.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });

    console.log('✅ User data saved to KV store');

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

    console.log('🔑 Attempting signin with supabaseAuth (ANON_KEY)...');
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Supabase signin error:', error);
      return c.json({ success: false, error: error.message }, 401);
    }

    console.log('✅ Supabase signin successful');
    
    const userId = data.user.id;
    // Create custom token to avoid Edge Functions JWT validation
    const customToken = `rom_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('📝 Creating custom token:', customToken.substring(0, 40) + '...');
    console.log('🔑 Token key will be:', `auth:${customToken}`.substring(0, 50) + '...');
    
    // Store token in KV with expiry (7 days)
    const tokenData = {
      userId: userId,
      email: data.user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };
    
    console.log('💾 Storing token data in KV:', tokenData);
    
    try {
      await kv.set(`auth:${customToken}`, tokenData);
      console.log('✅ Token stored successfully in KV store');
      
      // Verify it was stored
      const verification = await kv.get(`auth:${customToken}`);
      console.log('🔍 Verification - Token retrieval:', verification ? '✅ Found' : '❌ Not found');
      
      if (!verification) {
        console.error('❌ CRITICAL: Token was not stored properly!');
        throw new Error('Token storage verification failed');
      }
    } catch (kvError) {
      console.error('❌ KV Store Error:', kvError);
      throw new Error(`Failed to store token: ${kvError.message}`);
    }
    
    console.log('✅ Custom token created and stored:', customToken.substring(0, 30) + '...');

    const user = await kv.get(`user:${userId}`) as any;
    console.log('👤 User data from KV:', user);

    return c.json({
      success: true,
      accessToken: customToken, // Return custom token instead of JWT
      user: user || { id: userId, email: data.user.email, name: data.user.user_metadata?.name, role: 'admin' },
    });
  } catch (error) {
    console.error('❌ Signin error:', error);
    return c.json({ success: false, error: 'Failed to sign in' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - Properties (Protected)
// ============================================

// Middleware to verify auth
async function verifyAuth(c: any, next: any) {
  // Try custom header first (X-Access-Token), fallback to Authorization
  let authHeader = c.req.header('X-Access-Token');
  let token = authHeader;
  
  // If not in custom header, try Authorization header
  if (!token) {
    authHeader = c.req.header('Authorization');
    if (authHeader) {
      token = authHeader.split(' ')[1];
    }
  }
  
  console.log('🔐 Auth verification started');
  console.log('🔐 Token present:', !!token);
  
  if (!token || token === 'null' || token === 'undefined') {
    console.error('❌ No token provided');
    return c.json({ success: false, error: 'Unauthorized - No token provided' }, 401);
  }

  try {
    console.log('🔑 Token extracted:', token?.substring(0, 30) + '...');
    
    // Verify custom token
    console.log('🔍 Verifying custom token in KV store...');
    const tokenData = await kv.get(`auth:${token}`) as any;
    
    if (!tokenData) {
      console.error('❌ Token not found in KV store');
      return c.json({ 
        success: false, 
        error: 'Unauthorized - Invalid token',
      }, 401);
    }
    
    // Check expiry
    if (new Date(tokenData.expiresAt) < new Date()) {
      console.error('❌ Token expired');
      await kv.del(`auth:${token}`);
      return c.json({ 
        success: false, 
        error: 'Unauthorized - Token expired',
      }, 401);
    }

    console.log('✅ Token verified successfully');
    console.log('✅ User ID:', tokenData.userId);
    console.log('✅ User email:', tokenData.email);
    
    c.set('userId', tokenData.userId);
    c.set('userEmail', tokenData.email);
    await next();
  } catch (err) {
    console.error('❌ Exception during token verification:', err);
    return c.json({ 
      success: false, 
      error: 'Unauthorized - Token verification failed',
    }, 401);
  }
}

// POST upload image (Admin)
app.post('/make-server-9d116660/admin/upload-image', verifyAuth, async (c) => {
  try {
    console.log('📤 Image upload request received');
    
    const formData = await c.req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      console.error('❌ No file provided');
      return c.json({ success: false, error: 'No file provided' }, 400);
    }
    
    console.log('📁 File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return c.json({ success: false, error: 'Invalid file type. Only images (JPEG, PNG, WebP, GIF) are allowed' }, 400);
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      return c.json({ success: false, error: 'File size too large. Maximum size is 10MB' }, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `property-images/${fileName}`;

    console.log('💾 Uploading to Supabase Storage:', filePath);

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileData, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase storage error:', error);
      return c.json({ success: false, error: `Failed to upload file: ${error.message}` }, 500);
    }

    console.log('✅ File uploaded successfully:', data.path);

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;
    console.log('🔗 Public URL:', publicUrl);

    return c.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: publicUrl,
        fileName: fileName,
        filePath: filePath,
        size: file.size,
        type: file.type
      },
    });
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    return c.json({ success: false, error: 'Failed to upload image' }, 500);
  }
});

// POST create property (Admin)
app.post('/make-server-9d116660/admin/properties', verifyAuth, async (c) => {
  try {
    console.log('📝 Create property request received');
    const body = await c.req.json();
    console.log('📦 Property data:', body);
    
    const propertyId = generateId();
    
    const property = {
      ...body,
      id: propertyId,
      views: 0,
      status: body.status || 'active',
      featured: body.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('💾 Saving property to KV store...');
    await kv.set(`property:${propertyId}`, property);
    console.log('✅ Property saved successfully:', propertyId);

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
    
    const existingProperty = await kv.get(`property:${id}`);
    if (!existingProperty) {
      return c.json({ success: false, error: 'Property not found' }, 404);
    }

    const updatedProperty = {
      ...existingProperty,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`property:${id}`, updatedProperty);

    return c.json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty,
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
    await kv.del(`property:${id}`);

    return c.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return c.json({ success: false, error: 'Failed to delete property' }, 500);
  }
});

// GET all properties for admin
app.get('/make-server-9d116660/admin/properties', verifyAuth, async (c) => {
  try {
    const allProperties = await kv.getByPrefix('property:');
    allProperties.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({
      success: true,
      data: allProperties,
    });
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    return c.json({ success: false, error: 'Failed to fetch properties' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - Inquiries (Protected)
// ============================================

// GET all inquiries (Admin)
app.get('/make-server-9d116660/admin/inquiries', verifyAuth, async (c) => {
  try {
    const { status, page = '1', limit = '20' } = c.req.query();
    
    let allInquiries = await kv.getByPrefix('inquiry:');
    
    if (status) {
      allInquiries = allInquiries.filter((i: any) => i.status === status);
    }

    // Sort by createdAt (newest first)
    allInquiries.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
    
    const inquiry = await kv.get(`inquiry:${id}`);
    if (!inquiry) {
      return c.json({ success: false, error: 'Inquiry not found' }, 404);
    }

    const updated = {
      ...inquiry,
      status: body.status,
    };

    await kv.set(`inquiry:${id}`, updated);

    return c.json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return c.json({ success: false, error: 'Failed to update inquiry' }, 500);
  }
});

// GET dashboard stats (Admin)
app.get('/make-server-9d116660/admin/dashboard', verifyAuth, async (c) => {
  try {
    console.log('📊 Dashboard stats request');
    
    // Get all properties from database
    let allProperties = [];
    try {
      allProperties = await DB.getAllProperties({ status: undefined });
      console.log('✅ Properties loaded:', allProperties.length);
    } catch (propError) {
      console.error('❌ Error loading properties:', propError);
      return c.json({ 
        success: false, 
        error: 'Failed to load properties from database',
        details: propError.message 
      }, 500);
    }
    
    const activeProperties = allProperties.filter((p: any) => p.status === 'active');
    
    // Get all inquiries from database
    let inquiries = [];
    try {
      const { data: allInquiries, error: inquiriesError } = await DB.db
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (inquiriesError) {
        console.error('⚠️ Error fetching inquiries:', inquiriesError);
        // Don't fail the whole request, just use empty array
      } else {
        inquiries = allInquiries || [];
        console.log('✅ Inquiries loaded:', inquiries.length);
      }
    } catch (inqError) {
      console.error('❌ Error loading inquiries:', inqError);
      // Continue with empty array
    }
    
    const newInquiries = inquiries.filter((i: any) => i.status === 'new');
    
    // Get property type distribution
    const propertyTypeCount: Record<string, number> = {};
    allProperties.forEach((p: any) => {
      const type = p.property_type || 'Other';
      propertyTypeCount[type] = (propertyTypeCount[type] || 0) + 1;
    });
    
    // Get listing type stats
    const rentProperties = allProperties.filter((p: any) => p.listing_type === 'RENT');
    const buyProperties = allProperties.filter((p: any) => p.listing_type === 'BUY');
    const rentInquiries = inquiries.filter((i: any) => i.listing_type === 'RENT');
    const buyInquiries = inquiries.filter((i: any) => i.listing_type === 'BUY');

    console.log('✅ Dashboard stats compiled successfully:', {
      totalProperties: allProperties.length,
      activeProperties: activeProperties.length,
      totalInquiries: inquiries.length,
      newInquiries: newInquiries.length,
    });
    
    return c.json({
      success: true,
      data: {
        totalProperties: allProperties.length,
        activeProperties: activeProperties.length,
        totalInquiries: inquiries.length,
        newInquiries: newInquiries.length,
        recentProperties: allProperties.slice(0, 5),
        recentInquiries: inquiries.slice(0, 10),
        propertyTypeCount,
        listingTypeStats: {
          rent: {
            properties: rentProperties.length,
            inquiries: rentInquiries.length,
          },
          buy: {
            properties: buyProperties.length,
            inquiries: buyInquiries.length,
          },
        },
      },
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch dashboard data',
      details: error.message 
    }, 500);
  }
});

// ============================================
// SEED TEST DATA (Development Only)
// ============================================

app.post('/make-server-9d116660/seed-data', async (c) => {
  try {
    console.log('🌱 Seeding test data...');

    const testProperties = [
      // Rent - Flat/Apartment
      {
        id: generateId(),
        title: 'Luxury 3 BHK Apartment in South Delhi',
        description: 'Spacious 3 BHK apartment with modern amenities. Fully furnished with premium interiors, modular kitchen, and attached balconies. Located in prime South Delhi location with excellent connectivity.',
        listingType: 'rent',
        propertyType: 'Flat/Apartment',
        category: '3 BHK',
        price: 45000,
        location: 'Greater Kailash, South Delhi',
        city: 'Delhi',
        area: 1800,
        areaUnit: 'sq.ft',
        bedrooms: 3,
        bathrooms: 3,
        furnishedType: 'Fully Furnished',
        preferredTenant: 'Family',
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
        ],
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Gym', 'Swimming Pool'],
        featured: true,
        status: 'active',
        views: 156,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        title: 'Affordable 2 BHK Flat in Noida Sector 62',
        description: 'Well-maintained 2 BHK apartment perfect for small families. Semi-furnished with basic amenities. Near metro station and shopping complexes.',
        listingType: 'rent',
        propertyType: 'Flat/Apartment',
        category: '2 BHK',
        price: 18000,
        location: 'Sector 62, Noida',
        city: 'Noida',
        area: 1100,
        areaUnit: 'sq.ft',
        bedrooms: 2,
        bathrooms: 2,
        furnishedType: 'Semi Furnished',
        preferredTenant: 'Family',
        images: [
          'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800'
        ],
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security'],
        featured: false,
        status: 'active',
        views: 89,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        title: 'Modern 1 BHK Studio Apartment in Gurgaon',
        description: 'Compact and modern studio apartment ideal for bachelors or working professionals. Fully furnished with contemporary design and all modern amenities.',
        listingType: 'rent',
        propertyType: 'Flat/Apartment',
        category: '1 BHK',
        price: 15000,
        location: 'Cyber City, Gurgaon',
        city: 'Gurgaon',
        area: 650,
        areaUnit: 'sq.ft',
        bedrooms: 1,
        bathrooms: 1,
        furnishedType: 'Fully Furnished',
        preferredTenant: 'Bachelor',
        images: [
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
        ],
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Gym'],
        featured: true,
        status: 'active',
        views: 234,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Buy - Flat/Apartment
      {
        id: generateId(),
        title: 'Premium 4 BHK Apartment for Sale in Dwarka',
        description: 'Spacious 4 BHK apartment in ready-to-move society. Premium construction with high-end finishes. Perfect for large families looking for luxury living.',
        listingType: 'buy',
        propertyType: 'Flat/Apartment',
        category: '4 BHK',
        price: 18500000,
        location: 'Dwarka Sector 12, Delhi',
        city: 'Delhi',
        area: 2400,
        areaUnit: 'sq.ft',
        bedrooms: 4,
        bathrooms: 4,
        constructionStatus: 'Ready to Move',
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
        ],
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Gym', 'Swimming Pool', 'Club House', 'Garden'],
        featured: true,
        status: 'active',
        views: 445,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        title: 'Under Construction 3 BHK in New Project',
        description: 'Brand new 3 BHK apartment in under construction project. Expected possession in 12 months. Special launch price with attractive payment plans.',
        listingType: 'buy',
        propertyType: 'Flat/Apartment',
        category: '3 BHK',
        price: 8500000,
        location: 'Greater Noida West',
        city: 'Greater Noida',
        area: 1600,
        areaUnit: 'sq.ft',
        bedrooms: 3,
        bathrooms: 3,
        constructionStatus: 'Under Construction',
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
        ],
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Gym', 'Swimming Pool'],
        featured: false,
        status: 'active',
        views: 178,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Rent - Villa
      {
        id: generateId(),
        title: 'Stunning Independent Villa with Private Garden',
        description: 'Beautiful 4 BHK independent villa with private garden and parking. Fully furnished with designer interiors. Perfect for families who value privacy and space.',
        listingType: 'rent',
        propertyType: 'Villa',
        category: '4 BHK',
        price: 85000,
        location: 'DLF Phase 4, Gurgaon',
        city: 'Gurgaon',
        area: 3200,
        areaUnit: 'sq.ft',
        bedrooms: 4,
        bathrooms: 5,
        furnishedType: 'Fully Furnished',
        preferredTenant: 'Family',
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'
        ],
        amenities: ['Parking', 'Garden', 'Power Backup', 'Security', 'Servant Room'],
        featured: true,
        status: 'active',
        views: 312,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Buy - Villa
      {
        id: generateId(),
        title: 'Luxury Villa for Sale in Gated Community',
        description: 'Premium 5 BHK villa in exclusive gated community. Ultra-modern architecture with smart home features. Private pool, garden, and basement parking.',
        listingType: 'buy',
        propertyType: 'Villa',
        category: '5 BHK',
        price: 42500000,
        location: 'Sushant Lok, Gurgaon',
        city: 'Gurgaon',
        area: 4500,
        areaUnit: 'sq.ft',
        bedrooms: 5,
        bathrooms: 6,
        constructionStatus: 'Ready to Move',
        images: [
          'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
          'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
        ],
        amenities: ['Parking', 'Garden', 'Power Backup', 'Security', 'Swimming Pool', 'Servant Room', 'Club House'],
        featured: true,
        status: 'active',
        views: 567,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Rent - PG
      {
        id: generateId(),
        title: 'Boys PG with Food in Laxmi Nagar',
        description: 'Comfortable PG accommodation for boys with 3 times meals included. Clean rooms, WiFi, and laundry services. Walking distance from metro station.',
        listingType: 'rent',
        propertyType: 'PG',
        category: 'Single',
        price: 8500,
        location: 'Laxmi Nagar, Delhi',
        city: 'Delhi',
        area: 120,
        areaUnit: 'sq.ft',
        bedrooms: 1,
        bathrooms: 1,
        furnishedType: 'Fully Furnished',
        preferredTenant: 'Bachelor',
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'
        ],
        amenities: ['WiFi', 'Food', 'Laundry', 'Power Backup'],
        featured: false,
        status: 'active',
        views: 98,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        title: 'Girls PG Near IT Park - Safe & Secure',
        description: 'Premium PG for working women. Double sharing rooms with attached bathroom. CCTV surveillance, 24/7 security, and homely food.',
        listingType: 'rent',
        propertyType: 'PG',
        category: 'Double Sharing',
        price: 9500,
        location: 'Sector 18, Noida',
        city: 'Noida',
        area: 150,
        areaUnit: 'sq.ft',
        bedrooms: 1,
        bathrooms: 1,
        furnishedType: 'Fully Furnished',
        preferredTenant: 'Bachelor',
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
        ],
        amenities: ['WiFi', 'Food', 'Laundry', 'Power Backup', 'Security'],
        featured: false,
        status: 'active',
        views: 145,
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Rent - Commercial
      {
        id: generateId(),
        title: 'Prime Office Space in Connaught Place',
        description: 'Premium commercial office space in the heart of Delhi. Fully furnished with modern interiors, conference rooms, and parking. Ideal for corporates and startups.',
        listingType: 'rent',
        propertyType: 'Commercial',
        category: 'Office',
        price: 250000,
        location: 'Connaught Place, Delhi',
        city: 'Delhi',
        area: 3000,
        areaUnit: 'sq.ft',
        furnishedType: 'Fully Furnished',
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'
        ],
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Cafeteria', 'Conference Room'],
        featured: true,
        status: 'active',
        views: 289,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        title: 'Retail Shop in High Traffic Market',
        description: 'Excellent retail space in busy market area. Ground floor location with high visibility. Perfect for retail business, showroom, or restaurant.',
        listingType: 'rent',
        propertyType: 'Commercial',
        category: 'Shop',
        price: 45000,
        location: 'Nehru Place, Delhi',
        city: 'Delhi',
        area: 800,
        areaUnit: 'sq.ft',
        furnishedType: 'Unfurnished',
        images: [
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
          'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800'
        ],
        amenities: ['Power Backup', 'Security', 'Parking'],
        featured: false,
        status: 'active',
        views: 167,
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Buy - Commercial
      {
        id: generateId(),
        title: 'Commercial Building for Sale - Investment Opportunity',
        description: 'Complete commercial building with 6 floors. Currently generating rental income. Prime location with excellent appreciation potential. Perfect for investors.',
        listingType: 'buy',
        propertyType: 'Commercial',
        category: 'Office',
        price: 125000000,
        location: 'Saket, Delhi',
        city: 'Delhi',
        area: 12000,
        areaUnit: 'sq.ft',
        constructionStatus: 'Ready to Move',
        images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
          'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=800',
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
        ],
        amenities: ['Parking', 'Lift', 'Power Backup', 'Security', 'Cafeteria'],
        featured: true,
        status: 'active',
        views: 423,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // Additional properties for variety
      {
        id: generateId(),
        title: 'Cozy 2 BHK Flat for Family',
        description: 'Comfortable 2 BHK apartment in peaceful residential area. Semi-furnished with essential amenities. Great for small families.',
        listingType: 'rent',
        propertyType: 'Flat/Apartment',
        category: '2 BHK',
        price: 22000,
        location: 'Vasundhara, Ghaziabad',
        city: 'Ghaziabad',
        area: 1250,
        areaUnit: 'sq.ft',
        bedrooms: 2,
        bathrooms: 2,
        furnishedType: 'Semi Furnished',
        preferredTenant: 'Family',
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
        ],
        amenities: ['Parking', 'Lift', 'Security', 'Power Backup'],
        featured: false,
        status: 'active',
        views: 67,
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Save all properties
    for (const property of testProperties) {
      await kv.set(`property:${property.id}`, property);
    }

    console.log(`✅ Seeded ${testProperties.length} test properties`);

    return c.json({
      success: true,
      message: `Successfully seeded ${testProperties.length} test properties`,
      count: testProperties.length,
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return c.json({ success: false, error: 'Failed to seed test data' }, 500);
  }
});

// Start server
Deno.serve(app.fetch);

// ============================================
// ADMIN ROUTES - FAQs (Protected)
// ============================================

// GET all FAQs (Admin)
app.get('/make-server-9d116660/admin/faqs', verifyAuth, async (c) => {
  try {
    const allFaqs = await kv.getByPrefix('faq:');
    allFaqs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return c.json({ success: true, data: allFaqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return c.json({ success: false, error: 'Failed to fetch FAQs' }, 500);
  }
});

// POST create FAQ (Admin)
app.post('/make-server-9d116660/admin/faqs', verifyAuth, async (c) => {
  try {
    const body = await c.req.json();
    const faqId = generateId();
    const faq = {
      ...body,
      id: faqId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await kv.set(`faq:${faqId}`, faq);
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
    const existing = await kv.get(`faq:${id}`);
    if (!existing) {
      return c.json({ success: false, error: 'FAQ not found' }, 404);
    }
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    await kv.set(`faq:${id}`, updated);
    return c.json({ success: true, message: 'FAQ updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return c.json({ success: false, error: 'Failed to update FAQ' }, 500);
  }
});

// DELETE FAQ (Admin)
app.delete('/make-server-9d116660/admin/faqs/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`faq:${id}`);
    return c.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return c.json({ success: false, error: 'Failed to delete FAQ' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - Team Members (Protected)
// ============================================

// GET all team members (Admin)
/* DISABLED - Team Members Feature
app.get('/make-server-9d116660/admin/team', verifyAuth, async (c) => {
  try {
    const allTeam = await kv.getByPrefix('team:');
    allTeam.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return c.json({ success: true, data: allTeam });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return c.json({ success: false, error: 'Failed to fetch team members' }, 500);
  }
});

// POST create team member (Admin)
app.post('/make-server-9d116660/admin/team', verifyAuth, async (c) => {
  try {
    const body = await c.req.json();
    const teamId = generateId();
    const member = {
      ...body,
      id: teamId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await kv.set(`team:${teamId}`, member);
    return c.json({ success: true, message: 'Team member created successfully', data: member });
  } catch (error) {
    console.error('Error creating team member:', error);
    return c.json({ success: false, error: 'Failed to create team member' }, 500);
  }
});

// PUT update team member (Admin)
app.put('/make-server-9d116660/admin/team/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await kv.get(`team:${id}`);
    if (!existing) {
      return c.json({ success: false, error: 'Team member not found' }, 404);
    }
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    await kv.set(`team:${id}`, updated);
    return c.json({ success: true, message: 'Team member updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating team member:', error);
    return c.json({ success: false, error: 'Failed to update team member' }, 500);
  }
});

// DELETE team member (Admin)
app.delete('/make-server-9d116660/admin/team/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`team:${id}`);
    return c.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return c.json({ success: false, error: 'Failed to delete team member' }, 500);
  }
});
*/

// ============================================
// ADMIN ROUTES - Terms & Conditions (Protected)
// ============================================

// GET terms & conditions (Admin)
app.get('/make-server-9d116660/admin/terms', verifyAuth, async (c) => {
  try {
    const terms = await kv.get('site:terms');
    return c.json({ success: true, data: terms || { content: '', updatedAt: null } });
  } catch (error) {
    console.error('Error fetching terms:', error);
    return c.json({ success: false, error: 'Failed to fetch terms' }, 500);
  }
});

// PUT update terms & conditions (Admin)
app.put('/make-server-9d116660/admin/terms', verifyAuth, async (c) => {
  try {
    const body = await c.req.json();
    const terms = {
      content: body.content,
      updatedAt: new Date().toISOString(),
    };
    await kv.set('site:terms', terms);
    return c.json({ success: true, message: 'Terms & Conditions updated successfully', data: terms });
  } catch (error) {
    console.error('Error updating terms:', error);
    return c.json({ success: false, error: 'Failed to update terms' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - Privacy Policy (Protected)
// ============================================

// GET privacy policy (Admin)
app.get('/make-server-9d116660/admin/privacy', verifyAuth, async (c) => {
  try {
    const privacy = await kv.get('site:privacy');
    return c.json({ success: true, data: privacy || { content: '', updatedAt: null } });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return c.json({ success: false, error: 'Failed to fetch privacy policy' }, 500);
  }
});

// PUT update privacy policy (Admin)
app.put('/make-server-9d116660/admin/privacy', verifyAuth, async (c) => {
  try {
    const body = await c.req.json();
    const privacy = {
      content: body.content,
      updatedAt: new Date().toISOString(),
    };
    await kv.set('site:privacy', privacy);
    return c.json({ success: true, message: 'Privacy Policy updated successfully', data: privacy });
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
    const allFaqs = await kv.getByPrefix('faq:');
    allFaqs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return c.json({ success: true, data: allFaqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return c.json({ success: false, error: 'Failed to fetch FAQs' }, 500);
  }
});

// GET all team members (Public)
app.get('/make-server-9d116660/team', async (c) => {
  try {
    const allTeam = await kv.getByPrefix('team:');
    allTeam.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    return c.json({ success: true, data: allTeam });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return c.json({ success: false, error: 'Failed to fetch team members' }, 500);
  }
});

// GET terms & conditions (Public)
app.get('/make-server-9d116660/terms', async (c) => {
  try {
    const terms = await kv.get('site:terms');
    return c.json({ success: true, data: terms || { content: '', updatedAt: null } });
  } catch (error) {
    console.error('Error fetching terms:', error);
    return c.json({ success: false, error: 'Failed to fetch terms' }, 500);
  }
});

// GET privacy policy (Public)
app.get('/make-server-9d116660/privacy', async (c) => {
  try {
    const privacy = await kv.get('site:privacy');
    return c.json({ success: true, data: privacy || { content: '', updatedAt: null } });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return c.json({ success: false, error: 'Failed to fetch privacy policy' }, 500);
  }
});

// ============================================
// CONTACT US ROUTES
// ============================================

// POST contact submission (Public)
app.post('/make-server-9d116660/contact', async (c) => {
  try {
    const body = await c.req.json();
    const contactId = generateId();
    const contact = {
      ...body,
      id: contactId,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    await kv.set(`contact:${contactId}`, contact);
    console.log('✅ Contact submission received:', contactId);
    return c.json({ success: true, message: 'Contact submission received successfully', data: contact });
  } catch (error) {
    console.error('Error saving contact submission:', error);
    return c.json({ success: false, error: 'Failed to save contact submission' }, 500);
  }
});

// GET all contact submissions (Admin)
app.get('/make-server-9d116660/admin/contacts', verifyAuth, async (c) => {
  try {
    const allContacts = await kv.getByPrefix('contact:');
    allContacts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return c.json({ success: true, data: allContacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return c.json({ success: false, error: 'Failed to fetch contacts' }, 500);
  }
});

// GET single contact submission (Admin)
app.get('/make-server-9d116660/admin/contacts/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const contact = await kv.get(`contact:${id}`);
    if (!contact) {
      return c.json({ success: false, error: 'Contact not found' }, 404);
    }
    return c.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return c.json({ success: false, error: 'Failed to fetch contact' }, 500);
  }
});

// PUT update contact status (Admin)
app.put('/make-server-9d116660/admin/contacts/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const existing = await kv.get(`contact:${id}`);
    if (!existing) {
      return c.json({ success: false, error: 'Contact not found' }, 404);
    }
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
    await kv.set(`contact:${id}`, updated);
    return c.json({ success: true, message: 'Contact updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating contact:', error);
    return c.json({ success: false, error: 'Failed to update contact' }, 500);
  }
});

// DELETE contact submission (Admin)
app.delete('/make-server-9d116660/admin/contacts/:id', verifyAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`contact:${id}`);
    return c.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return c.json({ success: false, error: 'Failed to delete contact' }, 500);
  }
});

// Start server
Deno.serve(app.fetch);