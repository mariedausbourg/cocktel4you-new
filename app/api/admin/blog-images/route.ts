import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { supabase } = await requireAdmin(request);
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Aucun fichier image recu.' }, { status: 400 });
    }

    if (file.type !== 'image/webp') {
      return NextResponse.json({ error: 'L image doit etre convertie en WebP avant upload.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const filePath = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.webp`;
    const { error } = await supabase.storage
      .from('blog-covers')
      .upload(filePath, Buffer.from(arrayBuffer), {
        contentType: 'image/webp',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from('blog-covers').getPublicUrl(filePath);

    return NextResponse.json({
      path: filePath,
      url: data.publicUrl,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'SUPABASE_NOT_CONFIGURED') {
        return NextResponse.json({ error: 'Supabase n est pas configure sur cet environnement.' }, { status: 500 });
      }

      if (error.message === 'UNAUTHORIZED') {
        return NextResponse.json({ error: 'Session admin invalide.' }, { status: 401 });
      }

      if (error.message === 'FORBIDDEN') {
        return NextResponse.json({ error: 'Ce compte n est pas autorise a gerer les images.' }, { status: 403 });
      }
    }

    return NextResponse.json({ error: 'Upload impossible pour le moment.' }, { status: 500 });
  }
}
