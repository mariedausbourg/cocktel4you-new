import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

type Params = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { supabase } = await requireAdmin(request);
    const body = await request.json();

    const { data, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        brand: body.brand ?? null,
        category: body.category,
        description: body.description ?? null,
        price: body.price,
        original_price: body.original_price ?? null,
        stock: body.stock ?? 0,
        badge: body.badge ?? null,
        image_path: body.image_path ?? null,
        image_url: body.image_url ?? null,
        image_alt: body.image_alt ?? null,
        is_active: body.is_active ?? true,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session admin invalide.' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Acces interdit.' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Mise à jour impossible.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { supabase } = await requireAdmin(request);

    // Delete image from storage if exists
    const { data: product } = await supabase
      .from('products')
      .select('image_path')
      .eq('id', params.id)
      .single();

    if (product?.image_path) {
      await supabase.storage.from('product-images').remove([product.image_path]);
    }

    const { error } = await supabase.from('products').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Session admin invalide.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Suppression impossible.' }, { status: 500 });
  }
}
