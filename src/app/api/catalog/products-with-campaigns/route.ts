// src/app/api/catalog/products-with-campaigns/route.ts
import { NextResponse } from 'next/server';

// In-memory store for campaigns
let activeCampaigns: any[] = [];

export async function GET() {
  try {
    const now = new Date();
    
    // Filter only active, valid campaigns with products
    const validCampaigns = activeCampaigns.filter(campaign => {
      const startDate = new Date(campaign.startDate);
      const endDate = new Date(campaign.endDate);
      return campaign.isActive && 
             campaign.displayOnHomepage && 
             startDate <= now && 
             endDate >= now &&
             campaign.selectedProducts && 
             campaign.selectedProducts.length > 0;
    });
    
    const campaignProducts = [];
    
    for (const campaign of validCampaigns) {
      for (const product of campaign.selectedProducts) {
        campaignProducts.push({
          ...product,
          discountPercentage: campaign.value,
          campaignCode: campaign.code,
          campaignName: campaign.name,
          originalPrice: product.price,
          price: Math.round(product.price * (1 - campaign.value / 100))
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      products: campaignProducts,
      campaigns: validCampaigns
    });
  } catch (error) {
    console.error('Error fetching campaign products:', error);
    return NextResponse.json(
      { success: true, products: [], campaigns: [] },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === 'add') {
      activeCampaigns.push(body.campaign);
    } else if (body.action === 'delete') {
      activeCampaigns = activeCampaigns.filter(c => c.id !== body.campaignId);
    } else if (body.action === 'update') {
      const index = activeCampaigns.findIndex(c => c.id === body.campaign.id);
      if (index !== -1) {
        activeCampaigns[index] = body.campaign;
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update campaigns' },
      { status: 500 }
    );
  }
}